import { Router, Request, Response } from "express";
import multer from "multer";
import Group from "../models/Group";
import { getFactory, getVault } from "../services/contract";
import { pinFile, pinJSON, ipfsUrl } from "../services/ipfs";
import { authMiddleware } from "../middleware/auth";

const router  = Router();
const upload  = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

// GET /api/groups — list all groups (chain + cache sync)
router.get("/", async (_req: Request, res: Response) => {
  try {
    const factory = getFactory();
    const groups  = await factory.getGroups();

    // upsert into mongo as a cache
    await Promise.all(groups.map((g: any) =>
      Group.findOneAndUpdate(
        { vaultAddress: g.vault.toLowerCase() },
        { vaultAddress: g.vault.toLowerCase(), name: g.name, emoji: g.emoji, admin: g.admin.toLowerCase() },
        { upsert: true, new: true }
      )
    ));

    res.json(groups);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/groups/:address — group info from chain
router.get("/:address", async (req: Request, res: Response) => {
  try {
    const vault = getVault(req.params.address);
    const info  = await vault.getGroupInfo();
    res.json({
      name:          info.name,
      emoji:         info.emoji,
      admin:         info.groupAdmin,
      memberCount:   info.memberCount.toString(),
      totalExpenses: info.totalExpenses.toString(),
      settled:       info.settled,
      balance:       info.balance.toString(),
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/groups/:address/members
router.get("/:address/members", async (req: Request, res: Response) => {
  try {
    const vault   = getVault(req.params.address);
    const members = await vault.getMembers();
    res.json(members);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/groups/:address/settlements
router.get("/:address/settlements", async (req: Request, res: Response) => {
  try {
    const vault = getVault(req.params.address);
    const [froms, tos, amounts] = await vault.calculateSettlements();
    res.json(froms.map((from: string, i: number) => ({
      from,
      to:     tos[i],
      amount: amounts[i].toString(),
    })));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/groups/:address/receipt — upload receipt to IPFS (auth required)
router.post(
  "/:address/receipt",
  authMiddleware,
  upload.single("receipt"),
  async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        res.status(400).json({ error: "No file uploaded" });
        return;
      }
      const cid = await pinFile(req.file.buffer, req.file.originalname, req.file.mimetype);
      res.json({ cid, url: ipfsUrl(cid) });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
);

// POST /api/groups/:address/expense-meta — pin expense metadata JSON to IPFS (auth required)
router.post("/:address/expense-meta", authMiddleware, async (req: Request, res: Response) => {
  try {
    const { expenseName, amount, category, receiptCid, paidBy, splitAmong } = req.body;
    const cid = await pinJSON({ expenseName, amount, category, receiptCid, paidBy, splitAmong, vault: req.params.address, timestamp: Date.now() });
    res.json({ cid, url: ipfsUrl(cid) });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

import { Router, Request, Response } from "express";
import Expense from "../models/Expense";
import { getVault } from "../services/contract";
import { ipfsUrl } from "../services/ipfs";
import { authMiddleware } from "../middleware/auth";

const router = Router();

// GET /api/expenses/:vaultAddress — get all expenses (chain source of truth)
router.get("/:vaultAddress", async (req: Request, res: Response) => {
  try {
    const vault    = getVault(req.params.vaultAddress);
    const expenses = await vault.getExpenses();

    const result = expenses
      .filter((e: any) => !e.isDeleted)
      .map((e: any) => ({
        id:         e.id.toString(),
        name:       e.name,
        amount:     e.amount.toString(),
        paidBy:     e.paidBy,
        category:   e.category,
        timestamp:  e.timestamp.toString(),
        isEqual:    e.isEqual,
        splitAmong: e.splitAmong,
        shares:     e.shares.map((s: any) => s.toString()),
      }));

    // sync to mongo cache
    await Promise.all(result.map((e: any) =>
      Expense.findOneAndUpdate(
        { vaultAddress: req.params.vaultAddress.toLowerCase(), expenseId: parseInt(e.id) },
        { ...e, vaultAddress: req.params.vaultAddress.toLowerCase(), expenseId: parseInt(e.id) },
        { upsert: true, new: true }
      )
    ));

    // attach any stored IPFS metadata CIDs from mongo
    const cached = await Expense.find({ vaultAddress: req.params.vaultAddress.toLowerCase() }).lean();
    const cidMap = Object.fromEntries(cached.filter((c: any) => c.ipfsCid).map((c: any) => [c.expenseId, c.ipfsCid]));

    res.json(result.map((e: any) => ({
      ...e,
      ipfsCid: cidMap[parseInt(e.id)] ?? null,
      ipfsUrl: cidMap[parseInt(e.id)] ? ipfsUrl(cidMap[parseInt(e.id)]) : null,
    })));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/expenses/:vaultAddress/balance/:member
router.get("/:vaultAddress/balance/:member", async (req: Request, res: Response) => {
  try {
    const vault      = getVault(req.params.vaultAddress);
    const netBalance = await vault.getMemberNetBalance(req.params.member);
    res.json({ member: req.params.member, netBalance: netBalance.toString() });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/expenses/:vaultAddress/:expenseId/ipfs — attach IPFS CID to cached expense (auth required)
router.patch("/:vaultAddress/:expenseId/ipfs", authMiddleware, async (req: Request, res: Response) => {
  try {
    const { ipfsCid } = req.body;
    if (!ipfsCid) { res.status(400).json({ error: "ipfsCid required" }); return; }
    const doc = await Expense.findOneAndUpdate(
      { vaultAddress: req.params.vaultAddress.toLowerCase(), expenseId: parseInt(req.params.expenseId) },
      { ipfsCid },
      { upsert: true, new: true }
    );
    res.json({ ipfsCid: doc.ipfsCid, ipfsUrl: ipfsUrl(ipfsCid) });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

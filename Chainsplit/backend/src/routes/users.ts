import { Router, Request, Response } from "express";
import User from "../models/User";
import { authMiddleware } from "../middleware/auth";

const router = Router();

// GET /api/users/:address — get or create user profile (no auth needed)
router.get("/:address", async (req: Request, res: Response) => {
  try {
    const address = req.params.address.toLowerCase();
    if (!/^0x[0-9a-f]{40}$/i.test(address)) {
      res.status(400).json({ error: "Invalid address" }); return;
    }
    let user = await User.findOne({ address });
    if (!user) user = await User.create({ address });
    res.json(user);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/users/:address — update display name (auth required)
router.put("/:address", authMiddleware, async (req: Request, res: Response) => {
  try {
    const address = req.params.address.toLowerCase();
    if (!/^0x[0-9a-f]{40}$/i.test(address)) {
      res.status(400).json({ error: "Invalid address" }); return;
    }
    // ensure caller can only update their own profile
    if ((req as any).walletAddress !== address) {
      res.status(403).json({ error: "Forbidden" }); return;
    }
    const { displayName } = req.body;
    if (!displayName || typeof displayName !== "string" || displayName.length > 32) {
      res.status(400).json({ error: "displayName must be a string under 32 chars" }); return;
    }
    const user = await User.findOneAndUpdate(
      { address },
      { displayName: displayName.trim() },
      { new: true, upsert: true }
    );
    res.json(user);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

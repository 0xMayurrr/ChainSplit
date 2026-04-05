import { Request, Response, NextFunction } from "express";
import { ethers } from "ethers";

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const address   = req.headers["x-wallet-address"] as string;
  const signature = req.headers["x-wallet-signature"] as string;
  const message   = req.headers["x-wallet-message"] as string;

  if (!address || !signature || !message) {
    res.status(401).json({ error: "Missing auth headers" });
    return;
  }

  try {
    const recovered = ethers.verifyMessage(message, signature);
    if (recovered.toLowerCase() !== address.toLowerCase()) {
      res.status(401).json({ error: "Invalid signature" });
      return;
    }
    (req as any).walletAddress = address.toLowerCase();
    next();
  } catch {
    res.status(401).json({ error: "Signature verification failed" });
  }
}

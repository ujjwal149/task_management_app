import { Request, Response, NextFunction } from "express";
import { verifySessionToken } from "../lib/jwt";

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.cookies?.token) return res.status(401).json({ message: "Unauthorized" });
    req.user = await verifySessionToken(req.cookies.token);
    next();
  } catch {
    return res.status(401).json({ message: "Your session has expired. Please sign in again." });
  }
};

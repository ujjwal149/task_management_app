import { Request, Response, NextFunction } from "express";

import prisma from "../lib/prisma";
import { verifyToken } from "../lib/jwt";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies?.token;

  if (typeof token !== "string" || !token) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  let decoded: ReturnType<typeof verifyToken>;

  try {
    decoded = verifyToken(token);

    if (
      !decoded ||
      typeof decoded.userId !== "string" ||
      !Number.isInteger(decoded.tokenVersion) ||
      decoded.tokenVersion < 0
    ) {
      return res.status(401).json({
        message: "Invalid token. Please sign in again.",
      });
    }
  } catch {
    return res.status(401).json({
      message: "Invalid or expired token. Please sign in again.",
    });
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: decoded.userId,
      },
      select: {
        id: true,
        role: true,
        tokenVersion: true,
      },
    });

    if (
      !user ||
      user.tokenVersion !== decoded.tokenVersion
    ) {
      return res.status(401).json({
        message: "Session expired. Please sign in again.",
      });
    }

    req.user = {
      userId: user.id,
      role: user.role,
    };
  } catch {
    console.error("Authentication database check failed.");

    return res.status(500).json({
      message: "Unable to check your session. Please try again later.",
    });
  }

  next();
};
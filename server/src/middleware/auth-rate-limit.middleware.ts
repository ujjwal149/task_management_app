import { createHash } from "node:crypto";
import { RequestHandler } from "express";
import prisma from "../lib/prisma";

// Database-backed so retries, restarts and multiple instances share limits.
export function authRateLimit(bucket: string, limit: number): RequestHandler {
  return async (req, res, next) => {
    const key = createHash("sha256").update(`${bucket}:${req.ip ?? "unknown"}`).digest("hex");
    try {
      const now = new Date();
      const result = await prisma.$transaction(async tx => {
        await tx.$queryRaw`SELECT pg_advisory_xact_lock(hashtext(${key})::bigint)::text`;
        const old = await tx.authRateLimit.findUnique({ where: { key } });
        if (!old || old.windowStartedAt.getTime() + 15 * 60000 <= now.getTime()) {
          return tx.authRateLimit.upsert({ where: { key },
            create: { key, count: 1, windowStartedAt: now },
            update: { count: 1, windowStartedAt: now } });
        }
        if (old.count >= limit) return { ...old, count: limit + 1 };
        return tx.authRateLimit.update({ where: { key }, data: { count: { increment: 1 } } });
      });
      // The last allowed request is included; subsequent ones are rejected.
      if (result.count > limit) {
        res.setHeader("Retry-After", Math.max(1, Math.ceil((result.windowStartedAt.getTime() + 15 * 60000 - now.getTime()) / 1000)));
        return void res.status(429).json({ message: "Too many attempts. Please try again later." });
      }
      next();
    } catch {
      res.status(503).json({ message: "Authentication is temporarily unavailable." });
    }
  };
}

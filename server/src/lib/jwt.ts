import jwt from "jsonwebtoken";
import prisma from "./prisma";

type JwtPayload = {
  userId: string;
  role: "ADMIN" | "USER";
  tokenVersion: number;
};
export const generateToken = (payload: JwtPayload) =>
  jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "7d", algorithm: "HS256" });
export const verifyToken = (token: string) =>
  jwt.verify(token, process.env.JWT_SECRET!, { algorithms: ["HS256"] }) as JwtPayload;

export async function verifySessionToken(token: string) {
  const decoded = verifyToken(token);
  if (typeof decoded.userId !== "string" || !Number.isInteger(decoded.tokenVersion)) {
    throw new Error("Invalid session");
  }
  const user = await prisma.user.findUnique({ where: { id: decoded.userId },
    select: { id: true, role: true, emailVerifiedAt: true, tokenVersion: true } });
  if (!user?.emailVerifiedAt || user.tokenVersion !== decoded.tokenVersion) {
    throw new Error("Session expired");
  }
  return { userId: user.id, role: user.role, tokenVersion: user.tokenVersion };
}

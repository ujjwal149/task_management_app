import { Request, Response } from "express";
import { User } from "@prisma/client";
import { ZodError } from "zod";
import bcrypt from "bcryptjs";
import prisma from "../lib/prisma";
import { generateToken } from "../lib/jwt";
import { signupSchema } from "../validations/signup.schema";
import { signinSchema } from "../validations/signin.schema";
import { otpRequestSchema, otpVerifySchema, resetPasswordSchema } from "../validations/otp.schema";
import { AuthError, requestOtp, verifyOtp } from "../services/otp.service";

const cookieOptions = () => ({
  httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax" as const,
  path: "/",
});
function startSession(res: Response, user: User) {
  res.cookie("token", generateToken({ userId: user.id, role: user.role, tokenVersion: user.tokenVersion }),
    { ...cookieOptions(), maxAge: 7 * 24 * 60 * 60 * 1000 });
  return { id: user.id, name: user.name, email: user.email, avatar: user.avatar, role: user.role };
}
function authError(res: Response, error: unknown) {
  if (error instanceof ZodError) return res.status(400).json({ message: error.issues[0]?.message ?? "Invalid input." });
  if (error instanceof AuthError) {
    if (error.retryAfter) res.setHeader("Retry-After", error.retryAfter);
    return res.status(error.status).json({ message: error.message });
  }
  // Never log request bodies, passwords, codes, or provider responses.
  return res.status(500).json({ message: "Authentication is temporarily unavailable." });
}

export const signup = async (req: Request, res: Response) => {
  try {
    const data = signupSchema.parse(req.body);
    return res.status(202).json(await requestOtp(data.email, "SIGNUP", data));
  } catch (error) { return authError(res, error); }
};
export const verifySignup = async (req: Request, res: Response) => {
  try {
    const { email, challengeId, code } = otpVerifySchema.parse(req.body);
    const user = await verifyOtp(email, "SIGNUP", challengeId, code);
    return res.status(201).json({ message: "Email verified. Account created.", user: startSession(res, user) });
  } catch (error) { return authError(res, error); }
};
export const requestLoginOtp = async (req: Request, res: Response) => {
  try {
    const { email } = otpRequestSchema.parse(req.body);
    return res.status(202).json(await requestOtp(email, "LOGIN"));
  } catch (error) { return authError(res, error); }
};
export const verifyLoginOtp = async (req: Request, res: Response) => {
  try {
    const { email, challengeId, code } = otpVerifySchema.parse(req.body);
    const user = await verifyOtp(email, "LOGIN", challengeId, code);
    return res.json({ message: "Signed in successfully.", user: startSession(res, user) });
  } catch (error) { return authError(res, error); }
};
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = otpRequestSchema.parse(req.body);
    return res.status(202).json(await requestOtp(email, "RESET_PASSWORD"));
  } catch (error) { return authError(res, error); }
};
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email, challengeId, code, password } = resetPasswordSchema.parse(req.body);
    await verifyOtp(email, "RESET_PASSWORD", challengeId, code, password);
    res.clearCookie("token", cookieOptions());
    return res.json({ message: "Password reset. Please sign in with your new password." });
  } catch (error) { return authError(res, error); }
};
export const signin = async (req: Request, res: Response) => {
  try {
    const data = signinSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user?.password || !(await bcrypt.compare(data.password, user.password))) {
      throw new AuthError(400, "Invalid credentials. You can also sign in with an email code or Google.");
    }
    if (!user.emailVerifiedAt) throw new AuthError(403, "Verify your email by signing in with an email code first.");
    return res.json({ message: "Signin successful.", user: startSession(res, user) });
  } catch (error) { return authError(res, error); }
};
export const logout = (_req: Request, res: Response) => {
  res.clearCookie("token", cookieOptions());
  return res.json({ message: "Logged out successfully." });
};
export const me = async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user!.userId }, select: {
      id: true, name: true, email: true, avatar: true, role: true, createdAt: true,
    } });
    return res.json({ user });
  } catch (error) { return authError(res, error); }
};
export const googleCallback = async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user!.userId } });
    if (!user?.emailVerifiedAt) throw new Error("Unverified email");
    startSession(res, user);
    return res.redirect(`${process.env.CLIENT_URL}/dashboard`);
  } catch {
    return res.redirect(`${process.env.CLIENT_URL}/signin`);
  }
};
export const adminOnly = (_req: Request, res: Response) => res.json({ message: "Welcome Admin!" });

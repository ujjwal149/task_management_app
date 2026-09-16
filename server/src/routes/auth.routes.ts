import { Router } from "express";
import passport from "passport";

import {
  signup,
  verifySignup,
  requestLoginOtp,
  verifyLoginOtp,
  forgotPassword,
  resetPassword,
  signin,
  logout,
  me,
  adminOnly,
  googleCallback,
} from "../controllers/auth.controller";

import { authMiddleware } from "../middleware/auth.middleware";
import { adminMiddleware } from "../middleware/admin.middleware";

import { authRateLimit } from "../middleware/auth-rate-limit.middleware";

const router = Router();
const sendLimit = authRateLimit("otp-send", 20);
const verifyLimit = authRateLimit("otp-verify", 60);

/* ===========================================
   Local Authentication
=========================================== */

router.post("/signup", sendLimit, signup);
router.post("/signup/verify", verifyLimit, verifySignup);
router.post("/otp/request", sendLimit, requestLoginOtp);
router.post("/otp/verify", verifyLimit, verifyLoginOtp);
router.post("/forgot-password", sendLimit, forgotPassword);
router.post("/reset-password", verifyLimit, resetPassword);

router.post("/signin", authRateLimit("password-login", 30), signin);

router.post(
  "/logout",
  logout
);

router.get(
  "/me",
  authMiddleware,
  me
);

router.get(
  "/admin",
  authMiddleware,
  adminMiddleware,
  adminOnly
);

/* ===========================================
   Google OAuth
=========================================== */

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.CLIENT_URL}/signin`,
  }),
  googleCallback
);

export default router;
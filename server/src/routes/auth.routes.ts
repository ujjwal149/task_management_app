import { Router } from "express";
import passport from "passport";

import {
  signup,
  verifySignup,
  signin,
  logout,
  me,
  adminOnly,
  googleCallback,
} from "../controllers/auth.controller";

import { authMiddleware } from "../middleware/auth.middleware";
import { adminMiddleware } from "../middleware/admin.middleware";
import { signupRateLimit } from "../middleware/signupRateLimit.middleware";

import {
  forgotPassword,
  confirmPasswordReset,
} from "../controllers/passwordReset.controller";

import {
  forgotPasswordRateLimit,
  resetPasswordRateLimit,
} from "../middleware/passwordResetRateLimit.middleware";

const router = Router();

/* Local Authentication */

router.post(
  "/signup",
  signupRateLimit,
  signup);

router.post(
  "/signup/verify",
   verifySignup
  );

router.post(
  "/signin",
   signin
  );

router.post(
  "/forgot-password",
  forgotPasswordRateLimit,
  forgotPassword
);

router.post(
  "/reset-password",
  resetPasswordRateLimit,
  confirmPasswordReset
);

router.post(
  "/logout",
  authMiddleware,
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

/* Google OAuth */

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
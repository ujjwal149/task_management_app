import { Request, Response } from "express";
import { ZodError } from "zod";

import {
  forgotPasswordSchema,
  resetPasswordSchema,
} from "../validations/passwordReset.schema";

import {
  requestPasswordReset,
  resetPassword,
} from "../services/passwordReset.service";

export const forgotPassword = async (
  req: Request,
  res: Response
) => {
  try {
    const input = forgotPasswordSchema.parse(req.body);

    const result = await requestPasswordReset(input);

    return res.status(202).json(result);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        message: "Please enter a valid email address.",
      });
    }

    console.error("Password-reset request failed.");

    return res.status(500).json({
      message: "Unable to process your request. Please try again later.",
    });
  }
};

export const confirmPasswordReset = async (
  req: Request,
  res: Response
) => {
  try {
    const input = resetPasswordSchema.parse(req.body);

    const success = await resetPassword(input);

    if (!success) {
      return res.status(400).json({
        message:
          "Invalid or unavailable reset code. Request a new code if needed.",
      });
    }

    return res.status(200).json({
      message:
        "Password reset successfully. Please sign in with your new password.",
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        message:
          error.issues[0]?.message ?? "Invalid reset request.",
      });
    }

    console.error("Password reset failed.");

    return res.status(500).json({
      message:
        "Unable to reset your password. Please try again later.",
    });
  }
};
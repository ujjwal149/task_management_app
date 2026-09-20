import { Request, Response } from "express";
import bcrypt from "bcryptjs";

import prisma from "../lib/prisma";

import { ZodError } from "zod";

import {
  requestSignupVerification,
  verifyPendingSignup,
  SignupRequestError,
} from "../services/signup.service";

import { generateToken } from "../lib/jwt";

import { signupSchema } from "../validations/signup.schema";
import { verifySignupSchema } from "../validations/verifySignup.schema";
import { signinSchema } from "../validations/signin.schema";

//----------------------- SIGN UP---------------//

export const signup = async (
  req: Request,
  res: Response
) => {
  try {
    const data = signupSchema.parse(req.body);

    const result = await requestSignupVerification(data);

    return res.status(202).json(result);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        message:
          error.issues[0]?.message ?? "Invalid signup details.",
      });
    }

    if (error instanceof SignupRequestError) {
      if (error.retryAfter !== undefined) {
        res.setHeader(
          "Retry-After",
          String(error.retryAfter)
        );
      }

      return res.status(error.statusCode).json({
        message: error.message,
        retryAfter: error.retryAfter,
      });
    }

    return res.status(500).json({
      message: "Unable to start signup. Please try again later.",
    });
  }
};

//---------------Verify Signup-------------------//
export const verifySignup = async (
  req: Request,
  res: Response
) => {
  try {
    const data = verifySignupSchema.parse(req.body);

    const user = await verifyPendingSignup(data);

    const token = generateToken({
      userId: user.id,
      role: user.role,
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      message: "Email verified. Account created successfully.",
      user,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        message:
          error.issues[0]?.message ?? "Invalid verification details.",
      });
    }

    if (error instanceof SignupRequestError) {
      return res.status(error.statusCode).json({
        message: error.message,
      });
    }

    return res.status(500).json({
      message: "Unable to complete verification. Please try again later.",
    });
  }
};

//-------------------SIGN IN---------------------//

export const signin = async (
  req: Request,
  res: Response
) => {
  try {

    const data = signinSchema.parse(req.body);

    const user = await prisma.user.findFirst({
      where: {
        email: {
          equals: data.email.trim(),
          mode: "insensitive",
        },
      },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials.",
      });
    }

    /*
      Google users don't have a password.
    */

    if (!user.password) {
      return res.status(400).json({
        message:
          "This account uses Google Sign-In.",
      });
    }

    const passwordMatches =
      await bcrypt.compare(
        data.password,
        user.password
      );

    if (!passwordMatches) {
      return res.status(400).json({
        message: "Invalid credentials.",
      });
    }

    const token = generateToken({
      userId: user.id,
      role: user.role,
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Signin successful.",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
      },
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      message: "Internal server error.",
    });

  }
};

// -----------------------------LOGOUT-----------------//

export const logout = (
  req: Request,
  res: Response
) => {

  res.clearCookie("token", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });

  return res.status(200).json({
    message: "Logged out successfully.",
  });

};

//-------------------- CURRENT USER--------------------//

export const me = async (
  req: Request,
  res: Response
) => {
  try {

    const user =
      await prisma.user.findUnique({
        where: {
          id: req.user!.userId,
        },
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
          role: true,
          createdAt: true,
        },
      });

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    return res.status(200).json({
      user,
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      message: "Internal server error.",
    });

  }
};

//----------------------- GOOGLE CALLBACK------------------//

export const googleCallback = async (
  req: Request,
  res: Response
) => {
  try {

    const user = req.user as {
      userId: string;
      role: "ADMIN" | "USER";
    };

const token = generateToken({
  userId: user.userId,
  role: user.role,});

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.redirect(
      `${process.env.CLIENT_URL}/dashboard`
    );

  } catch (error) {

    console.error(error);

    return res.redirect(
      `${process.env.CLIENT_URL}/signin`
    );

  }
};

//------------------- ADMIN ONLY-----------------------------//

export const adminOnly = async (
  req: Request,
  res: Response
) => {

  return res.status(200).json({
    message: "Welcome Admin!",
  });

};
import { Request, Response } from "express";
import bcrypt from "bcryptjs";

import prisma from "../lib/prisma";

import { generateToken } from "../lib/jwt";

import { signupSchema } from "../validations/signup.schema";
import { signinSchema } from "../validations/signin.schema";

/* ===========================================
   SIGN UP
=========================================== */

export const signup = async (
  req: Request,
  res: Response
) => {
  try {
    const data = signupSchema.parse(req.body);

    const existingUser =
      await prisma.user.findUnique({
        where: {
          email: data.email,
        },
      });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists.",
      });
    }

    const hashedPassword =
      await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
      },
    });

    const token = generateToken({
      userId: user.id,
      role: user.role,
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      message: "User created successfully.",
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

/* ===========================================
   SIGN IN
=========================================== */

export const signin = async (
  req: Request,
  res: Response
) => {
  try {

    const data = signinSchema.parse(req.body);

    const user =
      await prisma.user.findUnique({
        where: {
          email: data.email,
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
      secure: false,
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

/* ===========================================
   LOGOUT
=========================================== */

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

/* ===========================================
   CURRENT USER
=========================================== */

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

/* ===========================================
   GOOGLE CALLBACK
=========================================== */

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
      secure: false,
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

/* ===========================================
   ADMIN ONLY
=========================================== */

export const adminOnly = async (
  req: Request,
  res: Response
) => {

  return res.status(200).json({
    message: "Welcome Admin!",
  });

};
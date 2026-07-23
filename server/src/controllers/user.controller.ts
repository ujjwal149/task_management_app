import { Request, Response } from "express";
import prisma from "../lib/prisma";

/* Get All Users */

export const getUsers = async (
  req: Request,
  res: Response
) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },

      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return res.status(200).json({
      users,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error.",
    });
  }
};

/* Update User Role */

export const updateUserRole = async (
  req: Request<{ userId: string }>,
  res: Response
) => {
  try {
    const { userId } = req.params;

    const { role } = req.body;

    if (
      role !== "ADMIN" &&
      role !== "USER"
    ) {
      return res.status(400).json({
        message: "Invalid role.",
      });
    }

    const user = await prisma.user.update({
      where: {
        id: userId,
      },

      data: {
        role,
      },
    });

    return res.status(200).json({
      message: "Role updated successfully.",
      user,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error.",
    });
  }
};

/* Delete User */

export const deleteUser = async (
  req: Request<{ userId: string }>,
  res: Response
) => {
  try {
    const { userId } = req.params;

    await prisma.user.delete({
      where: {
        id: userId,
      },
    });

    return res.status(200).json({
      message: "User deleted successfully.",
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error.",
    });
  }
};
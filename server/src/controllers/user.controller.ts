import { Request, Response } from "express";
import prisma from "../lib/prisma";
import bcrypt from "bcryptjs";

import {updateProfileSchema,updatePasswordSchema} from "../validations/profile.schema"

import cloudinary from "../config/cloudinary";
import streamifier from "streamifier";

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


//Get My Profile
export const getProfile = async (
  req: Request,
  res: Response
) => {
  try {

    const userId = req.user!.userId;

    const user = await prisma.user.findUnique({

      where: {
        id: userId,
      },

      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },

    });

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    return res.status(200).json(user);

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      message: "Internal server error.",
    });

  }
};

// Update Profile
export const updateProfile = async (
  req: Request,
  res: Response
) => {
  try {

    const userId = req.user!.userId;

    const data =
      updateProfileSchema.parse(req.body);

    const user = await prisma.user.update({

      where: {
        id: userId,
      },

      data: {
        name: data.name,
      },

      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },

    });

    return res.json({

      message: "Profile updated successfully.",

      user,

    });

  } catch (error) {

    console.error(error);

    return res.status(400).json({

      message: "Failed to update profile.",

    });

  }
};

//Update Password
export const updatePassword = async (
  req: Request,
  res: Response
) => {
  try {

    const userId = req.user!.userId;

    const data =
      updatePasswordSchema.parse(req.body);

    const user =
      await prisma.user.findUnique({

        where: {
          id: userId,
        },

      });

    if (!user) {

      return res.status(404).json({
        message: "User not found.",
      });

    }

    const passwordMatches =
      await bcrypt.compare(
        data.currentPassword,
        user.password
      );

    if (!passwordMatches) {

      return res.status(400).json({
        message: "Current password is incorrect.",
      });

    }

    const hashedPassword =
      await bcrypt.hash(
        data.newPassword,
        10
      );

    await prisma.user.update({

      where: {
        id: userId,
      },

      data: {
        password: hashedPassword,
      },

    });

    return res.json({
      message: "Password updated successfully.",
    });

  } catch (error) {

    console.error(error);

    return res.status(400).json({
      message: "Failed to update password.",
    });

  }
};

//Add Profile image 
export const updateAvatar = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = req.user!.userId;

    if (!req.file) {
      return res.status(400).json({
        message: "No image uploaded.",
      });
    }

    // Save req.file into a constant
    const file = req.file;

    const uploadResult = await new Promise<{
      secure_url: string;
    }>((resolve, reject) => {

      const uploadStream =
        cloudinary.uploader.upload_stream(
          {
            folder: "taskflow/avatars",
          },
          (error, result) => {

            if (error || !result) {
              return reject(error);
            }

            resolve({
              secure_url: result.secure_url,
            });

          }
        );

      streamifier
        .createReadStream(file.buffer)
        .pipe(uploadStream);

    });

    const user = await prisma.user.update({

      where: {
        id: userId,
      },

      data: {
        avatar: uploadResult.secure_url,
      },

      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        role: true,
      },

    });

    return res.status(200).json({
      message: "Avatar updated successfully.",
      user,
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      message: "Failed to upload avatar.",
    });

  }
};
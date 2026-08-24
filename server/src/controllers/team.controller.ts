import prisma from "../lib/prisma";
import { Request, Response } from "express";

import {
  inviteMemberService,
} from "../services/team.service";
import { inviteMemberSchema } from "../validations/team.schema";

export const inviteMember = async (
  req: Request,
  res: Response
) => {

  try {

    const validatedData = inviteMemberSchema.parse(req.body)


    const currentUserId =
      req.user!.userId;


    await inviteMemberService({
      ...validatedData,
      currentUserId,
    });


    return res.status(201).json({

      message:
        "Member invited successfully.",

    });

  } catch (error) {

    console.error(error);


    if (
      error instanceof Error
    ) {

      if (
        error.message ===
        "You are not allowed to invite members."
      ) {

        return res.status(403).json({
          message: error.message,
        });

      }


      if (
        error.message ===
        "User not found."
      ) {

        return res.status(404).json({
          message: error.message,
        });

      }


      if (
        error.message ===
        "User is already a member."
      ) {

        return res.status(400).json({
          message: error.message,
        });

      }

    }


    return res.status(500).json({

      message:
        "Internal server error.",

    });

  }
};

//GetProject Member 

export const getProjectMembers = async (
  req: Request<{ projectId: string }>,
  res: Response
) => {
  try {
    const { projectId } = req.params;

    const currentUserId = req.user!.userId;

    // Check if current user belongs to this project
    const membership = await prisma.projectMember.findUnique({
      where: {
        userId_projectId: {
          userId: currentUserId,
          projectId,
        },
      },
    });

    if (!membership) {
      return res.status(403).json({
        message: "Access denied.",
      });
    }

    const members = await prisma.projectMember.findMany({
      where: {
        projectId,
      },

      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },

      orderBy: {
        createdAt: "asc",
      },
    });

    return res.status(200).json({
      members,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error.",
    });
  }
};

  
//Remove Member

export const removeMember = async (
  req: Request<{ memberId: string }>,
  res: Response
) => {
  try {
    const { memberId } = req.params;

    const currentUserId = req.user!.userId;

    // Find membership
    const member = await prisma.projectMember.findUnique({
      where: {
        id: memberId,
      },

      include: {
        project: true,
      },
    });

    if (!member) {
      return res.status(404).json({
        message: "Member not found.",
      });
    }

    // Only project creator can remove members
    if (member.project.creatorId !== currentUserId) {
      return res.status(403).json({
        message: "Access denied.",
      });
    }

    // Prevent removing yourself
    if (member.userId === currentUserId) {
      return res.status(400).json({
        message: "Project owner cannot remove themselves.",
      });
    }

    await prisma.projectMember.delete({
      where: {
        id: memberId,
      },
    });

    return res.status(200).json({
      message: "Member removed successfully.",
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error.",
    });
  }
};
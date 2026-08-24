import prisma from "../lib/prisma";

import {
  InviteMemberInput,
} from "../validations/team.schema";

import {
  notifyProjectInvitation,
} from "./notification.service";

type InviteMemberServiceInput =
  InviteMemberInput & {
    currentUserId: string;
  };


// INVITE MEMBER
export const inviteMemberService = async ({
  email,
  role,
  projectId,
  currentUserId,
}: InviteMemberServiceInput) => {

  // Check project ownership

  const project =
    await prisma.project.findFirst({
      where: {
        id: projectId,
        creatorId: currentUserId,
      },
    });

  if (!project) {
    throw new Error(
      "You are not allowed to invite members."
    );
  }


  // Find invited user

  const user =
    await prisma.user.findUnique({
      where: {
        email,
      },
    });

  if (!user) {
    throw new Error(
      "User not found."
    );
  }


  // Prevent duplicate member

  const existingMember =
    await prisma.projectMember.findUnique({
      where: {
        userId_projectId: {
          userId: user.id,
          projectId,
        },
      },
    });

  if (existingMember) {
    throw new Error(
      "User is already a member."
    );
  }


  // Create membership

  const invitation =
  await prisma.projectInvitation.create({
    data: {
      userId: user.id,
      projectId,
      role,
    },
  });


  // Send real-time notification

  notifyProjectInvitation(
    user.id,
    {
      invitationId: invitation.id,
      
      projectId: project.id,

      projectName:
        project.name,

      invitedBy: {
        id: currentUserId,
        name: "Project Owner",
      },

      role,
    }
  );


  return invitation;
};
// services/invitation.service.ts

import prisma from "../lib/prisma";

export const acceptInvitationService = async ({
  invitationId,
  currentUserId,
}: {
  invitationId: string;
  currentUserId: string;
}) => {

  const invitation =
    await prisma.projectInvitation.findUnique({
      where: {
        id: invitationId,
      },
    });

  if (!invitation) {
    throw new Error("Invitation not found.");
  }

  // Make sure this invitation belongs to
  // the authenticated user.
  if (invitation.userId !== currentUserId) {
    throw new Error("Access denied.");
  }

  if (invitation.status !== "PENDING") {
    throw new Error("Invitation is no longer pending.");
  }

  const membership =
    await prisma.$transaction(async (tx) => {

      const existingMember =
        await tx.projectMember.findUnique({
          where: {
            userId_projectId: {
              userId: currentUserId,
              projectId: invitation.projectId,
            },
          },
        });

      if (existingMember) {
        throw new Error(
          "You are already a member of this project."
        );
      }

      const newMember =
        await tx.projectMember.create({
          data: {
            userId: currentUserId,
            projectId: invitation.projectId,
            role: invitation.role,
          },
        });

      await tx.projectInvitation.update({
        where: {
          id: invitation.id,
        },
        data: {
          status: "ACCEPTED",
        },
      });

      return newMember;
    });

  return membership;
};

//---------------Reject invitation services----------------//
export const rejectInvitationService = async ({
  invitationId,
  currentUserId,
}: {
  invitationId: string;
  currentUserId: string;
}) => {

  const invitation =
    await prisma.projectInvitation.findUnique({
      where: {
        id: invitationId,
      },
    });

  if (!invitation) {
    throw new Error("Invitation not found.");
  }

  if (invitation.userId !== currentUserId) {
    throw new Error("Access denied.");
  }

  if (invitation.status !== "PENDING") {
    throw new Error("Invitation is no longer pending.");
  }

  return prisma.projectInvitation.update({
    where: {
      id: invitationId,
    },
    data: {
      status: "REJECTED",
    },
  });
};
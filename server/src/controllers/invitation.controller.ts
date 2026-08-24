// controllers/invitation.controller.ts

import { Request, Response } from "express";

import {
  invitationIdSchema,
} from "../validations/invitation.schema";

import {
  acceptInvitationService,
  rejectInvitationService,
} from "../services/invitation.service";


export const acceptInvitation = async (
  req: Request,
  res: Response
) => {

  try {

    const {
      invitationId,
    } = invitationIdSchema.parse(req.params);

    const currentUserId =
      req.user!.userId;

    await acceptInvitationService({
      invitationId,
      currentUserId,
    });

    return res.status(200).json({
      message: "Invitation accepted successfully.",
    });

  } catch (error) {

    console.error(error);

    if (error instanceof Error) {

      if (
        error.message ===
        "Invitation not found."
      ) {
        return res.status(404).json({
          message: error.message,
        });
      }

      if (
        error.message ===
        "Access denied."
      ) {
        return res.status(403).json({
          message: error.message,
        });
      }

      if (
        error.message ===
        "Invitation is no longer pending."
      ) {
        return res.status(400).json({
          message: error.message,
        });
      }

      if (
        error.message ===
        "You are already a member of this project."
      ) {
        return res.status(400).json({
          message: error.message,
        });
      }

    }

    return res.status(500).json({
      message: "Internal server error.",
    });
  }
};

//----------------Recject-----------------//
export const rejectInvitation = async (
  req: Request,
  res: Response
) => {

  try {

    const {
      invitationId,
    } = invitationIdSchema.parse(req.params);

    const currentUserId =
      req.user!.userId;

    await rejectInvitationService({
      invitationId,
      currentUserId,
    });

    return res.status(200).json({
      message: "Invitation rejected successfully.",
    });

  } catch (error) {

    console.error(error);

    if (error instanceof Error) {

      if (
        error.message ===
        "Invitation not found."
      ) {
        return res.status(404).json({
          message: error.message,
        });
      }

      if (
        error.message ===
        "Access denied."
      ) {
        return res.status(403).json({
          message: error.message,
        });
      }

      if (
        error.message ===
        "Invitation is no longer pending."
      ) {
        return res.status(400).json({
          message: error.message,
        });
      }

    }

    return res.status(500).json({
      message: "Internal server error.",
    });
  }
};
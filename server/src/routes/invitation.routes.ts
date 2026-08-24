
import { Router } from "express";

import {
  acceptInvitation,
  rejectInvitation,
} from "../controllers/invitation.controller";

import {
  authMiddleware,
} from "../middleware/auth.middleware";

const router = Router();


// Accept invitation
router.post(
  "/:invitationId/accept",
  authMiddleware,
  acceptInvitation
);


// Reject invitation
router.post(
  "/:invitationId/reject",
  authMiddleware,
  rejectInvitation
);


export default router;
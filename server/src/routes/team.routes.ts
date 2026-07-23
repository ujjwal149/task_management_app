import { Router } from "express";

import { authMiddleware } from "../middleware/auth.middleware";

import {
  inviteMember,
  getProjectMembers,removeMember
} from "../controllers/team.controller";

const router = Router();

router.post("/invite", authMiddleware, inviteMember);

router.get("/:projectId", authMiddleware, getProjectMembers);

router.delete("/:memberId", authMiddleware, removeMember);

export default router;
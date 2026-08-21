import { Router } from "express";

import {
  createTask,
  getMyTasks,
  updateTask,
  updateTaskStatus,
  deleteTask,
  getAllTask,
} from "../controllers/task.controller";

import { authMiddleware } from "../middleware/auth.middleware";
import { adminMiddleware } from "../middleware/admin.middleware";

const router = Router();

router.post(
  "/",
  authMiddleware,
  createTask
);

router.get(
  "/",
  authMiddleware,
  getMyTasks
);

// Admin-only global task list
router.get(
  "/all",
  authMiddleware,
  adminMiddleware,
  getAllTask
);

// Update task details - Project ADMIN only
router.put(
  "/:taskId",
  authMiddleware,
  updateTask
);

// Update task status
router.patch(
  "/:taskId/status",
  authMiddleware,
  updateTaskStatus
);

// Delete task - should eventually be Project ADMIN only
router.delete(
  "/:taskId",
  authMiddleware,
  deleteTask
);

export default router;
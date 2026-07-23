import { Router } from "express";

import {
  getUsers,
  updateUserRole,
  deleteUser,
} from "../controllers/user.controller";

import { authMiddleware } from "../middleware/auth.middleware";
import { adminMiddleware } from "../middleware/admin.middleware";

const router = Router();

/* Get All Users */
router.get(
  "/",
  authMiddleware,
  getUsers
);

/* Update User Role */
router.patch(
  "/:userId/role",
  authMiddleware,
  adminMiddleware,
  updateUserRole
);

/* Delete User */
router.delete(
  "/:userId",
  authMiddleware,
  adminMiddleware,
  deleteUser
);

export default router;
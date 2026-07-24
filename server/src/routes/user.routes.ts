import { Router } from "express";

import { 
  getUsers,
   updateUserRole,
    deleteUser,
    getProfile,
     updatePassword,
      updateProfile,
      updateAvatar,
   } from "../controllers/user.controller";

import { authMiddleware } from "../middleware/auth.middleware";
import { adminMiddleware } from "../middleware/admin.middleware";
import upload from "../middleware/upload.middleware";

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

/* Get User */
router.get(
  "/profile",
  authMiddleware,
  getProfile
);

/*Update Profile*/
router.patch(
  "/profile",
  authMiddleware,
  updateProfile
);

/*Update Password*/
router.patch(
  "/password",
  authMiddleware,
  updatePassword
);

/* Upload Avatar */
router.patch(
  "/avatar",
  authMiddleware,
  upload.single("avatar"),
  updateAvatar
);

export default router;
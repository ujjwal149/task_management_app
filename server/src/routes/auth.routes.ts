import {Router} from "express"
import {signup,signin,logout,me,adminOnly} from "../controllers/auth.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { adminMiddleware } from "../middleware/admin.middleware";

const router = Router();

router.post("/signup",signup);
router.post("/signin",signin);
router.post("/logout",authMiddleware,logout)

router.get("/me",authMiddleware,me);

router.get("/admin",authMiddleware,adminMiddleware,adminOnly);

export default router;
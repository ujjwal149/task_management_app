import { Router } from "express";

import { authMiddleware } from "../middleware/auth.middleware";

import { getDashboardAnalytics } from "../controllers/dashboard.controller";

const router = Router();

router.get("/analytics",authMiddleware,getDashboardAnalytics);

export default router;
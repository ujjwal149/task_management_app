import { Router } from "express";

import { createProject,getProjects,getProjectById,updateProject,deleteProject } from "../controllers/project.controller";

import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();


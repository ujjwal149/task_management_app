import {Router} from "express";
import {createTask,getMyTasks,updateTask,deleteTask,getAllTask} from "../controllers/task.controller";
import { authMiddleware} from "../middleware/auth.middleware";
import { adminMiddleware } from "../middleware/admin.middleware";
 

const router = Router();

router.post("/",authMiddleware,createTask);
router.get("/",authMiddleware,getMyTasks);
router.put("/:taskId",authMiddleware,updateTask);
router.delete("/:taskId",authMiddleware,deleteTask);
router.get("/all",authMiddleware,adminMiddleware,getAllTask);

export default router;  
import {Request,Response} from "express";
import prisma from "../lib/prisma";
import {createTaskSchema} from "../validations/task.schema";
import { updateTaskSchema } from "../validations/updateTask.schema";

export const createTask = async (
    req:Request,
    res:Response
)   => {
    try{
        const validatedData = createTaskSchema.parse(req.body);
        
        const userId = req.user!.userId;

        const task = await prisma.task.create({
            data:{
                title:validatedData.title,
                description:validatedData.description,
                dueDate:validatedData.dueDate 
                        ? new Date(validatedData.dueDate):null,
                userId,
            },
            
        });
        return res.status(201).json({
            message:"Task created sucessfully.",
            task,
        });

    }catch(error){
        console.error(error)
        
        return res.status(500).json({
            message:"Internal server error.",
        });

    }
}

export const getMyTasks = async(req:Request,res:Response) =>{
    try{
        const userId = req.user!.userId;
        const tasks = await prisma.task.findMany({
            where:{
                userId,
            }
        });
        return res.status(200).json({
            message:"Task fetch sucessfully!",
            tasks,
        })
    }catch(error){
        console.error(error);

        return res.status(500).json({
            message:"Internal server error."
        })
    }
}

//Update task
export const updateTask = async (
    req: Request,
    res: Response
) => {
    try {

        const validatedData = updateTaskSchema.parse(req.body);

        const { taskId } = req.params;

        const userId = req.user!.userId;

        /** FIND THE TASK */
        const task = await prisma.task.findUnique({
            where: {
                id: taskId,
            },
        });

        /** CHECK IF TASK EXIST * */
        if (!task) {
            return res.status(404).json({
                message: "Task not found.",
            });
        };

        /**OWNERSHIP VERIFICATION **/
        if (task.userId !== userId) {
            return res.status(403).json({
                message: "You are not authorized to update this task.",
            });
        }

        /** UPDATE TASK INSIDE DATABASE */
        const updatedTask = await prisma.task.update({
            where: {
                id: taskId,
            },
            data: {
                status: validatedData.status,
                dueDate: validatedData.dueDate
                    ? new Date(validatedData.dueDate)
                    : undefined,
            },
        });

        return res.status(200).json({
            message: "Task updated successfully",
            task: updatedTask,
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Internal server error",
        });

    }
};

//Delete Task

export const deleteTask = async(
    req: Request,
    res: Response
) => {
    try{
        const {taskId} = req.params;

        const userId = req.user!.userId;

        const task  = await prisma.task.findUnique({
            where:{
                id: taskId,
            },
        });

        /* CHECK IF TASK EXISTS */
        if(!task) {
            return res.status(404).json({
                message: "Task not found",
            })
        };

        /* OWNERSHIP VERIFICATION */
        if (task.userId !== userId){
            return res.status(403).json({
                message: "You are not authorized to delete this task"
            })
        };

        /** DELETE TASK FROM DATABASE */
        const deletedTask = await prisma.task.delete({
            where:{
                id:taskId,
            },
        });
        return res.status(200).json({
            message: "Task deleted successfully.",
            task: deletedTask,
        });
    }catch(error){
        console.error(error);

        return res.status(500).json({
            message: "Internal server error."
        })
    }
};

//Get all task 
export const getAllTask = async(
    req:Request,
    res: Response
) => {
    try{
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;

        const userId = req.user!.userId;

        const user = await prisma.user.findUnique({
            where:{
                id:userId,
            },
        });

        if (!user || user.role !== "ADMIN"){
            return res.status(403).json({
                message: "Access denied.Admin only.",
            });
        }

        const skip = (page-1)*limit;

        const tasks = await prisma.task.findMany({
            skip,
            take: limit,
            orderBy:{
                createdAt:"desc",
            },
            include:{
                user:{
                    select:{
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });

        const totalTasks = await prisma.task.count();

        const totalPages = Math.ceil(totalTasks / limit);

        return res.status(200).json({
            message: "Tasks fetched successfully",
            tasks,
            pagination: {
                page,
                limit,
                totalTasks,
                totalPages,
            },
        });



    }catch(error){
        console.error(error);

        return res.status(500).json({
            message: "Internal server error",
        })
    }
}
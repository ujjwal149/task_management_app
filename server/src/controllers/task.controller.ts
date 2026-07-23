import { Request, Response } from "express";
import prisma from "../lib/prisma";

import { createTaskSchema } from "../validations/task.schema";
import { updateTaskSchema } from "../validations/updateTask.schema";


/* Create Task */

export const createTask = async (
  req: Request,
  res: Response
) => {
  try {
    const validatedData = createTaskSchema.parse(req.body);

    const userId = req.user!.userId;

    const task = await prisma.task.create({
      data: {
        title: validatedData.title,
      
        description: validatedData.description,
      
        priority: validatedData.priority,
      
        dueDate: validatedData.dueDate
          ? new Date(validatedData.dueDate)
          : null,
      
        creatorId: userId,
      
        projectId: validatedData.projectId,
      },
    
      include: {
        project: true,
      },
    });

    return res.status(201).json({
      message: "Task created successfully.",
      task,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error.",
    });
  }
};


/* Get My Tasks */


export const getMyTasks = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = req.user!.userId;

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 9;

    const projectId = req.query.projectId as string | undefined;

    const skip = (page - 1) * limit;

    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where: {

        creatorId: userId,

        ...(projectId && {
        
            projectId,
        
        }),
      
    },
      
        include: {
          project: true,
        },
      
        orderBy: {
          createdAt: "desc",
        },
      
        skip,
        take: limit,
      }),

      prisma.task.count({

      where: {
      
        creatorId: userId,
      
        ...(projectId && {
        
          projectId,
        
        }),
      
      },
    
    }),
    ]);

    return res.status(200).json({
      tasks,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error.",
    });
  }
};


/* Update Task */ 


export const updateTask = async (
  req: Request<{ taskId: string }>,
  res: Response
) => {
  try {
    const validatedData = updateTaskSchema.parse(req.body);

    const { taskId } = req.params;

    const userId = req.user!.userId;

    const task = await prisma.task.findUnique({
      where: {
        id: taskId,
      },
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found.",
      });
    }

    if (task.creatorId !== userId) {
      return res.status(403).json({
        message: "You are not authorized to update this task.",
      });
    }

    const updatedTask = await prisma.task.update({
      where: {
        id: taskId,
      },
      data: {
      title: validatedData.title,

      description: validatedData.description,

      priority: validatedData.priority,

      status: validatedData.status,

      dueDate: validatedData.dueDate
        ? new Date(validatedData.dueDate)
        : undefined,

      projectId: validatedData.projectId,
    },

      include: {
        project: true,
      },
      });

    return res.status(200).json({
      message: "Task updated successfully.",
      task: updatedTask,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error.",
    });
  }
};

/* Delete Task */

export const deleteTask = async (
  req: Request<{ taskId: string }>,
  res: Response
) => {
  try {
    const { taskId } = req.params;

    const userId = req.user!.userId;

    const task = await prisma.task.findUnique({
      where: {
        id: taskId,
      },
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found.",
      });
    }

    if (task.creatorId !== userId) {
      return res.status(403).json({
        message: "You are not authorized to delete this task.",
      });
    }

    const deletedTask = await prisma.task.delete({
      where: {
        id: taskId,
      },
    });

    return res.status(200).json({
      message: "Task deleted successfully.",
      task: deletedTask,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error.",
    });
  }
};

/* Get All Tasks (Admin) */

export const getAllTask = async (
  req: Request,
  res: Response
) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const userId = req.user!.userId;

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user || user.role !== "ADMIN") {
      return res.status(403).json({
        message: "Access denied. Admin only.",
      });
    }

    const skip = (page - 1) * limit;

    const tasks = await prisma.task.findMany({
      skip,
      take: limit,

      orderBy: {
        createdAt: "desc",
      },

      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        project: true,
      },
    });

    const totalTasks = await prisma.task.count();

    const totalPages = Math.ceil(totalTasks / limit);

    return res.status(200).json({
      message: "Tasks fetched successfully.",
      tasks,
      pagination: {
        page,
        limit,
        totalTasks,
        totalPages,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error.",
    });
  }
};
import { Request, Response } from "express";
import prisma from "../lib/prisma";

import {
  sendToProjectRoom,
} from "../websocket/websocket.server";

import { WS_EVENTS } from "../websocket/events";

import { createTaskSchema } from "../validations/task.schema";
import { updateTaskSchema } from "../validations/updateTask.schema";

import {
  updateTaskStatusSchema,
} from "../validations/updateTaskStatus.schema";




//---------------- Create Task----------------//
export const createTask = async (
  req: Request,
  res: Response
) => {
  try { 
    //validate request body
    const validatedData = createTaskSchema.parse(req.body);

    //Get authenticated user
    const userId = req.user!.userId;

    //Check creator's project membership
    const creatorMembership =
      await prisma.projectMember.findUnique({
        where: {
          userId_projectId: {
            userId,
            projectId: validatedData.projectId,
          },
        },
      });
    
      if (!creatorMembership) {
        return res.status(403).json({
          message: "You are not a member of this project.",
        });
      }

      //Only project ADMIN can create tasks
      if (creatorMembership.role !== "ADMIN") {
        return res.status(403).json({
          message: "Only project admins can create tasks.",
        });
      }

    //Verify assignee belongs to project
    const membership =
      await prisma.projectMember.findUnique({
        where: {
          userId_projectId: {
            userId: validatedData.assignToId,
            projectId: validatedData.projectId,
          },
        },
      });

    if (!membership) {
      return res.status(400).json({
        message:
          "Assigned user is not a member of this project.",
      });
    }

    //Create task
    const task = await prisma.task.create({
      data: {
        title: validatedData.title,
      
        description: validatedData.description,
      
        priority: validatedData.priority,
      
        dueDate: validatedData.dueDate
          ? new Date(validatedData.dueDate)
          : null,
      
        creatorId: userId,

        assignToId: validatedData.assignToId,
      
        projectId: validatedData.projectId,
      },
    
      include: {
        project: true,

        creator: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        assignTo: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    });

  // Notify Project Room
   sendToProjectRoom(
    task.projectId,
    WS_EVENTS.TASK_CREATED,
    {
      task,
    }
  );

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


//-----------Get Project Tasks--------------//
export const getMyTasks = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = req.user!.userId;

    const projectId = req.query.projectId as string | undefined;

   // projectId is required
    if (!projectId) {
      return res.status(400).json({
        message: "projectId is required.",
      });
    }

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 9;

    const skip = (page - 1) * limit;


    // Check whether the user belongs to the project
    const membership = await prisma.projectMember.findUnique({
      where: {
        userId_projectId: {
          userId,
          projectId,
        },
      },
    });


    if (!membership) {
      return res.status(403).json({
        message: "You are not a member of this project.",
      });
    }


    // Get all tasks belonging to this project
    const [tasks, total] = await Promise.all([
        prisma.task.findMany({
          where: {
            projectId,
          },

          include: {
            project: true,
                    
            creator: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
          
            assignTo: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
          },

          orderBy: {
            createdAt: "desc",
          },

          skip,
          take: limit,
        }),

        prisma.task.count({
          where: {
            projectId,
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



//------------ Update Task------------------// 
export const updateTask = async (
  req: Request<{ taskId: string }>,
  res: Response
) => {
  try {
    const validatedData =
      updateTaskSchema.parse(req.body);

    const { taskId } = req.params;

    const userId = req.user!.userId;


    // Find existing task
    const existingTask =
      await prisma.task.findUnique({
        where: {
          id: taskId,
        },
      });

    if (!existingTask) {
      return res.status(404).json({
        message: "Task not found.",
      });
    }


    // Determine which project the task
    // will belong to after the update
    const targetProjectId =
      validatedData.projectId ??
      existingTask.projectId;


    // Check whether current user
    // is a member of the target project
    const membership =
      await prisma.projectMember.findUnique({
        where: {
          userId_projectId: {
            userId,
            projectId: targetProjectId,
          },
        },
      });

    if (!membership) {
      return res.status(403).json({
        message:
          "You are not a member of this project.",
      });
    }


    // Only project ADMIN can update tasks
    if (membership.role !== "ADMIN") {
      return res.status(403).json({
        message:
          "Only project admins can update tasks.",
      });
    }


    // Determine assignee after update
    const targetAssignToId =
      validatedData.assignToId ??
      existingTask.assignToId;


    //  If task has an assignee,
    // verify that the assignee belongs
    // to the target project
    if (targetAssignToId) {

      const assigneeMembership =
        await prisma.projectMember.findUnique({
          where: {
            userId_projectId: {
              userId: targetAssignToId,
              projectId: targetProjectId,
            },
          },
        });

      if (!assigneeMembership) {
        return res.status(400).json({
          message:
            "Assigned user is not a member of this project.",
        });
      }
    }


    // Update task
    const updatedTask =
      await prisma.task.update({
        where: {
          id: taskId,
        },

        data: {
          title: validatedData.title,

          description:
            validatedData.description,

          priority:
            validatedData.priority,

          status:
            validatedData.status,

          dueDate:
            validatedData.dueDate
              ? new Date(validatedData.dueDate)
              : undefined,

          projectId:
            validatedData.projectId,

          assignToId:
            validatedData.assignToId,
        },

        include: {
          project: true,

          creator: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },

          assignTo: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
        },
      });


    // Notify project room
    sendToProjectRoom(
      updatedTask.projectId,
      WS_EVENTS.TASK_UPDATED,
      {
        task: updatedTask,
      }
    );


    return res.status(200).json({
      message:
        "Task updated successfully.",
      task: updatedTask,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message:
        "Internal server error.",
    });
  }
};

//--------------Update task status-----------------//
export const updateTaskStatus = async (
  req: Request<{ taskId: string }>,
  res: Response
) => {
  try {
    const { taskId } = req.params;
    const userId = req.user!.userId;

    const validatedData =
      updateTaskStatusSchema.parse(req.body);

    const task = await prisma.task.findUnique({
      where: {
        id: taskId,
      },
      include: {
        project: true,
      },
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found.",
      });
    }

    const membership =
      await prisma.projectMember.findUnique({
        where: {
          userId_projectId: {
            userId,
            projectId: task.projectId,
          },
        },
      });

    if (!membership) {
      return res.status(403).json({
        message: "You are not a member of this project.",
      });
    }

    const isProjectAdmin =
      membership.role === "ADMIN";

    const isAssignedUser =
      task.assignToId === userId;

    if (!isProjectAdmin && !isAssignedUser) {
      return res.status(403).json({
        message:
          "You are not authorized to change this task status.",
      });
    }

    const updatedTask =
      await prisma.task.update({
        where: {
          id: taskId,
        },

        data: {
          status: validatedData.status,
        },

        include: {
          project: true,

          creator: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
          assignTo: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
        },
      });

    sendToProjectRoom(
      updatedTask.projectId,
      WS_EVENTS.TASK_UPDATED,
      {
        task: updatedTask,
      }
    );

    return res.status(200).json({
      message: "Task status updated successfully.",
      task: updatedTask,
    });

  } catch (error) {
    console.error(error);

    return res.status(400).json({
      message: "Failed to update task status.",
    });
  }
};


//-----------------Delete Task--------------------//
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

     // Notify connected project memeber task deleted
    sendToProjectRoom(
      deletedTask.projectId,
      WS_EVENTS.TASK_DELETED,
      {
        taskId: deletedTask.id,
      }
    );

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

//-------------------Get All Tasks (Admin)-------------//
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
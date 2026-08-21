import { Request, Response } from "express";

import prisma from "../lib/prisma";

import { createProjectSchema, updateProjectSchema, } from "../validations/project.schema";



// Create Project
export const createProject = async (
  req: Request,
  res: Response
) => {
  try {

    const userId = req.user!.userId;

    const data =
      createProjectSchema.parse(req.body);

    const project = await prisma.project.create({
      data: {
        name: data.name,
      
        description: data.description,
      
        creatorId: userId,
      
        members: {
          create: {
            userId,
            role: "ADMIN",
          },
        },
      },
    
      include: {
        _count: {
          select: {
            tasks: true,
          },
        },
      },
    });
    return res.status(201).json({
      message: "Project created successfully.",
      project,
    });

  } catch (error) {

    console.error(error);

    return res.status(400).json({
      message: "Failed to create project.",
    });

  }
};

//Get all Project
export const getProjects = async (
  req: Request,
  res: Response
) => {
  try {

    const userId = req.user!.userId;

    const projects =
    await prisma.project.findMany({

    where: {

      OR: [

        {
          creatorId: userId,
        },

        {
          members: {
            some: {
              userId,
            },
          },
        },

      ],

    },

    include: {
      _count: {
        select: {
          tasks: true,
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },

  });
    return res.status(200).json(projects);

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      message: "Failed to fetch projects.",
    });

  }
};


// Get Project
export const getProjectById = async (
  req: Request,
  res: Response
) => {
  try {

    const userId = req.user!.userId;

    const id = req.params.id as string;

    const project =
      await prisma.project.findFirst({

        where: {

          id,

          creatorId: userId,

        },

      });

    if (!project) {

      return res.status(404).json({
        message: "Project not found.",
      });

    }

    return res.status(200).json(project);

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      message: "Failed to fetch project.",
    });

  }
};

// Get Project Members
export const getProjectMembers = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = req.user!.userId;

    const projectId = req.params.id as string;

    // First make sure current user belongs to the project
    const membership =
      await prisma.projectMember.findUnique({
        where: {
          userId_projectId: {
            userId,
            projectId,
          },
        },
      });

    if (!membership) {
      return res.status(403).json({
        message:
          "You are not a member of this project.",
      });
    }

    const members =
      await prisma.projectMember.findMany({
        where: {
          projectId,
        },

        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true,
            },
          },
        },

        orderBy: {
          createdAt: "asc",
        },
      });

    return res.status(200).json(members);

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message:
        "Failed to fetch project members.",
    });
  }
};

//Update Project
export const updateProject = async (
  req: Request,
  res: Response
) => {
  try {

    const userId = req.user!.userId;

    const id = req.params.id as string;

    const data =
      updateProjectSchema.parse(req.body);

    const existingProject =
      await prisma.project.findFirst({

        where: {

          id,

          creatorId: userId,

        },

      });

    if (!existingProject) {

      return res.status(404).json({
        message: "Project not found.",
      });

    }

    const updatedProject =
      await prisma.project.update({
        where: {
          id,
        },
      
        data,
      
        include: {
          _count: {
            select: {
              tasks: true,
            },
          },
        },
      });

    return res.status(200).json({
      message: "Project updated successfully.",
      project: updatedProject,
    });

  } catch (error) {

    console.error(error);

    return res.status(400).json({
      message: "Failed to update project.",
    });

  }
};

//Delete Project 
export const deleteProject = async (
  req: Request,
  res: Response
) => {
  try {

    const userId = req.user!.userId;

    const id = req.params.id as string;

    const existingProject =
      await prisma.project.findFirst({

        where: {

          id,

          creatorId: userId,

        },

      });

    if (!existingProject) {

      return res.status(404).json({
        message: "Project not found.",
      });

    }

    await prisma.project.delete({

      where: {
        id,
      },

    });

    return res.status(200).json({
      message: "Project deleted successfully.",
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      message: "Failed to delete project.",
    });

  }
};
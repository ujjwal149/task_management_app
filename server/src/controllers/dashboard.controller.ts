import { Request, Response } from "express";

import prisma from "../lib/prisma";
export const getDashboardAnalytics = async (
  req: Request,
  res: Response
) => {
  try {

    const userId = req.user!.userId;

    const now = new Date();

    // =========================
    // Overview
    // =========================

    const [
      totalTasks,
      completed,
      todo,
      inProgress,
      overdue,

      lowPriority,
      mediumPriority,
      highPriority,

    ] = await Promise.all([

      prisma.task.count({
        where: {
          creatorId: userId,
        },
      }),

      prisma.task.count({
        where: {
          creatorId: userId,
          status: "DONE",
        },
      }),

      prisma.task.count({
        where: {
          creatorId: userId,
          status: "TODO",
        },
      }),

      prisma.task.count({
        where: {
          creatorId: userId,
          status: "IN_PROGRESS",
        },
      }),

      prisma.task.count({
        where: {
          creatorId: userId,
          dueDate: {
            lt: now,
          },
          NOT: {
            status: "DONE",
          },
        },
      }),

      prisma.task.count({
        where: {
          creatorId: userId,
          priority: "LOW",
        },
      }),

      prisma.task.count({
        where: {
          creatorId: userId,
          priority: "MEDIUM",
        },
      }),

      prisma.task.count({
        where: {
          creatorId: userId,
          priority: "HIGH",
        },
      }),

    ]);

    const completionRate =
      totalTasks === 0
        ? 0
        : Math.round(
            (completed / totalTasks) * 100
          );

    // =========================
    // Status Distribution
    // =========================

    const statusDistribution = [

      {
        status: "TODO",
        count: todo,
      },

      {
        status: "IN_PROGRESS",
        count: inProgress,
      },

      {
        status: "DONE",
        count: completed,
      },

    ];

    // =========================
    // Priority Distribution
    // =========================

    const priorityDistribution = [

      {
        priority: "LOW",
        count: lowPriority,
      },

      {
        priority: "MEDIUM",
        count: mediumPriority,
      },

      {
        priority: "HIGH",
        count: highPriority,
      },

    ];

    // =========================
    // Weekly Activity
    // =========================

    const weeklyActivity = [];

    for (let i = 6; i >= 0; i--) {

      const start = new Date();

      start.setHours(0, 0, 0, 0);

      start.setDate(start.getDate() - i);

      const end = new Date(start);

      end.setHours(23, 59, 59, 999);

      const tasks = await prisma.task.count({

        where: {

          creatorId: userId,

          createdAt: {
            gte: start,
            lte: end,
          },

        },

      });

      weeklyActivity.push({

        day: start.toLocaleDateString("en-US", {
          weekday: "short",
        }),

        tasks,

      });

    }

    return res.status(200).json({

      overview: {

        totalTasks,

        completed,

        todo,

        inProgress,

        overdue,

        completionRate,

      },

      statusDistribution,

      priorityDistribution,

      weeklyActivity,

    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      message: "Internal server error.",
    });

  }
};
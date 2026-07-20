import { Request, Response } from "express";
import prisma from "../lib/prisma";

export const getDashboardAnalytics = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = req.user!.userId;

    const period =
      (req.query.period as string) || "week";

    const now = new Date();

    let startDate: Date | undefined;

    switch (period) {
      case "today":
        startDate = new Date();
        startDate.setHours(0, 0, 0, 0);
        break;

      case "week":
        startDate = new Date();
        startDate.setDate(now.getDate() - 6);
        startDate.setHours(0, 0, 0, 0);
        break;

      case "month":
        startDate = new Date(
          now.getFullYear(),
          now.getMonth(),
          1
        );
        break;

      case "year":
        startDate = new Date(
          now.getFullYear(),
          0,
          1
        );
        break;

      case "all":
      default:
        startDate = undefined;
        break;
    }

    const baseWhere = {
      creatorId: userId,

      ...(startDate && {
        createdAt: {
          gte: startDate,
        },
      }),
    };

    const [
      totalTasks,
      completed,
      todo,
      inProgress,
      overdue,

      lowPriority,
      mediumPriority,
      highPriority,

      upcomingDeadlines,

      recentTasks,

      recentActivity,

    ] = await Promise.all([

      prisma.task.count({
        where: baseWhere,
      }),

      prisma.task.count({
        where: {
          ...baseWhere,
          status: "DONE",
        },
      }),

      prisma.task.count({
        where: {
          ...baseWhere,
          status: "TODO",
        },
      }),

      prisma.task.count({
        where: {
          ...baseWhere,
          status: "IN_PROGRESS",
        },
      }),

      prisma.task.count({
        where: {
          ...baseWhere,
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
          ...baseWhere,
          priority: "LOW",
        },
      }),

      prisma.task.count({
        where: {
          ...baseWhere,
          priority: "MEDIUM",
        },
      }),

      prisma.task.count({
        where: {
          ...baseWhere,
          priority: "HIGH",
        },
      }),

      prisma.task.findMany({
        where: {
          creatorId: userId,

          dueDate: {
            gte: now,
          },

          NOT: {
            status: "DONE",
          },
        },

        orderBy: {
          dueDate: "asc",
        },

        take: 5,

        select: {
          id: true,
          title: true,
          dueDate: true,
          priority: true,
        },
      }),

      // Recent Tasks 
      prisma.task.findMany({
        where: {
          creatorId: userId,
        },

        orderBy: {
          createdAt: "desc",
        },

        take: 5,

        select: {
          id: true,
          title: true,
          status: true,
          createdAt: true,
        },
      }),

      // Recent Activity 
      prisma.task.findMany({
        where: {
          creatorId: userId,
        },

        orderBy: {
          updatedAt: "desc",
        },

        take: 8,

        select: {
          id: true,
          title: true,
          status: true,
          updatedAt: true,
        },
      }),

    ]);

    const completionRate =
      totalTasks === 0
        ? 0
        : Math.round(
            (completed / totalTasks) * 100
          );

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

    const weeklyActivity: {
      day: string;
      tasks: number;
    }[] = [];

    if (period === "today") {

      for (let hour = 0; hour < 24; hour++) {

        const start = new Date();
        start.setHours(hour, 0, 0, 0);

        const end = new Date(start);
        end.setHours(hour, 59, 59, 999);

        const count =
          await prisma.task.count({
            where: {
              creatorId: userId,
              createdAt: {
                gte: start,
                lte: end,
              },
            },
          });

        weeklyActivity.push({
          day: `${hour}:00`,
          tasks: count,
        });

      }

    }

    else if (period === "week") {

      for (let i = 6; i >= 0; i--) {

        const start = new Date();

        start.setHours(0, 0, 0, 0);

        start.setDate(start.getDate() - i);

        const end = new Date(start);

        end.setHours(23, 59, 59, 999);

        const count =
          await prisma.task.count({
            where: {
              creatorId: userId,
              createdAt: {
                gte: start,
                lte: end,
              },
            },
          });

        weeklyActivity.push({
          day: start.toLocaleDateString(
            "en-US",
            {
              weekday: "short",
            }
          ),
          tasks: count,
        });

      }

    }

    else if (period === "month") {

      const days = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        0
      ).getDate();

      for (let day = 1; day <= days; day++) {

        const start = new Date(
          now.getFullYear(),
          now.getMonth(),
          day
        );

        start.setHours(0, 0, 0, 0);

        const end = new Date(start);

        end.setHours(23, 59, 59, 999);

        const count =
          await prisma.task.count({
            where: {
              creatorId: userId,
              createdAt: {
                gte: start,
                lte: end,
              },
            },
          });

        weeklyActivity.push({
          day: String(day),
          tasks: count,
        });

      }

    }

    else if (period === "year") {

      for (let month = 0; month < 12; month++) {

        const start = new Date(
          now.getFullYear(),
          month,
          1
        );

        const end = new Date(
          now.getFullYear(),
          month + 1,
          0,
          23,
          59,
          59
        );

        const count =
          await prisma.task.count({
            where: {
              creatorId: userId,
              createdAt: {
                gte: start,
                lte: end,
              },
            },
          });

        weeklyActivity.push({
          day: start.toLocaleDateString(
            "en-US",
            {
              month: "short",
            }
          ),
          tasks: count,
        });

      }

    }

    else {

      const currentYear = now.getFullYear();

      for (
        let year = currentYear - 4;
        year <= currentYear;
        year++
      ) {

        const start = new Date(year, 0, 1);

        const end = new Date(
          year,
          11,
          31,
          23,
          59,
          59
        );

        const count =
          await prisma.task.count({
            where: {
              creatorId: userId,
              createdAt: {
                gte: start,
                lte: end,
              },
            },
          });

        weeklyActivity.push({
          day: String(year),
          tasks: count,
        });

      }

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

      upcomingDeadlines,

      recentTasks,

      recentActivity,

    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      message: "Internal server error.",
    });

  }
};
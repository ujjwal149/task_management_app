import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import passport from "./config/passport";

import authRoutes from "./routes/auth.routes";
import taskRoutes from "./routes/task.routes";
import dashboardRoutes from "./routes/dashboard.routes";
import projectRoutes from "./routes/project.routes";
import userRoutes from "./routes/user.routes";
import teamRoutes from "./routes/team.routes";

const app = express();

/* ----------------------------- */
/* Middlewares */
/* ----------------------------- */

app.use(express.json());

app.use(cookieParser());

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

/*
  We ONLY use passport to authenticate Google.

  We DO NOT use passport sessions because
  the project already uses JWT cookies.
*/
app.use(passport.initialize());

/* ----------------------------- */
/* Health Check */
/* ----------------------------- */

app.get("/", (req, res) => {
  res.json({
    message: "Server is running",
  });
});

/* ----------------------------- */
/* Routes */
/* ----------------------------- */

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/users", userRoutes);
app.use("/api/team", teamRoutes);

export default app;
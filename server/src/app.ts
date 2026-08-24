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
import invitationRoutes from "./routes/invitation.routes";

const app = express();

app.use(express.json());

app.use(cookieParser());

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(passport.initialize());

app.get("/", (req, res) => {
  res.json({
    message: "Server is running",
  });
});


app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/users", userRoutes);
app.use("/api/team", teamRoutes);

app.use(
  "/api/invitations",
  invitationRoutes
);

export default app;
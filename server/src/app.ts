import express from "express";
import authRoutes from "./routes/auth.routes";
import taskRoutes from "./routes/task.routes"
import cookieParser from "cookie-parser";
import cors from "cors";

import dashboardRoutes from "./routes/dashboard.routes";

import projectRoutes from "./routes/project.routes";


const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,  
}))

app.get("/", (req, res) => {
  res.json({
    message: "Server is running",
  });
});

app.use("/api/auth",authRoutes);

app.use("/api/tasks",taskRoutes);

app.use("/api/dashboard",dashboardRoutes);

app.use("/api/projects", projectRoutes);


export default app;
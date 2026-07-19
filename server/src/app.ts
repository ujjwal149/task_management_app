import express from "express";
import authRoutes from "./routes/auth.routes";
import taskRoutes from "./routes/task.routes"
import cookieParser from "cookie-parser";
import cors from "cors";

import dashboardRoutes from "./routes/dashboard.routes";


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

export default app;
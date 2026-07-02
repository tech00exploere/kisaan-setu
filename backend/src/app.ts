import express from "express";
import cors from "cors";
import authRoutes from "./modules/auth/auth.routes";
import farmerRoutes from "../farmer"; // <-- added farmer routes

const app = express();

app.use(express.json());

app.use(
  cors({
    origin:
      process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(
  "/api/auth",
  authRoutes
);

app.use("/api/farmer", farmerRoutes);
export default app;
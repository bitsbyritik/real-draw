import express, { Router } from "express";
const router: Router = express.Router();
import authRoutes from "./authRoutes";
import { roomController } from "../controllers/roomController";
import { middleware } from "../middlewares/middlewares";

router.use("/auth", authRoutes);
router.post("/room", middleware, roomController);

export default router;

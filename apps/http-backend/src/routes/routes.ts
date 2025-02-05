import { Router } from "express";
const router = Router();
import authRoutes from "./authRoutes";
import { roomController } from "../controllers/roomController";
import { middleware } from "../middlewares/middlewares";

router.use("/auth", authRoutes);
router.use("/room", middleware, roomController);

export default router;

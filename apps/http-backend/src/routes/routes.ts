import express, { Router } from "express";
const router: Router = express.Router();
import authRoutes from "./authRoutes";
import { roomController } from "../controllers/roomController";
import { middleware } from "../middlewares/middlewares";
import { chatController } from "../controllers/chatController";

router.use("/auth", authRoutes);
router.post("/room", middleware, roomController);
router.get("/chats/:roomId", chatController);

export default router;

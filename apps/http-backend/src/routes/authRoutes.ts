import { Router } from "express";
import { loginUser, registerUser } from "../controllers/authController";
const router = Router();

router.post("/signin", loginUser);
router.post("/signup", registerUser);

export default router;

import jwt from "jsonwebtoken";
import { CreateUserSchema, SigninSchema } from "@repo/common/types";
import { Request, Response } from "express";
import { prisma } from "@repo/db/client";
import { JWT_SECRET } from "@repo/backend-common/config";
import bcrypt from "bcrypt";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const validateData = CreateUserSchema.safeParse(req.body);

    if (!validateData.success) {
      res.json({
        message: "Data valiation failed, Please, check your inputs",
      });
      return;
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        email: validateData.data?.email,
      },
    });

    if (existingUser) {
      res.status(401).json({
        message: "User already exists",
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(validateData.data.password, 10);

    const newUser = await prisma.user.create({
      data: {
        email: validateData.data.email,
        password: hashedPassword,
        name: validateData.data.name,
      },
    });

    const payload = { 
      id: newUser.id
    }

    const token = jwt.sign(payload, JWT_SECRET);

    res.status(200).json({
      message: "Signed up successfully!",
      token: token,
    });
    return;
  } catch (err) {
    res.status(404).json({
      message: "Signed up failed, Please try again!",
      error: err,
    });
    return;
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const validateData = SigninSchema.safeParse(req.body);
    if (!validateData.success) {
      res.status(401).json({
        message: "Data validation failed!",
        error: validateData.error,
      });
      return;
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        email: validateData.data?.email,
      }
    });

    if (!existingUser?.password) {
      return;
    }

    if (!existingUser) {
      res.status(401).json({
        message: "Email does not exists",
      });
    }

    const comparePassword = await bcrypt.compare(
      validateData.data.password,
      existingUser.password,
    );

    if (!comparePassword) {
      res.status(404).json({
        message: "Incorrect Password",
      });
    }

    const payload = {   
      id: existingUser.id
    }

    const token = jwt.sign(payload, JWT_SECRET);
    
    res.status(200).json({
      message: "Signed in successfully",
      token: token,
    });

    return;
  } catch (err) {
    res.status(404).json({
      message: "Login Failed!",
      error: err,
    });
    return;
  }
};

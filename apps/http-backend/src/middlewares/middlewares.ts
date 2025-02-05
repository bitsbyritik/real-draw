import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";

export const middleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization ?? "";
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    if (decoded) {
      req.userId = decoded.userId;
      next();
    } else {
      res.status(403).json({
        message: "Unauthorized",
      });
    }
  } catch (err) {
    console.error(err);
    res.status(404).json({
      message: "Authrozation failed",
      error: err,
    });
  }
};

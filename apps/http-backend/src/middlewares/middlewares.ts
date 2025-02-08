import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";

interface TokenPayload extends JwtPayload {
  id: string;
}

export const middleware = (req: Request, res: Response, next: NextFunction) => {
  try {

    const authHeader = req.headers.authorization;
    if(!authHeader){
      res.status(401).json({
        message: 'Authorization header is required'
      });
      return;
    }

    const token = authHeader.startsWith('Bearer') ? authHeader.split(' ')[1] : authHeader;

    if(!token){
      res.status(401).json({
          message: 'Token is required'
      });
      return;
    }


    const decoded = jwt.verify(token, JWT_SECRET as string) as TokenPayload;
    
    if (decoded && decoded.id) {
      req.userId = decoded.id;
      next();
    } else {
      res.status(403).json({
        message: "Unauthorized",
      });
      return;
    }
  } catch (err) {
    res.status(404).json({
      message: "Authrozation failed",
      error: err,
    });
    return
  }
};

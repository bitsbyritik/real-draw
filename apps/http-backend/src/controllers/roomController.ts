import { CreateRoomSchema } from "@repo/common/types";
import { prisma } from "@repo/db/client";
import { Request, Response } from "express";

export const roomController = async(req: Request, res: Response) => {
  try{
      const validateData = CreateRoomSchema.safeParse(req.body);
      if(!validateData.success){
        res.json({
        message: 'Data validation failed!'
        })
        return;
      }
      
      const userId = req.userId;

      if(!userId){
        res.status(404).json({
          message: 'User not found'
        })
        return;
      }

      const newRoom = await prisma.room.create({
        data:{
          slug: validateData.data.roomName,
          adminId: userId
        }
      });

      res.json({
        roomId: newRoom.id
      })  
    } catch(err) {
      res.status(404).json({
        message: "Room already exists with this name",
      });
      return;
    }
  };

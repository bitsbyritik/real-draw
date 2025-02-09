import { prisma } from "@repo/db/client";
import { Request, Response } from "express";

export const chatController = async (req: Request, res: Response) => {
  try {
    const roomId = Number(req.params.roomId);
    const message = await prisma.chat.findMany({
      where: {
        roomId: roomId,
      },
      orderBy: {
        id: "desc",
      },
      take: 50,
    });

    res.status(200).json({
      message,
    });
    return;
  } catch (e) {
    res.status(400).json({
      message: "Unable to fetch chats",
    });
    return;
  }
};

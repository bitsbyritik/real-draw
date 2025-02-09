import { prisma } from "@repo/db/client";

export const storeMessage = async({roomId, message, userId}:{roomId: number, message: string, userId: string}) => {
    try {
        const msg = await prisma.chat.create({
            data:{
                roomId,
                message,
                userId
            }
        });

        return msg;

    } catch (e) {
        return null;
    }
}
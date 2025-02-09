import { prisma } from "@repo/db/client"

export const getName = async(userId: string) => {
    try{
    const user = await prisma.user.findUnique({
        where:{
            id: userId,
        },
        select:{
            name: true
        }
    });

    return user?.name;
    } catch (e) {
        return null;
    }
}
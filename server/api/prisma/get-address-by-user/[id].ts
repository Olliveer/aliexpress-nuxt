import { PrismaClient, Products } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event: any) => {
  const res = await prisma.adressess.findFirst({
    where: {
      userId: event.context.params.id,
    },
  });

  return res;
});

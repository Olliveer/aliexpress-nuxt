import { PrismaClient, Products } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event: any) => {
  const product = await prisma.products.findFirst({
    where: {
      id: event.context.params.id,
    },
  });

  return product;
});

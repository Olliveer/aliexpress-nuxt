import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event: any) => {
  const products = await prisma.products.findMany();
  return products;
});

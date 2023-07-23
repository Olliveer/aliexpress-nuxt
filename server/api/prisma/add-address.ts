import { PrismaClient, Products } from "@prisma/client";
import { builtinModules } from "module";

const prisma = new PrismaClient();

export default defineEventHandler(async (event: any) => {
  const body = await readBody(event);

  const address = await prisma.adressess.create({
    data: {
      userId: body.userId,
      name: body.name,
      address: body.address,
      zipCode: body.zipCode,
      city: body.city,
      country: body.country,
    },
  });

  return address;
});

import { PrismaClient, Products } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event: any) => {
  const body = await readBody(event);

  const res = await prisma.adressess.update({
    where: {
      id: event.context.params.id,
    },
    data: {
      name: body.name,
      address: body.address,
      zipCode: body.zipCode,
      city: body.city,
      country: body.country,
    },
  });

  return res;
});

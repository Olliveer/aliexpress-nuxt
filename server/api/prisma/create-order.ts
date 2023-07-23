import { PrismaClient, Products } from "@prisma/client";
import { builtinModules } from "module";

const prisma = new PrismaClient();

export default defineEventHandler(async (event: any) => {
  const body = await readBody(event);

  const order = await prisma.orders.create({
    data: {
      userId: body.userId,
      stripeId: body.stripeId,
      name: body.name,
      address: body.address,
      zipCode: body.zipCode,
      city: body.city,
      country: body.country,
    },
  });

  body.products.forEach(async (product: Products) => {
    await prisma.orderItem.create({
      data: {
        orderId: order.id,
        productId: product.id,
      },
    });
  });

  return order;
});

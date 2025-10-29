import { PrismaClient } from "@prisma/client";
import { create } from "domain";
const prisma = new PrismaClient();

export const OrderController = {
  list: async (req, res) => {
    try {
      const orders = await prisma.order.findMany({
        include: {
          user: {
            select: {
              name: true,
            },
          },
          items: {
            include: {
              book: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  userOrders: async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const orders = await prisma.order.findMany({
        where: { userId },
        include: {
          items: { include: { book: true } },
        },
        orderBy: { createdAt: "desc" },
      });
      res.json(orders);
    } catch (error) {
      console.error("userOrders error:", error);
      res.status(500).json({ message: error.message });
    }
  },
  update: async (req, res) => {
    try {
      await prisma.order.update({
        where: {
          id: parseInt(req.params.id),
        },
        data: req.body,
      });
      res.json({ message: "Order updated successfully!!" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  create: async (req, res) => {
    try {
      const {
        userId,
        totalPrice,
        shippingName,
        shippingAddress,
        shippingPhone,
        items,
      } = req.body;
      const order = await prisma.order.create({
        data: {
          userId: parseInt(userId),
          totalPrice,
          status: "Pending",
          shippingName,
          shippingAddress,
          shippingPhone,
          items: {
            create: items.map((item) => ({
              bookId: item.id,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
        include: {
          items: true,
        },
      });

      for (const item of items) {
        await prisma.books.update({
          where: { id: item.id },
          data: {
            quantity: {
              decrement: item.quantity,
            },
          },
        });
      }

      res.json({ message: "Order created successfully!", order });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

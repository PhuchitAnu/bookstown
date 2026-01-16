import prisma from "../prisma/client.js";

export const BookController = {
  create: async (req, res) => {
    try {
      await prisma.books.upsert({
        where: {
          isbn: req.body.isbn,
        },
        update: {
          quantity: {
            increment: req.body.quantity,
          },
        },
        create: {
          isbn: req.body.isbn,
          name: req.body.name,
          author: req.body.author,
          year: req.body.year,
          description: req.body.description,
          category: req.body.category,
          imageUrl: req.body.imageUrl,
          quantity: req.body.quantity,
          fullPrice: req.body.fullPrice,
          price: req.body.price,
          status: req.body.status,
        },
      });
      res.json({ message: "Book created successfully!!" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  list: async (req, res) => {
    try {
      const books = await prisma.books.findMany({
        orderBy: {
          updatedAt: "desc",
        },
      });
      res.json(books);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  listId: async (req, res) => {
    try {
      const books = await prisma.books.findUnique({
        where: {
          id: parseInt(req.params.id),
        },
      });
      if (!books) return res.status(404).json({ error: "Book not found" });
      res.json(books);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  listShow: async (req, res) => {
    try {
      const books = await prisma.books.findMany({
        orderBy: {
          id: "desc",
        },
      });
      res.json(books);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  update: async (req, res) => {
    try {
      await prisma.books.update({
        where: {
          id: parseInt(req.params.id),
        },
        data: {
          isbn: req.body.isbn,
          name: req.body.name,
          author: req.body.author,
          year: req.body.year,
          description: req.body.description,
          category: req.body.category,
          imageUrl: req.body.imageUrl,
          quantity: req.body.quantity,
          fullPrice: req.body.fullPrice,
          price: req.body.price,
          status: req.body.status,
        },
      });
      res.json({ message: "Book updated successfully!!" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  delete: async (req, res) => {
    try {
      await prisma.books.delete({
        where: {
          id: parseInt(req.params.id),
        },
      });
      res.json({ message: "Book deleted successfully!!" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  listByCategory: async (req, res) => {
    try {
      const { category } = req.params;

      if (!category) {
        return res
          .status(400)
          .json({ error: "Category parameter is required" });
      }

      const books = await prisma.books.findMany({
        where: {
          category: {
            equals: category,
            mode: "insensitive",
          },
        },
        orderBy: {
          id: "desc",
        },
      });

      if (books.length === 0) {
        return res
          .status(404)
          .json({ message: `No books found in category '${category}'` });
      }

      res.json(books);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  search: async (req, res) => {
    try {
      const { q } = req.query; // รับคำค้นหาจาก query string เช่น /books/search?q=harry

      if (!q || q.trim() === "") {
        return res.status(400).json({ error: "Search query is required" });
      }

      const books = await prisma.books.findMany({
        where: {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { author: { contains: q, mode: "insensitive" } },
            { description: { contains: q, mode: "insensitive" } },
            { category: { contains: q, mode: "insensitive" } },
          ],
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      if (books.length === 0) {
        return res.status(404).json({ message: "No books found" });
      }

      res.json(books);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

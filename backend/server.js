import express from "express";
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import cors from "cors";

// Configure CORS based on environment
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:3000",
  "https://bookstown.vercel.app",
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      if (
        allowedOrigins.some((allowed) =>
          origin.startsWith(allowed.replace(/\/$/, ""))
        )
      ) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

import bodyParser from "body-parser";
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

import dotenv from "dotenv";
dotenv.config();
const port = process.env.PORT || 3001;

// controllers & middleware
import { UserController } from "./controllers/UserController.js";
import { BookController } from "./controllers/BookController.js";
import { OrderController } from "./controllers/OrderController.js";
import { authenticateToken } from "./middlewares/auth.js";

//
// test
//
app.get("/", (req, res) => {
  res.json({
    message: "Hello World!",
  });
});

//
// User
//
app.post("/api/user/register", UserController.register);
app.post("/api/user/signin", UserController.signin);

// protected (user + admin)
app.get("/api/user/info", authenticateToken(), UserController.info);
app.put(
  "/api/user/updateProfile/:id",
  authenticateToken(),
  UserController.updateProfile
);

//
// Book
//
// admin only for create, update, delete
app.post("/api/book/create", authenticateToken(true), BookController.create);
app.put("/api/book/update/:id", authenticateToken(true), BookController.update);
app.delete(
  "/api/book/delete/:id",
  authenticateToken(true),
  BookController.delete
);

// anyone can list
app.get("/api/book/list", BookController.list);
app.get("/api/book/listShow", BookController.listShow);
app.get("/api/book/search", BookController.search);
app.get("/api/book/listByCategory/:category", BookController.listByCategory);
app.get("/api/book/listId/:id", BookController.listId);

//
// Order
//
// admin only: list all, update order
app.get("/api/order/list", authenticateToken(true), OrderController.list);
app.put(
  "/api/order/update/:id",
  authenticateToken(true),
  OrderController.update
);

// user+admin: create order, view own orders
app.get(
  "/api/order/user/:userId",
  authenticateToken(),
  OrderController.userOrders
);
app.post("/api/order/create", authenticateToken(), OrderController.create);

//
import paymentRoutes from "./routes/payment.js";
app.use("/api/payment", paymentRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

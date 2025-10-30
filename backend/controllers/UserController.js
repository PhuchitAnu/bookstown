import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

import jwt from "jsonwebtoken";

import dotenv from "dotenv";
dotenv.config();

import bcrypt from "bcryptjs";

export const UserController = {
  register: async (req, res) => {
    try {
      const { email, name, username, password } = req.body;
      if (!email || !username || !password) {
        return res
          .status(400)
          .json({ message: "Email, username and password are required" });
      }

      const exist = await prisma.user.findFirst({
        where: {
          OR: [{ username }, { email }],
        },
      });
      if (exist) {
        return res
          .status(400)
          .json({ message: "Username or email already exists" });
      }

      const hashed = await bcrypt.hash(password, 10);

      const user = await prisma.user.create({
        data: {
          email,
          name: name || username,
          username,
          password: hashed,
          role: "user",
          status: "active",
        },
        select: {
          id: true,
          email: true,
          name: true,
          username: true,
          role: true,
        },
      });

      res.status(201).json({ message: "User registered successfully", user });
    } catch (error) {
      console.error("register error:", error);
      res.status(500).json({ message: error.message });
    }
  },

  signin: async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: "Email and password required" });
      }

      const user = await prisma.user.findFirst({
        where: { email, status: "active" },
      });

      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.SECRET_KEY,
        { expiresIn: "8h" }
      );

      res.cookie("token", token, {
        httpOnly: false,
        secure: true, // ใช้ HTTPS เท่านั้นใน production
        sameSite: "none",
        maxAge: 8 * 60 * 60 * 1000, // 8 ชั่วโมง
        path: "/",
      });

      res.status(200).json({
        token,
        name: user.name,
        role: user.role,
        id: user.id,
        email: user.email,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  logout: async (req, res) => {
    try {
      res.clearCookie("token", {
        path: "/", // ต้องตรงกับ path ตอน login
        httpOnly: false, // ถ้า login cookie httpOnly ต้องลบ httpOnly ด้วย
        secure: true,
        sameSite: "none",
      });
      res.status(200).json({ message: "Logout successful" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  info: async (req, res) => {
    try {
      const headers = req.headers.authorization;
      if (!headers)
        return res.status(401).json({ message: "No token provided" });

      const token = headers.split(" ")[1];
      const decoded = jwt.verify(token, process.env.SECRET_KEY);

      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: {
          id: true,
          username: true,
          name: true,
          email: true,
          role: true,
          status: true,
        },
      });

      if (!user) return res.status(404).json({ message: "User not found" });

      res.json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  updateProfile: async (req, res) => {
    try {
      const headers = req.headers.authorization;
      if (!headers)
        return res.status(401).json({ message: "No token provided" });

      const token = headers.split(" ")[1];
      const decoded = jwt.verify(token, process.env.SECRET_KEY);

      const { name, username, email, password } = req.body;

      const data = {};
      if (name) data.name = name;
      if (username) data.username = username;
      if (email) data.email = email;
      if (password) data.password = await bcrypt.hash(password, 10);

      const updatedUser = await prisma.user.update({
        where: { id: decoded.id },
        data,
        select: {
          id: true,
          name: true,
          username: true,
          email: true,
          role: true,
        },
      });

      res.json({ message: "Profile updated successfully", user: updatedUser });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

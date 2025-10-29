import express from "express";
import axios from "axios";
import multer from "multer";
import fs from "fs";
import FormData from "form-data";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

const SLIPOK_BRANCH_ID = process.env.SLIPOK_BRANCH_ID;
const SLIPOK_API_KEY = process.env.SLIPOK_API_KEY;

router.post("/verify-slip", upload.single("file"), async (req, res) => {
  try {
    const fileBuffer = req.file.buffer;
    const originalName = req.file.originalname;
    const amount = Number(req.body.amount);

    const formData = new FormData();
    formData.append("files", fileBuffer, originalName);
    formData.append("amount", amount);
    formData.append("log", "true");

    const slipRes = await axios.post(
      `https://api.slipok.com/api/line/apikey/${SLIPOK_BRANCH_ID}`,
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          "x-authorization": SLIPOK_API_KEY,
        },
      }
    );

    const data = slipRes.data.data;
    if (data && data.amount === amount) {
      return res.json({ status: "success", data });
    } else {
      return res.json({ status: "fail", message: "ยอดเงินไม่ตรงกัน" });
    }
  } catch (err) {
    console.error(err.response?.data || err);
    res.status(400).json({
      status: "fail",
      message: err.response?.data?.message || "ตรวจสอบสลิปไม่สำเร็จ",
    });
  }
});

export default router;

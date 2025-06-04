const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const axios = require("axios");
const FormData = require("form-data");
const jwt = require("jsonwebtoken");

const Resume = require("../models/Resume");
const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

router.post("/upload", upload.single("resume"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  try {
    const form = new FormData();
    form.append("file", fs.createReadStream(req.file.path), req.file.originalname);
    form.append("job_description", req.body.job_description || ""); // ✅ send JD

    const response = await axios.post("http://127.0.0.1:8000/analyze", form, {
    headers: form.getHeaders(),
    });

    const token = req.headers.authorization?.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    await Resume.create({
      userId: decoded.id,
      filename: req.file.originalname,
      match_scores: response.data.match_scores,
      summary: response.data.summary,
      feedback: response.data.feedback,
    });

    fs.unlink(req.file.path, () => {});

    res.status(200).json({
      message: "Resume processed successfully",
      analysis: response.data,
    });

  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Resume analysis failed" });
  }
});

router.get("/history", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const history = await Resume.find({ userId: decoded.id }).sort({ createdAt: -1 });
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

module.exports = router;

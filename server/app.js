const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const resumeRoutes = require("./routes/resume");
const authRoutes = require("./routes/auth");

const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));

app.use("/api/resume", resumeRoutes);
app.use("/api/auth", authRoutes);

module.exports = app;

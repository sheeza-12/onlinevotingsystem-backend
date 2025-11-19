// backend/index.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const http = require("http").createServer(app);
const { Server } = require("socket.io");
const io = new Server(http, { cors: { origin: "*" } });

// attach io
app.set("io", io);
io.on("connection", socket => {
  console.log("socket connected:", socket.id);
  socket.on("disconnect", () => console.log("socket disconnected:", socket.id));
});

// routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/cnic", require("./routes/cnicRoutes"));

// connect db
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connect error:", err));

const PORT = process.env.PORT || 5000;
http.listen(PORT, () => console.log(`Server listening on port ${PORT}`));

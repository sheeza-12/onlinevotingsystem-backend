const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Root
app.get('/', (req, res) => {
  res.json({ message: 'Voting System Backend API' });
});

// ROUTES
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/party", require("./routes/partyRoutes"));
app.use("/api/cnic", require("./routes/cnicRoutes"));

// Socket.io setup
const http = require("http").createServer(app);
const { Server } = require("socket.io");
const io = new Server(http, { cors: { origin: "*" } });
app.set("io", io);

io.on("connection", socket => {
  console.log("socket connected:", socket.id);
  socket.on("disconnect", () => console.log("socket disconnected:", socket.id));
});

// Database connect
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

const PORT = process.env.PORT || 5000;
http.listen(PORT, () => console.log(`🚀 Server running on ${PORT}`));

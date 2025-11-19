
const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const connectDB = require("./config/db");
const partyRoutes = require('./routes/partyRoutes');
const authRoutes = require("./routes/authRoutes");
const path = require('path');

// dotenv.config();
// connectDB();

// const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Voting System Backend API' });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use('/api/party', partyRoutes);

app.listen(process.env.PORT, () =>
  console.log(`🚀 Server running on port ${process.env.PORT}`)
);

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

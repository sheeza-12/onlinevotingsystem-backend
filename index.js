const express = require("express");
const dotenv = require("dotenv");
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



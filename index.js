const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const partyRoutes = require('./routes/partyRoutes');
const authRoutes = require("./routes/authRoutes");
const path = require('path');

dotenv.config();
connectDB();

const app = express();

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

// =======
// const express = require('express');
// const cors = require('cors');
// const dotenv = require('dotenv');
// const connectDB = require('./config/db');
// const partyRoutes = require('./routes/partyRoutes');
// const path = require('path');

// // Load environment variables
// dotenv.config();

// // Initialize express app
// const app = express();

// // Connect to MongoDB
// connectDB();

// // Middleware
// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Serve static files from uploads folder
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // Routes
// app.use('/api/party', partyRoutes);

// // Root route
// app.get('/', (req, res) => {
//   res.json({ message: 'Voting System Backend API' });
// });

// // Start server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
// >>>>>>> 552b49b4a7121a8763955ccfdb67219fd8ac2a11

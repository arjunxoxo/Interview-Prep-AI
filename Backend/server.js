require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

const app = express();

// Import routes
const authRoutes = require("./routes/auth.route");

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the "uploads" directory
app.use("/uploads", express.static(path.join(__dirname, "uploads"), {}));

// Routes
app.use("/api/auth", authRoutes);


app.get("/", (req, res) => {
    res.send("Welcome to the AI Interview Prep Backend!");
});

const PORT = process.env.PORT || 3000;
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
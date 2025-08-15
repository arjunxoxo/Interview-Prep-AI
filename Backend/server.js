require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");

const cors = require("cors");
const path = require("path");

const app = express();

const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
    origin: "*",
    methods: ["GET,POST,PUT,DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads",express.static(path.join(__dirname, "../client/build")));


app.get("/", (req, res) => {
    res.send("Welcome to the AI Interview Prep Backend!");
});

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
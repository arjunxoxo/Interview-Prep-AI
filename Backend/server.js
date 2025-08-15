require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");

const app = express();

const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

app.get("/", (req, res) => {
    res.send("Welcome to the AI Interview Prep Backend!");
});

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

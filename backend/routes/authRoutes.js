const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

const router = express.Router();

// Admin default credentials
const adminUsername = "admin";
const adminPassword = "7110";

// Login Route
router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    if (username === adminUsername && password === adminPassword) {
        return res.json({ role: "admin", redirect: "admin-panel.html" });
    }

    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ msg: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    res.json({ role: user.role, redirect: `${user.role}-dashboard.html` });
});

// Admin adds users
router.post("/register", async (req, res) => {
    const { name, username, password, role } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ msg: "Username taken" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ name, username, password: hashedPassword, role });
    await newUser.save();

    res.json({ msg: "User registered successfully" });
});

module.exports = router;

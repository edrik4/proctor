const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());


// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/proctorDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("MongoDB Connection Error:", err));

// User Schema
const userSchema = new mongoose.Schema({
    name: String,
    username: String,
    password: String,
    role: String // "admin", "student", "teacher"
});
const User = mongoose.model("User", userSchema);

// Default Admin Account
const setupAdmin = async () => {
    const adminExists = await User.findOne({ username: "admin" });
    if (!adminExists) {
        const hashedPassword = await bcrypt.hash("7110", 10);
        await User.create({ name: "Admin", username: "admin", password: hashedPassword, role: "admin" });
        console.log("Admin account created");
    }
};
setupAdmin();

// Login Route
app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: "User not found" });
    console.log(user.password);
    //const isMatch = await bcrypt.compare(password, user.password);*/
    const isMatch = (password == user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    res.json({ message: "Login successful", role: user.role, name: user.name });
});

// Add User Route (Admin Only)
app.post("/addUser", async (req, res) => {
    const { name, username, password, role } = req.body;
    /*const hashedPassword = await bcrypt.hash(password, 10);*/
    const newUser = new User({ name, username, password, role });
    await newUser.save();
    res.json({ message: "User added successfully" });
});

// Fetch student details
app.get("/student/:username", async (req, res) => {
    const { username } = req.params;
    try {
        const student = await User.findOne({ username, role: "student" });
        if (!student) return res.status(404).json({ message: "Student not found" });

        res.json({ name: student.name, username: student.username });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

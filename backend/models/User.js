const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    username: { type: String, unique: true },
    password: String,
    role: { type: String, enum: ["admin", "student", "teacher"] }
});

const User = mongoose.model("User", userSchema);
module.exports = User;

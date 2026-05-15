import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/users.js";

export const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = await User.create({ username, email, password });
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.status(201).json({ token, user: { username: user.username, id: user._id } });
  } catch (err) {
    res.status(400).json({ error: "Signup failed: " + err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.status(200).json({ token, user: { username: user.username, id: user._id } });
  } catch (err) {
    res.status(500).json({ error: "Login error" });
  }
};
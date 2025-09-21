const { validationResult } = require("express-validator");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ message: "Invalid input", errors: errors.array() });

  try {
    const { username,email, password } = req.body;

    // Check if user already exists
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: "Email already exists" });

    // Create user (bcrypt hashes password automatically)
    const user = await User.create({ email, password });

    // Sign JWT (add role: 'user' by default)
    const token = jwt.sign(
      { sub: user._id, role: "user" },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    return res.status(201).json({ token, user: { id: user._id, email: user.email, role: "user" } });
  } catch (e) {
    console.error("Register error:", e);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ message: "Invalid input", errors: errors.array() });

  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await user.compare(password);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { sub: user._id, role: "user" },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    return res.json({ token, user: { id: user._id, email: user.email, role: "user" } });
  } catch (e) {
    console.error("Login error:", e);
    return res.status(500).json({ message: "Server error" });
  }
};

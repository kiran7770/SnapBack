// server/controllers/authController.js
const db = require("../models/db");
const jwt = require("jsonwebtoken");
const { hashPassword, comparePassword } = require("../utils/hash");

const SECRET = process.env.JWT_SECRET || "secretkey";

// Register
exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  const hashed = await hashPassword(password);

  const query = `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`;
  db.run(query, [name, email, hashed], function (err) {
    if (err) return res.status(400).json({ error: "User already exists" });
    res.json({ message: "User registered", userId: this.lastID });
  });
};

// Login
exports.loginUser = (req, res) => {
  const { email, password } = req.body;

  db.get(`SELECT * FROM users WHERE email = ?`, [email], async (err, user) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    try {
      const isMatch = await comparePassword(password, user.password);
      if (!isMatch)
        return res.status(401).json({ error: "Incorrect password" });

      const token = jwt.sign(
        {
          id: user.id,
          name: user.name,
          role: user.role,
          badge: user.badge,
        },
        SECRET,
        { expiresIn: "2h" }
      );

      res.json({ message: "Login successful", token });
    } catch (e) {
      res.status(500).json({ error: "Authentication failed" });
    }
  });
};

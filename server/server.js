// server/server.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const mockupRoutes = require("./routes/mockupRoutes");
const authRoutes = require("./routes/authRoutes");
const storyRoutes = require("./routes/storyRoutes");
const app = express();
const PORT = process.env.PORT || 5000;
const path = require("path");
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
/*
// server/seed.js
const db = require("./models/db");


const mockups = [
  ["Dark Mode UI", "https://via.placeholder.com/300x200?text=Dark+Mode"],
  ["Compact Layout", "https://via.placeholder.com/300x200?text=Compact+Layout"],
  ["AR Navigation", "https://via.placeholder.com/300x200?text=AR+Feature"],
];

mockups.forEach(([title, url]) => {
  db.run("INSERT INTO mockups (title, image_url) VALUES (?, ?)", [title, url]);
});

*/
// Routes

app.use("/api/auth", authRoutes);

app.use("/api/mockups", mockupRoutes);
app.use("/api/stories", storyRoutes);
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

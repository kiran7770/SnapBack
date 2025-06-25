const express = require("express");
const router = express.Router();
const path = require("path");
const db = require("../models/db");
const multer = require("multer");

// --- Multer Setup for Image Uploads ---
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});
const upload = multer({ storage });

// --- GET All Mockups ---
router.get("/", (req, res) => {
  db.all("SELECT * FROM mockups", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// --- Add New Mockup (via JSON, not image) ---
router.post("/", (req, res) => {
  const { title, image_url } = req.body;
  if (!title || !image_url)
    return res.status(400).json({ error: "Missing fields" });

  db.run(
    `INSERT INTO mockups (title, image_url) VALUES (?, ?)`,
    [title, image_url],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Mockup added", id: this.lastID });
    }
  );
});

// --- Add New Mockup (with local image upload) ---
router.post("/upload", upload.single("image"), (req, res) => {
  const { title } = req.body;
  if (!req.file) return res.status(400).json({ error: "No image uploaded" });

  const image_url = `/uploads/${req.file.filename}`;
  db.run(
    `INSERT INTO mockups (title, image_url) VALUES (?, ?)`,
    [title, image_url],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Mockup added", id: this.lastID, image_url });
    }
  );
});

// --- Update Mockup ---
router.put("/:id", (req, res) => {
  const { title, image_url } = req.body;
  const { id } = req.params;

  db.run(
    `UPDATE mockups SET title = ?, image_url = ? WHERE id = ?`,
    [title, image_url, id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Mockup updated" });
    }
  );
});

// --- Delete Mockup ---
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  db.run(`DELETE FROM mockups WHERE id = ?`, [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Mockup deleted" });
  });
});

// --- Vote on a Mockup ---
router.post("/vote", (req, res) => {
  const { user_id, mockup_id, vote_value, comment } = req.body;

  db.run(
    `INSERT INTO votes (user_id, mockup_id, vote_value, comment) VALUES (?, ?, ?, ?)`,
    [user_id, mockup_id, vote_value, comment],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Vote recorded", voteId: this.lastID });
    }
  );

  // After inserting a vote or comment
  db.get(
    `SELECT COUNT(*) as count FROM votes WHERE user_id = ?`,
    [user_id],
    (err, row) => {
      if (!err && row) {
        let badge = "🟡 Newbie";
        if (row.count >= 3) badge = "🟢 Contributor";
        if (row.count >= 5) badge = "🟣 Top Commenter";
        if (row.count >= 8) badge = "🧠 UX Thinker";
        if (row.count >= 10) badge = "🏆 Legend";

        db.run(`UPDATE users SET badge = ? WHERE id = ?`, [badge, user_id]);
      }
    }
  );
});

// --- Get Vote Stats Per Mockup ---
router.get("/stats", (req, res) => {
  const sql = `
      SELECT 
        m.id,
        m.title,
        SUM(CASE WHEN v.vote_value = 'yes' THEN 1 ELSE 0 END) AS yes_votes,
        SUM(CASE WHEN v.vote_value = 'no' THEN 1 ELSE 0 END) AS no_votes
      FROM mockups m
      LEFT JOIN votes v ON v.mockup_id = m.id
      GROUP BY m.id
    `;

  db.all(sql, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

module.exports = router;

// server/routes/storyRoutes.js
const express = require("express");
const router = express.Router();
const db = require("../models/db");

// Submit a story
router.post("/", (req, res) => {
  const { user_id, mockup_id, story_text } = req.body;
  if (!story_text || story_text.length < 10)
    return res
      .status(400)
      .json({ error: "Story must be at least 10 characters." });

  const query = `INSERT INTO stories (user_id, mockup_id, story_text) VALUES (?, ?, ?)`;
  db.run(query, [user_id, mockup_id, story_text], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Story submitted", storyId: this.lastID });
  });
});

// Get all stories
router.get("/", (req, res) => {
  const query = `
    SELECT s.story_text, s.created_at, m.title
    FROM stories s
    JOIN mockups m ON s.mockup_id = m.id
    ORDER BY s.created_at DESC
  `;
  db.all(query, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

module.exports = router;

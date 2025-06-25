// server/models/db.js
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const bcrypt = require("bcrypt");

const db = new sqlite3.Database(
  path.resolve(__dirname, "../snapback.db"),
  (err) => {
    if (err) return console.error(err.message);
    console.log("Connected to SQLite database.");
  }
);

db.serialize(() => {
  // USERS table
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'user',
      badge TEXT DEFAULT 'Newbie',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // MOCKUPS table
  db.run(`
    CREATE TABLE IF NOT EXISTS mockups (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      image_url TEXT NOT NULL
    )
  `);

  // VOTES table
  db.run(`
    CREATE TABLE IF NOT EXISTS votes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      mockup_id INTEGER,
      vote_value TEXT,
      comment TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (mockup_id) REFERENCES mockups(id)
    )
  `);

  // STORIES table
  db.run(`
    CREATE TABLE IF NOT EXISTS stories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      mockup_id INTEGER,
      story_text TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (mockup_id) REFERENCES mockups(id)
    )
  `);

  // Optional: create an admin user only if one doesn't exist
  const adminEmail = "admin@example.com";

  db.get(
    `SELECT * FROM users WHERE email = ?`,
    [adminEmail],
    async (err, row) => {
      if (!row) {
        const hashedPassword = await bcrypt.hash("admin123", 10); // use a real password here
        db.run(
          `INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`,
          ["Admin", adminEmail, hashedPassword, "admin"],
          (err) => {
            if (err) console.error("Error creating admin user:", err.message);
            else console.log("Admin user created.");
          }
        );
      } else {
        console.log("Admin user already exists.");
      }
    }
  );
});

module.exports = db;

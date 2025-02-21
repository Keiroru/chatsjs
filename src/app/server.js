const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Configure your database connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "chatdb",
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err.stack);
    return;
  }
  console.log("Connected to database");
});

// POST endpoint to register a new user
app.post("/register", (req, res) => {
  const { userName, displayName, email, password } = req.body;

  if (!userName || !displayName || !email || !password) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // In production, hash the password here
  const query = `
      INSERT INTO Users (userName, displayName, email, password, status)
      VALUES (?, ?, ?, ?, 'active')
    `;
  db.query(query, [userName, displayName, email, password], (err, results) => {
    if (err) {
      console.error("Registration error:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.status(201).json({ message: "User registered successfully" });
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

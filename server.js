const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { body, validationResult } = require("express-validator");
const { promisify } = require("util");
const { encrypt } = require("./src/app/stuff/crypt");
require('dotenv').config();

const app = express();
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

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

// POST endpoint to register a new user with validations
app.post(
  "/register",
  [
    body("displayName")
      .notEmpty()
      .withMessage("Display name is required")
      .isLength({ min: 4 })
      .withMessage("Display name must be at least 4 characters long"),
    body("email").isEmail().withMessage("A valid email is required"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long")
      .matches(/[a-z]/)
      .withMessage("Password must contain a lowercase letter")
      .matches(/[A-Z]/)
      .withMessage("Password must contain an uppercase letter")
      .matches(/[0-9]/)
      .withMessage("Password must contain a number"),
  ],
  (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { displayName, email, password } = req.body;

    const checkQuery = `
      SELECT * FROM Users 
      WHERE email = ?
    `;
    db.query(checkQuery, [email], (err, results) => {
      if (err) {
        console.error("Error checking for duplicates:", err);
        return res.status(500).json({ error: "Database error" });
      }

      let duplicateErrors = [];
      results.forEach((user) => {
        if (user.email === email) {
          duplicateErrors.push({ msg: "Email already exists", path: "email" });
        }
      });

      if (duplicateErrors.length > 0) {
        return res.status(400).json({ errors: duplicateErrors });
      }

      // In production, hash the password here
      const query = `
        INSERT INTO Users (displayName, email, password, status)
        VALUES (?, ?, ?, 'active')
      `;
      db.query(query, [displayName, email, password], (err, results) => {
        if (err) {
          console.error("Registration error:", err);
          return res.status(500).json({ error: "Database error" });
        }
        res.status(201).json({ message: "User registered successfully" });
      });
    });
  }
);

app.post(
  "/login",
  [
    body("email").notEmpty().withMessage("Email is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    const loginQuery = "SELECT userId, email, password FROM users WHERE email = ? AND password = ?";

    const queryAsync = promisify(db.query).bind(db);

    try {
      const results = await queryAsync(loginQuery, [email, password]);
      if (results.length === 0) {
        return res.status(401).json({ error: "Incorrect Email, Phone Number or Password!" });
      }
      const { userId } = results[0];
      const expiresIn = 60 * 60 * 24 * 7;
      const session = await encrypt({ userId, expiresIn });

      res.cookie("session", session, {
        httpOnly: true,
        maxAge: expiresIn * 1000,
        path: "/",
      });
      res.status(200).json({ message: "Login successful" });
    } catch (err) {
      console.error("Error:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

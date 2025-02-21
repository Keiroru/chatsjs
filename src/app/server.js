const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const { body, validationResult } = require("express-validator");

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

// POST endpoint to register a new user with validations
app.post(
  "/register",
  [
    body("userName")
      .notEmpty()
      .withMessage("Username is required")
      .isLength({ min: 4 })
      .withMessage("Username must be at least 4 characters long"),
    body("displayName")
      .notEmpty()
      .withMessage("Display name is required")
      .isLength({ min: 4 })
      .withMessage("Display name must be at least 4 characters long")
      .custom((value, { req }) => {
        if (value === req.body.userName) {
          throw new Error("Display name cannot be the same as username");
        }
        return true;
      }),
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

    const { userName, displayName, email, password } = req.body;

    const checkQuery = `
      SELECT * FROM Users 
      WHERE userName = ? OR displayName = ? OR email = ?
    `;
    db.query(checkQuery, [userName, displayName, email], (err, results) => {
      if (err) {
        console.error("Error checking for duplicates:", err);
        return res.status(500).json({ error: "Database error" });
      }

      let duplicateErrors = [];
      results.forEach((user) => {
        if (user.userName === userName) {
          duplicateErrors.push({ msg: "Username already exists", path: "userName" });
        }
        if (user.displayName === displayName) {
          duplicateErrors.push({ msg: "Display name already exists", path: "displayName" });
        }
        if (user.email === email) {
          duplicateErrors.push({ msg: "Email already exists", path: "email" });
        }
      });

      if (duplicateErrors.length > 0) {
        return res.status(400).json({ errors: duplicateErrors });
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
  }
);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

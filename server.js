const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const cookieParser = require("cookie-parser");
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


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

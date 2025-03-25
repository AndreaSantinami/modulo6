// backend/server.js
require("dotenv/config");
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const passport = require("passport");

const app = express();

// Passport per Google OAuth: inizializziamo Passport prima di usare le rotte protette
app.use(passport.initialize());
require("./config/passport");

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connessione a MongoDB
connectDB();

// Rotte API
app.use("/api/auth", require("./routes/auth"));
app.use("/api/authors", require("./routes/authors"));
app.use("/api/blogPosts", require("./routes/blogPosts"));

// Avvio del server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

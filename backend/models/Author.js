// backend/models/Author.js
const mongoose = require("mongoose");

const AuthorSchema = new mongoose.Schema(
  {
    nome: { type: String, required: true },
    cognome: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    dataDiNascita: String,
    avatar: String,
    // Rendi la password non obbligatoria per supportare gli utenti OAuth
    password: { type: String, required: false, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Author", AuthorSchema);

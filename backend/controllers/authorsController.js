// backend/controllers/authorsController.js
const Author = require("../models/Author");
const bcrypt = require("bcrypt");
const cloudinary = require("../config/cloudinary");

exports.getAuthors = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const authors = await Author.find()
      .skip((page - 1) * limit)
      .limit(limit)
      .select("-password");
    res.json(authors);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

exports.getAuthorById = async (req, res) => {
  try {
    const author = await Author.findById(req.params.id).select("-password");
    if (!author) return res.status(404).json({ msg: "Author not found" });
    res.json(author);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

exports.createAuthor = async (req, res) => {
  const { nome, cognome, email, dataDiNascita, password } = req.body;
  try {
    let author = await Author.findOne({ email });
    if (author) return res.status(400).json({ msg: "Author already exists" });
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    author = new Author({
      nome,
      cognome,
      email,
      dataDiNascita,
      password: hashedPassword,
    });
    await author.save();
    res.status(201).json(author);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

exports.updateAuthor = async (req, res) => {
  const { nome, cognome, email, dataDiNascita } = req.body;
  try {
    let author = await Author.findById(req.params.id);
    if (!author) return res.status(404).json({ msg: "Author not found" });
    author.nome = nome || author.nome;
    author.cognome = cognome || author.cognome;
    author.email = email || author.email;
    author.dataDiNascita = dataDiNascita || author.dataDiNascita;
    await author.save();
    res.json(author);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

exports.deleteAuthor = async (req, res) => {
  try {
    const author = await Author.findByIdAndDelete(req.params.id);
    if (!author) return res.status(404).json({ msg: "Author not found" });
    res.json({ msg: "Author deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

exports.updateAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: "No file uploaded" });
    }
    const result = await cloudinary.uploader.upload(req.file.path);
    const author = await Author.findById(req.params.id);
    if (!author) return res.status(404).json({ msg: "Author not found" });
    author.avatar = result.secure_url;
    await author.save();
    res.json({ avatar: author.avatar });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

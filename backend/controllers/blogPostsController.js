// backend/controllers/blogPostsController.js
const BlogPost = require("../models/BlogPost");
const Author = require("../models/Author");
const cloudinary = require("../config/cloudinary");

// Crea un nuovo post

exports.createBlogPost = async (req, res) => {
  try {
    const authorId = req.user.id;

    // Se esiste un file "cover", carichiamolo su Cloudinary
    let coverUrl = "";
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      coverUrl = result.secure_url;
    }

    // Leggiamo readTime dal body
    const readTime = {
      value: req.body.readTimeValue,
      unit: req.body.readTimeUnit,
    };

    const newPost = new BlogPost({
      category: req.body.category,
      title: req.body.title,
      cover: coverUrl, // se non c'è file, rimarrà stringa vuota
      readTime,
      content: req.body.content,
      author: authorId,
    });

    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Errore nella creazione del post" });
  }
};


// Ottiene la lista di tutti i post
exports.getBlogPosts = async (req, res) => {
  try {
    const posts = await BlogPost.find().populate("author", "-password");
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

// Ottiene i dettagli di un post (inclusi commenti)
exports.getBlogPostById = async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id).populate("author", "-password");
    if (!post) return res.status(404).json({ msg: "Post not found" });
    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

// Aggiorna un post (solo se l'utente loggato è l'autore)
exports.updateBlogPost = async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: "Post not found" });
    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Not authorized to edit this post" });
    }

    if (req.body.category) post.category = req.body.category;
    if (req.body.title) post.title = req.body.title;
    if (req.body.cover) post.cover = req.body.cover;
    if (req.body.readTime) post.readTime = req.body.readTime;
    if (req.body.content) post.content = req.body.content;

    await post.save();
    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

// Cancella un post (solo se l'utente loggato è l'autore)
exports.deleteBlogPost = async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: "Post not found" });
    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Not authorized to delete this post" });
    }
    await BlogPost.findByIdAndDelete(req.params.id);
    res.json({ msg: "Post deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

// Aggiorna la cover del post (upload file)
exports.updateCover = async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: "Post not found" });
    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Not authorized to update cover" });
    }
    if (!req.file) return res.status(400).json({ msg: "No file uploaded" });
    const result = await cloudinary.uploader.upload(req.file.path);
    post.cover = result.secure_url;
    await post.save();
    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

// Funzioni per gestire i commenti

exports.addComment = async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: "Post not found" });

    post.comments.push({
      text: req.body.text,
      authorName: req.body.authorName,
      authorId: req.user.id,
    });

    await post.save();
    res.status(201).json(post.comments[post.comments.length - 1]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

exports.updateComment = async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: "Post not found" });

    const comment = post.comments.id(req.params.commentId);
    if (!comment) return res.status(404).json({ msg: "Comment not found" });

    if (comment.authorId !== req.user.id) {
      return res.status(403).json({ msg: "Not authorized to edit this comment" });
    }

    comment.text = req.body.text || comment.text;
    await post.save();
    res.json(comment);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: "Post not found" });

    const comment = post.comments.id(req.params.commentId);
    if (!comment) return res.status(404).json({ msg: "Comment not found" });

    // Verifica se l'utente loggato è l'autore del commento
    if (comment.authorId !== req.user.id) {
      return res.status(403).json({ msg: "Not authorized to delete this comment" });
    }

    // In Mongoose 7, subdocumenti non hanno più .remove()
    // Usiamo post.comments.pull(...) per rimuovere il subdocument
    post.comments.pull(comment._id);

    await post.save();
    res.json({ msg: "Comment deleted" });
  } catch (err) {
    console.error("ERRORE DELETE COMMENT:", err);
    res.status(500).send("Server error");
  }
};
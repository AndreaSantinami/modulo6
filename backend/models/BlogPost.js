// backend/models/BlogPost.js
const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  text: String,
  authorName: String,   // Nome dell'autore del commento
  authorId: String,     // ID dell'autore (per controlli)
  createdAt: { type: Date, default: Date.now },
});

const BlogPostSchema = new mongoose.Schema(
  {
    category: { type: String, required: true },
    title: { type: String, required: true },
    cover: { type: String }, // Non required
    readTime: {
      value: { type: Number },
      unit: { type: String }
    },
    // L'autore viene impostato dal token (req.user.id)
    author: { type: mongoose.Schema.Types.ObjectId, ref: "Author", required: true },
    content: String,
    comments: [CommentSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("BlogPost", BlogPostSchema);

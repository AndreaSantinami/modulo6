// backend/routes/blogPosts.js
const express = require("express");
const router = express.Router();
const blogPostsController = require("../controllers/blogPostsController");
const authMiddleware = require("../middleware/auth");
const upload = require("../middleware/upload");

router.post("/", authMiddleware, upload.single("cover"), blogPostsController.createBlogPost);
router.get("/", blogPostsController.getBlogPosts);
router.get("/:id", blogPostsController.getBlogPostById);
router.put("/:id", authMiddleware, blogPostsController.updateBlogPost);
router.delete("/:id", authMiddleware, blogPostsController.deleteBlogPost);
router.patch("/:id/cover", authMiddleware, upload.single("cover"), blogPostsController.updateCover);

// Rotte per i commenti
router.post("/:id/comments", authMiddleware, blogPostsController.addComment);
router.put("/:id/comments/:commentId", authMiddleware, blogPostsController.updateComment);
router.delete("/:id/comments/:commentId", authMiddleware, blogPostsController.deleteComment);

module.exports = router;

// backend/routes/authors.js
const express = require("express");
const router = express.Router();
const authorsController = require("../controllers/authorsController");
const authMiddleware = require("../middleware/auth");
const upload = require("../middleware/upload");

router.get("/", authMiddleware, authorsController.getAuthors);
router.get("/:id", authMiddleware, authorsController.getAuthorById);
router.post("/", authorsController.createAuthor);
router.put("/:id", authMiddleware, authorsController.updateAuthor);
router.delete("/:id", authMiddleware, authorsController.deleteAuthor);
router.patch("/:id/avatar", authMiddleware, upload.single("avatar"), authorsController.updateAvatar);

module.exports = router;

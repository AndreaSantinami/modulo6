// backend/middleware/upload.js
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  // Se vuoi salvare su disco
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  // accetta solo file di tipo immagine
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Not an image!"), false);
  }
};

const upload = multer({ storage, fileFilter });
module.exports = upload;

const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const cloudinary = require('../cloudinaryConfig'); // path to your Cloudinary config
const {
  createCandidate,
  getCandidates,
  getCandidateById,
  updateCandidate,
  deleteCandidate,
  downloadResume,
  generateResumePDF,
} = require("../controllers/candidateController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

/// Set up multer storage to save in backend/uploads/
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "uploads",         // Cloudinary folder to store the file
    access_mode: "public",     // Make the file publicly accessible
    allowed_formats: ["pdf", "docx", "jpg", "png"],  // Allowed file formats
    
  },
});

const upload = multer({ storage });




// CRUD Routes
router.post(
  "/",
  protect,
  upload.single("document"),
  (req, res, next) => {
    // Log the file information to verify the upload
    console.log("Uploaded file:", req.file);
    next();
  },
  createCandidate
);
router.get("/", protect, getCandidates);
router.get("/:id", protect, getCandidateById);
router.put("/:id", protect, updateCandidate);
router.delete("/:id", protect, deleteCandidate);

// Resume Routes
router.get("/:id/download", protect, downloadResume);
router.get("/:id/generate-pdf", protect, generateResumePDF);

module.exports = router;

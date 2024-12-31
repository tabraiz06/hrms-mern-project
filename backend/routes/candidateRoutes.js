const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
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
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../uploads/");

    // Create the uploads directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Use timestamp and original file name for uniqueness
    cb(null, `${Date.now()}-${file.originalname}`);
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

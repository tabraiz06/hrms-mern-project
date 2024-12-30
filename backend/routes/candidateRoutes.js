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

// Set up multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../../frontend/public/files/");

    // Check if the directory exists, if not, create it
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true }); // recursive ensures parent directories are created if missing
    }

    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
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

const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path =require('path')
const {
  createLeave,
  getLeaves,
  updateLeave,
  downloadLeaveDoc,
} = require("../controllers/leaveController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();


/// Set up multer storage to save in backend/uploads/
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require('../cloudinaryConfig')
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "uploads", // Cloudinary folder to store the file
    access_mode: "public", // Make the file publicly accessible
    allowed_formats: ["pdf", "docx", "jpg", "png"], // Allowed file formats
  },
});



const upload = multer({ storage });

// Leave Routes
router.post("/", protect, upload.single("document"), createLeave);
router.get("/", protect, getLeaves);
router.put("/:id", protect, updateLeave);
router.get("/:id/download", protect, downloadLeaveDoc);

module.exports = router;

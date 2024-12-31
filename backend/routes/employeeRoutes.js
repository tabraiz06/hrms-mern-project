const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require('path')
const {
  createEmployee,
  getEmployees,
  updateEmployee,
  deleteEmployee,
} = require("../controllers/employeeController");
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
router.post("/", protect, upload.single("profilePic"), createEmployee);
router.get("/", protect, getEmployees);
router.put("/:id", protect, updateEmployee);
router.delete("/:id", protect, deleteEmployee);

module.exports = router;

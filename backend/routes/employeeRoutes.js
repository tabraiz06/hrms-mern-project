const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const {
  createEmployee,
  getEmployees,
  updateEmployee,
  deleteEmployee,
} = require("../controllers/employeeController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

const cloudinary = require("../cloudinaryConfig");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "uploads",
    access_mode: "public", // Make the file public
  },
});

const upload = multer({ storage });

// CRUD Routes
router.post("/", protect, upload.single("profilePic"), createEmployee);
router.get("/", protect, getEmployees);
router.put("/:id", protect, updateEmployee);
router.delete("/:id", protect, deleteEmployee);

module.exports = router;

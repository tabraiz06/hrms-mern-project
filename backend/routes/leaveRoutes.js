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

const upload = multer({ storage: storage });

// Leave Routes
router.post("/", protect, upload.single("document"), createLeave);
router.get("/", protect, getLeaves);
router.put("/:id", protect, updateLeave);
router.get("/:id/download", protect, downloadLeaveDoc);

module.exports = router;

const express = require("express");
const multer = require("multer");
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
  destination: function (req, file, cb) {
    // Create the 'uploads' directory if it doesn't exist
    const dir = "../front-end/public/files/";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
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

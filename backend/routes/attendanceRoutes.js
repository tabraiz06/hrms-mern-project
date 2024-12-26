const express = require("express");
const {
  createAttendance,
  getAttendanceRecords,
  updateAttendance,
} = require("../controllers/attendanceController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createAttendance);
router.get("/", protect, getAttendanceRecords);
router.put("/:id", protect, updateAttendance);

module.exports = router;

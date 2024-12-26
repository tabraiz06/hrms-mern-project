const express = require("express");
const {
  createEmployee,
  getEmployees,
  updateEmployee,
  deleteEmployee,
} = require("../controllers/employeeController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

// CRUD Routes
router.post("/", protect, createEmployee);
router.get("/", protect, getEmployees);
router.put("/:id", protect, updateEmployee);
router.delete("/:id", protect, deleteEmployee);

module.exports = router;

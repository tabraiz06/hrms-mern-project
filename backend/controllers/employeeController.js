const Employee = require("../models/Employee");
const Attendance = require("../models/Attendance");
const Leave = require("../models/Leave");
const mongoose = require("mongoose");
// Create Employee
exports.createEmployee = async (req, res) => {
  const { name, email, phone, department, role } = req.body;
  const profilePic = req.file ? req.file.path : "";

  try {
    const existEmployee = await Employee.findOne({ email });
    if (existEmployee) {
      return res.status(400).json({ message: "Employee already exists" });
    }
    const employee = await Employee.create({
      userId: req.user.id,
      profilePic,
      name,
      email,
      phone,
      department,
      role,
    });
    res.status(201).json(employee);
  } catch (err) {
    res.status(500).json({ message: "Error creating employee" });
  }
};

// Get All Employees
exports.getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find({ userId: req.user.id });
    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: "Error fetching employees" });
  }
};

// Update Employee
exports.updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(employee);
  } catch (err) {
    res.status(500).json({ message: "Error updating employee" });
  }
};

// Delete Employee
exports.deleteEmployee = async (req, res) => {
  try {
    
    // const employeeId = new mongoose.Types.ObjectId(req.params.id);

    // Remove attendance records of deleted employee
    const attendanceResult = await Attendance.deleteMany({ employeeId : req.params.id });
    await Leave.deleteMany({ employeeId: req.params.id });
    const deletedEmployee = await Employee.findByIdAndDelete({
      _id: req.params.id,
    });
    if (!deletedEmployee) {
      
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json({
      message: "Employee and related attendance records deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting employee:", err.message);
    res.status(500).json({ message: "Error deleting employee" });
  }
};

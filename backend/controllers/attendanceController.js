const Attendance = require("../models/Attendance");

// Create Attendance Record
exports.createAttendance = async (req, res) => {
  const { employeeId, date, status, task } = req.body;
  try {
    const attendance = await Attendance.create({
      employeeId,
      date,
      status,
      task,
    });
    res.status(201).json(attendance);
  } catch (err) {
    res.status(500).json({ message: "Error creating attendance record" });
  }
};

// Get Attendance Records
exports.getAttendanceRecords = async (req, res) => {
  try {
    const { employeeId, date, status } = req.query;

    let query = {};
    if (employeeId) query.employeeId = employeeId;
    if (date) query.date = new Date(date);
    if (status) query.status = status;

    const records = await Attendance.find(query).populate("employeeId", "name");
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: "Error fetching attendance records" });
  }
};

// Update Attendance Record
exports.updateAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(attendance);
  } catch (err) {
    res.status(500).json({ message: "Error updating attendance record" });
  }
};

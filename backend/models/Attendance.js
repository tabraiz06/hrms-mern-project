const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
  },
  date: { type: Date, required: true },
  status: {
    type: String,
    enum: ["Present", "Absent", "On Leave"],
    required: true,
  },
  task: { type: String, required: true },
});

module.exports = mongoose.model("Attendance", attendanceSchema);

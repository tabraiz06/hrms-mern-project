import React, { useEffect, useState } from "react";
import ReusableHeader from "./ReusableHeader";
import { use } from "react";

const initialAttendance = [
  {
    id: 1,
    name: "John Doe",
    department: "Development",
    designation: "Frontend Developer",
    task: "Frontend Project",
    status: "present",
    profileImg: "https://via.placeholder.com/50",
  },
  {
    id: 2,
    name: "Jane Smith",
    department: "HR",
    designation: "HR Manager",
    task: "Recruitment",
    status: "work from home",
    profileImg: "https://via.placeholder.com/50",
  },
  {
    id: 3,
    name: "Alice Johnson",
    department: "Marketing",
    designation: "Marketing Manager",
    task: "Campaign Management",
    status: "absent",
    profileImg: "https://via.placeholder.com/50",
  },
];

const Attendance = () => {
  const [attendance, setAttendance] = useState(initialAttendance);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");
  const fetchAttendance = async () => {
    const res = await fetch("http://localhost:5000/api/employees", {
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token"),
      },
    });
    const data = await res.json();
    
    setAttendance(data);
  };
  useEffect(() => {
    fetchAttendance();
  }, []);
  // Status Options

  const statusOptions = [
    "present",
    "work from home",
    "medical leave",
    "absent",
  ];

  // Filter Function
  const filteredAttendance = attendance.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterDepartment ? item.department === filterDepartment : true)
  );

  const handleStatusUpdate = (id, newStatus) => {
    
    const updatedAttendance = attendance.map((item) =>
      item.id === id ? { ...item, status: newStatus } : item
    );
    setAttendance(updatedAttendance);
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "present":
        return "text-green-500";
      case "work from home":
        return "text-blue-500";
      case "medical leave":
        return "text-yellow-500";
      case "absent":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <div className="p-8">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Attendance</h1>
        <ReusableHeader />
      </div>

      {/* Filter and Search Section */}
      <div className="flex justify-between mb-6">
        <select
          value={filterDepartment}
          onChange={(e) => setFilterDepartment(e.target.value)}
          className="p-2 border rounded-md"
        >
          <option value="">All Departments</option>
          <option value="Development">Development</option>
          <option value="HR">HR</option>
          <option value="Marketing">Marketing</option>
        </select>

        <input
          type="text"
          placeholder="Search by name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border rounded-md w-1/3"
        />
      </div>

      {/* Attendance Table */}
      <div className="overflow-x-auto">
        <table className="w-full bg-white rounded-lg shadow-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-4 px-6">Profile</th>
              <th className="py-4 px-6 text-left">Employee Name</th>
              <th className="py-4 px-6 text-left">Department</th>
              <th className="py-4 px-6 text-left">Designation</th>
              <th className="py-4 px-6 text-left">Task</th>
              <th className="py-4 px-6 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredAttendance.map((employee) => (
              <tr
                key={employee._id}
                className="border-t hover:bg-gray-200 hover:shadow-md transition duration-300"
              >
                <td className="py-4 px-6">
                  <img
                    src="https://t3.ftcdn.net/jpg/06/01/17/18/360_F_601171862_l7yZ0wujj8o2SowiKTUsfLEEx8KunYNd.jpg"
                    alt={employee.name}
                    className="w-10 h-10 rounded-full"
                  />
                </td>
                <td className="py-4 px-6">{employee.name}</td>
                <td className="py-4 px-6">{employee.department}</td>
                <td className="py-4 px-6">{employee.Designation}</td>
                <td className="py-4 px-6">{employee.task}</td>

                {/* Status with Dropdown */}
                <td className="py-4 px-6">
                  <select
                    value={employee.status}
                    onChange={(e) =>
                      handleStatusUpdate(employee.id, e.target.value)
                    }
                    className={`p-2 rounded-md ${getStatusClass(
                      employee.status
                    )}`}
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredAttendance.length === 0 && (
          <p className="text-center py-6 text-gray-500">No records found</p>
        )}
      </div>
    </div>
  );
};

export default Attendance;

import React, { useState, useEffect } from "react";
import axios from "axios";
import ReusableHeader from "./ReusableHeader";

import AddLeaveModal from "./AddLeaveModal";
import { FaBuromobelexperte } from "react-icons/fa";

const LeaveList = () => {
  const [leaves, setLeaves] = useState([]);
  const [filters, setFilters] = useState({ search: "", status: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newLeave, setNewLeave] = useState({
    employeeId: "",
    leaveType: "",
    startDate: "",
    endDate: "",
    reason: "",
    document: null,
  });
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const fetchLeaves = async () => {
      const res = await axios.get("https://hrms-mern-project-backend.vercel.app/api/leaves", {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      console.log(res.data);
      setLeaves(res.data || []);
    };
    fetchLeaves();

    const fetchEmployees = async () => {
      const res = await axios.get(
        "https://hrms-mern-project-backend.vercel.app/api/employees",
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      setEmployees(res.data);
    };
    fetchEmployees();
  }, []);

  const updateLeaveStatus = async (id, status) => {
    const res = await axios.put(
      `https://hrms-mern-project-backend.vercel.app/api/leaves/${id}`,
      {
        status,
      },
      {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      }
    );
    setLeaves(
      leaves.map((leave) =>
        leave._id === id ? { ...leave, status: res.data.status } : leave
      )
    );
  };

  const addLeave = async () => {
    console.log(newLeave);
    const formData = new FormData();
    
    formData.append("employeeId", newLeave.employeeId);
    formData.append("leaveType", newLeave.leaveType);
    formData.append("startDate", newLeave.startDate);
    formData.append("endDate", newLeave.endDate);
    formData.append("reason", newLeave.reason);
    formData.append("document", newLeave.document);


    const res = await axios.post("https://hrms-mern-project-backend.vercel.app/api/leaves", formData,{
      headers: {
        
        Authorization: localStorage.getItem("token"),
      },
    });
    setLeaves([...leaves, res.data]);
    setIsModalOpen(false);
    setNewLeave({
      employeeId: "",
      leaveType: "",
      startDate: "",
      endDate: "",
      reason: "",
      document: null,
    });
  };

  return (
    <div className="container mx-auto mt-8 ">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold">Leaves</h1>
        <ReusableHeader />
      </div>
      <div className="flex justify-between items-center my-4">
        <div className="flex gap-4">
          <select
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="border p-2"
          >
            <option value="">Filter by Status</option>
            <option value="Approved">Approved</option>
            <option value="Pending">Pending</option>
            <option value="Rejected">Rejected</option>
          </select>
          <input
            type="text"
            placeholder="Search by Name"
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="border p-2"
          />
        </div>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => setIsModalOpen(true)}
        >
          Add Leave
        </button>
      </div>

      <table className="min-w-full bg-white text-center">
        <thead>
          <tr>
            <th className="py-2">Employee</th>
            <th className="py-2">Leave Type</th>
            <th className="py-2">Start Date</th>
            <th className="py-2">End Date</th>
            <th className="py-2">Reason</th>
            <th className="py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {leaves.length === 0 && (
            <tr>
              <td colSpan="6" className="py-4">
                No leaves found
              </td>
            </tr>
          )}
          {leaves.length > 0 &&
            leaves.map((leave) => (
              <tr key={leave._id} className="border-b">
                <td className="py-2 flex justify-center items-center gap-4">
                  <img
                    src={`./files/${leave.employeeId.profilePic}`}
                    alt="employee"
                    className="w-10 h-10 object-cover rounded-full"
                  />
                  {leave.employeeId.name}
                </td>
                <td className="py-2">{leave.leaveType}</td>
                <td className="py-2">
                  {new Date(leave.startDate).toLocaleDateString()}
                </td>
                <td className="py-2">
                  {new Date(leave.endDate).toLocaleDateString()}
                </td>
                <td className="py-2">{leave.reason}</td>
                <td className="py-2">
                  <select
                    value={leave.status}
                    onChange={(e) =>
                      updateLeaveStatus(leave._id, e.target.value)
                    }
                    className="border p-2"
                  >
                    <option value="Approved">Approved</option>
                    <option value="Pending">Pending</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {isModalOpen && (
        <AddLeaveModal
          setIsModalOpen={setIsModalOpen}
          newLeave={newLeave}
          setNewLeave={setNewLeave}
          employees={employees}
          addLeave={addLeave}
        />
      )}
    </div>
  );
};

export default LeaveList;

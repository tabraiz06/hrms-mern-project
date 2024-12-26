import React, { useState, useEffect } from "react";
import axios from "axios";
import ReusableHeader from "./ReusableHeader"; // Assuming you have a reusable header component
// import { Menu, MenuItem } from "@material-ui/core"; // Using Material-UI for the menu
// import { HiDotsVertical } from "react-icons/hi";
import AddEmployeeModal from "./AddEmployeeModal";
const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [filters, setFilters] = useState({ search: "", position: "" });
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
 const [isModalOpen, setIsModalOpen] = useState(false);
const fetchEmployees = async () => {
  const res = await axios.get("http://localhost:5000/api/employees", {
    headers: {
      Authorization: localStorage.getItem("token"),
    },
  });
  setEmployees(res.data);
  
};
 useEffect(() => {
    
    fetchEmployees();
  }, []);

  const filteredEmployees = employees.filter((employee) =>
    employee.name.toLowerCase().includes(filters.search.toLowerCase()) &&
    employee.Designation.toLowerCase().includes(filters.position.toLowerCase())
  );

 const addEmployee = async (newEmployee) => {
   const res = await axios.post(
     "http://localhost:5000/api/employees",
     newEmployee,
     {
       headers: {
         Authorization: localStorage.getItem("token"),
       },
     }
   );
   if (res.status === 201) {
     fetchEmployees();
     setIsModalOpen(false);
   }
   else {
      alert("Employee already exists");
    }
   
   
 };

 

  const deleteEmployee = async (id) => {
    await axios.delete(`http://localhost:5000/api/employees/${id}`,{
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    });
    setEmployees(employees.filter((employee) => employee._id !== id));
    
  };

  const handleEditDeleteChange = (event, employee) => {
    setAnchorEl(event.currentTarget);
    setSelectedEmployee(event.value);
    
    // 
    if (event.target.value === "delete") {
      deleteEmployee(employee._id);
    }
  }
  return (
    <div className="container mx-auto mt-8">
      <ReusableHeader />
      <div className="flex justify-between items-center my-4">
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search by Name"
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="border p-2"
          />
          <select
            onChange={(e) =>
              setFilters({ ...filters, position: e.target.value })
            }
            className="border p-2"
          >
            <option value="">Filter by Position</option>
            <option value="Manager">Manager</option>
            <option value="Sales">Sales</option>
            <option value="Admin">Admin</option>
            <option value="Finance">Finance</option>
            <option value="Developer">Developer</option>
            <option value="HR">HR</option>
          </select>
        </div>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => setIsModalOpen(true)}
        >
          Add Employee
        </button>
      </div>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2">Profile Image</th>
            <th className="py-2">Name</th>
            <th className="py-2">Email</th>
            <th className="py-2">Phone Number</th>
            <th className="py-2">Position</th>
            <th className="py-2">Department</th>
            <th className="py-2">Date of Joining</th>
            <th className="py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredEmployees.map((employee) => (
            <tr key={employee._id} className="border-b">
              <td className="py-2">
                <img
                  src="https://t3.ftcdn.net/jpg/07/13/35/82/360_F_713358254_pM12hayFvGkMbXwU1wERawwC2Tu3Mfpy.jpg"
                  alt="Profile"
                  className="w-10 h-10 rounded-full"
                />
              </td>
              <td className="py-2">{employee.name}</td>
              <td className="py-2">{employee.email}</td>
              <td className="py-2">{employee.phone}</td>
              <td className="py-2">{employee.Designation}</td>
              <td className="py-2">{employee.department}</td>
              <td className="py-2">
                {new Date(employee.joinDate).toLocaleDateString()}
              </td>
              <td className="py-2">
                <select name="" id="" onChange={(e) => handleEditDeleteChange(e, employee)}>
                  <option value="">Actions</option>
                  <option value='edit'>Edit</option>
                  <option
                    value='delete'
                    
                  >
                    Delete
                  </option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* //modal for add new employee */}
      <AddEmployeeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={addEmployee}
      />
    </div>
  );
};

export default EmployeeList;
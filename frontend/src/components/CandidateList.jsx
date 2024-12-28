import React, { useEffect, useState } from "react";
import ReusableHeader from "./ReusableHeader";
import AddCandidateModal from "./AddCandidateModal";
import axios from "axios";
import { AiFillX } from "react-icons/ai";

const initialCandidates = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    phone: "123-456-7890",
    position: "Frontend Developer",
    status: "new",
    experience: "3 years",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "987-654-3210",
    position: "Backend Developer",
    status: "rejected",
    experience: "5 years",
  },
  {
    id: 3,
    name: "Emily Johnson",
    email: "emily@example.com",
    phone: "111-222-3333",
    position: "Designer",
    status: "ongoing",
    experience: "2 years",
  },
  {
    id: 4,
    name: "Michael Lee",
    email: "michael@example.com",
    phone: "444-555-6666",
    position: "Manager",
    status: "selected",
    experience: "6 years",
  },
  {
    id: 5,
    name: "Sara Connor",
    email: "sara@example.com",
    phone: "777-888-9999",
    position: "QA Tester",
    status: "pending",
    experience: "4 years",
  },
];

const CandidateList = () => {
  const [candidates, setCandidates] = useState(initialCandidates);
  const [isModalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [positionFilter, setPositionFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const fetchCandidates = async () => {
    const res = await axios.get(
      "https://hrms-mern-project-backend.vercel.app/api/candidates",
      {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      }
    );

    const data = res.data;
    console.log(data);
    setCandidates(data);
  };
  useEffect(() => {
    fetchCandidates();
  }, []);

  const handleSearch = (e) => setSearch(e.target.value);

  const filteredCandidates = candidates.filter(
    (candidate) =>
      candidate.name.toLowerCase().includes(search.toLowerCase()) &&
      (positionFilter ? candidate.position === positionFilter : true) &&
      (statusFilter ? candidate.status === statusFilter : true)
  );

  const handleAddCandidate = async (newCandidate) => {
    console.log(newCandidate);
    const formData = new FormData();
    formData.append("name", newCandidate.name);
    formData.append("email", newCandidate.email);
    formData.append("phone", newCandidate.phone);
    formData.append("position", newCandidate.position);
    formData.append("experience", newCandidate.experience);
    formData.append("document", newCandidate.resume);
    // http://localhost:5000/api/candidates
    // http://localhost:5000/api/candidates/api/candidates

    const res = await axios.post(
      "http://localhost:5000/api/candidates/api/candidates",
      formData,
      {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      }
    );
    console.log(res.data)
    fetchCandidates();
  };

  // Status Options
  const statusOptions = ["new", "rejected", "ongoing", "selected", "pending"];

  // Handle Status Update
  const handleStatusUpdate = async (id, newStatus) => {
    const updateCandidate = await axios.put(
      `https://hrms-mern-project-backend.vercel.app/api/candidates/${id}`,
      { status: newStatus },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
      }
    );

    fetchCandidates();

    // const updatedCandidates = candidates.map((candidate) => {
    //   if (candidate.id === id) {
    //     return { ...candidate, status: newStatus };
    //   }
    //   return candidate;
    // });
    // setCandidates(updatedCandidates);
  };

  const handleDelete = async (id) => {
    const res = await axios.delete(
      `https://hrms-mern-project-backend.vercel.app/api/candidates/${id}`,
      {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      }
    );

    fetchCandidates();
  };
  const getRowClass = (status) => {
    switch (status.toLowerCase()) {
      case "new":
        return "text-gray-500 ";
      case "rejected":
        return "text-red-500 ";
      case "ongoing":
        return "text-green-500 ";
      case "selected":
        return "text-blue-500 ";
      case "pending":
        return "text-yellow-500 ";
      default:
        return "text-gray-500 ";
    }
  };

  return (
    <div className="p-8 h-screen overflow-y-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Candidates</h1>
        <ReusableHeader />
      </div>
      <div className="flex justify-between mb-6">
        <div className="flex gap-4">
          {/* Position Filter */}
          <select
            value={positionFilter}
            onChange={(e) => setPositionFilter(e.target.value)}
            className="border p-2 rounded-lg"
          >
            <option value="">All Positions</option>
            <option value="Frontend Developer">Frontend Developer</option>
            <option value="Backend Developer">Backend Developer</option>
            <option value="Designer">Designer</option>
            <option value="Manager">Manager</option>
            <option value="QA Tester">QA Tester</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border p-2 rounded-lg"
          >
            <option value="">All Status</option>
            <option value="new">New</option>
            <option value="ongoing">Ongoing</option>
            <option value="selected">Selected</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {/* Search and Add Button */}
        <div className="flex gap-4">
          <input
            type="text"
            value={search}
            onChange={handleSearch}
            placeholder="Search by name..."
            className="border p-2 rounded-lg"
          />
          <button
            onClick={() => setModalOpen(true)}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
          >
            + Add Candidate
          </button>
        </div>
      </div>

      <div className="overflow-x-auto overflow-y-auto">
        <table className="w-full bg-white rounded-lg shadow-lg text-center">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-4 px-6 text-left">#</th>
              <th className="py-4 px-6 text-left">Candidate Name</th>
              <th className="py-4 px-6 text-left">Email ID</th>
              <th className="py-4 px-6 text-left">Phone</th>
              <th className="py-4 px-6 text-left">Position</th>
              <th className="py-4 px-6 text-left">Status</th>
              <th className="py-4 px-6 text-left">Experience</th>
              <th className="py-4 px-6 text-left">Resume</th>
              <th className="py-4 px-6 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredCandidates.map((candidate, index) => (
              <tr
                key={candidate._id}
                className={`border-t hover:bg-gray-50 ${getRowClass(
                  candidate.status
                )}`}
              >
                <td className="py-4 px-6">
                  <div className={`box${index}`}></div>
                  {index + 1}
                </td>
                <td className="py-4 px-6">{candidate.name}</td>
                <td className="py-4 px-6">{candidate.email}</td>
                <td className="py-4 px-6">{candidate.phone}</td>
                <td className="py-4 px-6">{candidate.position}</td>

                {/* Status with Dropdown */}
                <td className="py-4 px-6">
                  <select
                    value={candidate.status}
                    onChange={(e) =>
                      handleStatusUpdate(candidate._id, e.target.value)
                    }
                    className={`p-2 rounded-md ${getRowClass(
                      candidate.status
                    )}`}
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                </td>

                <td className="py-4 px-6">{candidate.experience}</td>
                <td className="py-4 px-6">
                  <a
                    href={`./files/${candidate.resume}`}
                    download={candidate.resume}
                    className="text-blue-500 hover:underline"
                  >
                    Download
                  </a>
                </td>
                <td
                  className="py-4 px-6"
                  onClick={() => handleDelete(candidate._id)}
                >
                  <button className="text-red-500 hover:text-red-700">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {candidates.length === 0 && (
          <p className="text-center py-6 text-gray-500">No candidates found</p>
        )}
      </div>
      {/* Modal */}
      <AddCandidateModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleAddCandidate}
      />
    </div>
  );
};

export default CandidateList;

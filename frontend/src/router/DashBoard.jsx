import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Sidebar from "../components/Sidebar";

import CandidateList from "../components/CandidateList";





const App = () => {
  const ProtectedRoute = ({ element }) => {
    const isAuthenticated = localStorage.getItem("token"); // Example check
    console.log(isAuthenticated);
    return isAuthenticated ? element : <Navigate to="/login" />;
  };
  return (
    <div className="flex max-h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 max-h-screen overflow-hidden">
        <CandidateList />
      </div>
    </div>
  );
};

export default App;

import React from 'react'
import Sidebar from '../components/Sidebar';
import EmployeeList from '../components/EmployeeList';

const EmployeeDashboard = () => {
  return (
    <div className="flex max-h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 max-h-screen overflow-hidden">
        <EmployeeList />
      </div>
    </div>
  );
}

export default EmployeeDashboard

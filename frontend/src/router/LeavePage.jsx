import React from 'react'
import Sidebar from '../components/Sidebar';
import LeaveList from '../components/LeaveList';

const LeavePage = () => {
  return (
    <div className="flex max-h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1  max-h-screen overflow-hidden">
        <LeaveList />
      </div>
    </div>
  );
}

export default LeavePage

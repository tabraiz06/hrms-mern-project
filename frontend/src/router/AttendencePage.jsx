import React from 'react'
import Attendance from '../components/Attendance';
import Sidebar from '../components/Sidebar';

const AttendencePage = () => {
  return (
    <div className="flex max-h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 max-h-screen overflow-hidden">
        <Attendance />
      </div>
    </div>
  );
}

export default AttendencePage

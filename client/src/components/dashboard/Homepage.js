import React, { useState } from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';
import AddStudent from './Addstudent'; // Adjust this if needed
import CodeforcesInfo from './CodeforcesInfo'; // Add your other components here
import CodechefInfo from './CodechefInfo'; // Add your other components here
import LeetcodeInfo from './LeetcodeInfo';

export const Homepage = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState('home'); // Initial state

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const handleTabClick = (view) => {
    setCurrentView(view);
  };

  return (
    <div className="bg-blue-50 font-[Poppins] min-h-screen flex">
      <div
        className={`sidebar fixed top-0 bottom-0 lg:left-0 ${isSidebarOpen ? 'left-0' : 'left-[-300px]'} duration-1000 p-2 w-[300px] overflow-y-auto text-center bg-gray-900 shadow h-screen`}
      >
        <div className="text-gray-100 text-xl">
          <div className="p-2.5 mt-1 flex items-center rounded-md">
            <i className="bi bi-app-indicator px-2 py-1 bg-blue-600 rounded-md"></i>
            <h1 className="text-[15px] ml-3 text-xl text-gray-200 font-bold">Tailwindbar</h1>
            <button className="bi bi-x ml-20 cursor-pointer lg:hidden" onClick={toggleSidebar}></button>
          </div>
          <hr className="my-2 text-gray-600" />
          <div>
            <div
              className={`p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer ${currentView === 'home' ? 'bg-gray-700' : 'hover:bg-blue-600'}`}
              onClick={() => handleTabClick('home')}
            >
              <i className="bi bi-house-door-fill"></i>
              <span className="text-[15px] ml-4 text-gray-200">Home</span>
            </div>

            <div
              className={`p-2.5 mt-2 flex items-center rounded-md px-4 duration-300 cursor-pointer ${currentView === 'codeforces' ? 'bg-gray-700' : 'hover:bg-blue-600'}`}
              onClick={() => handleTabClick('codeforces')}
            >
              <i className="bi bi-code-slash"></i>
              <span className="text-[15px] ml-4 text-gray-200">Codeforces</span>
            </div>
            <div
              className={`p-2.5 mt-2 flex items-center rounded-md px-4 duration-300 cursor-pointer ${currentView === 'codechef' ? 'bg-gray-700' : 'hover:bg-blue-600'}`}
              onClick={() => handleTabClick('codechef')}
            >
              <i className="bi bi-code-slash"></i>
              <span className="text-[15px] ml-4 text-gray-200">Codechef</span>
            </div>
            <div
              className={`p-2.5 mt-2 flex items-center rounded-md px-4 duration-300 cursor-pointer ${currentView === 'leetcode' ? 'bg-gray-700' : 'hover:bg-blue-600'}`}
              onClick={() => handleTabClick('leetcode')}
            >
              <i className="bi bi-code-slash"></i>
              <span className="text-[15px] ml-4 text-gray-200">Leetcode</span>
            </div>

            {/* Additional tabs can be added here */}
            <div className="p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-blue-600">
              <i className="bi bi-box-arrow-in-right"></i>
              <span className="text-[15px] ml-4 text-gray-200">Logout</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className={`flex-1 p-4 ml-0 lg:ml-[300px] transition-all duration-300`}>
        {currentView === 'home' && <AddStudent />}
        {currentView === 'codeforces' && <CodeforcesInfo />}
        {currentView === 'codechef' && <CodechefInfo />}
        {currentView === 'leetcode' && <LeetcodeInfo />}
        {/* Add more components as needed */}
      </div>
    </div>
  );
};

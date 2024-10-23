import React from 'react';
import axios from 'axios' 
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'

export const Home = () => {
  // Example user data
  const navigate = useNavigate()

  const [userProfile, setUserProfile] = useState({
    rollNo: '',
    name: '',
    department: '',
    year: ''
  });

  useEffect(() => {
    // Fetch user data
    axios.post('http://localhost:3001/profile-info', {
      rollno: parseInt(localStorage.getItem('rollno'))
    })
      .then(res => {
        setUserProfile({
          rollNo: parseInt(localStorage.getItem('rollno')),
          name: res.data.name,
          department: res.data.dept,
          year: res.data.year
        });
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-6 h-full bg-gray-100">
      <div className="bg-white shadow-lg rounded-3xl p-8 max-w-md w-full relative">
        {/* Decorative Background Circles */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-blue-400 to-teal-400 rounded-full opacity-30 -z-10"></div>
        <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-blue-400 to-teal-400 rounded-full opacity-30 -z-10"></div>

        <div className="flex flex-col items-center">
          {/* Avatar */}
          <div className="w-28 h-28 rounded-full bg-gradient-to-br from-blue-600 to-teal-600 flex items-center justify-center text-white text-4xl font-bold shadow-lg mb-6">
            {userProfile.name ? userProfile.name.charAt(0) : ''}
          </div>
          {/* Name */}
          <h1 className="text-2xl font-bold text-gray-900 mb-1">{userProfile.name}</h1>
          {/* Roll No */}
          <p className="text-sm text-gray-500 mb-4">Roll No: {userProfile.rollNo}</p>
        </div>

        {/* Information Section */}
        <div className="space-y-3 w-full text-gray-700 text-sm">
          <div className="flex items-center">
            <i className="bi bi-building mr-2 text-blue-600"></i>
            <span className="font-medium">Department:</span>
            <span className="ml-auto">{userProfile.department}</span>
          </div>
          <div className="flex items-center">
            <i className="bi bi-calendar2-check mr-2 text-green-500"></i>
            <span className="font-medium">Year:</span>
            <span className="ml-auto">{userProfile.year}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

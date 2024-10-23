import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios'

const AddStudent = () => {
  const [name, setName] = useState('');
  const [rollNo, setRollNo] = useState('');
  const [department, setDepartment] = useState('');
  const [year, setYear] = useState('');
  const [codechefUrl, setCodechefUrl] = useState('');
  const [codeforcesUrl, setCodeforcesUrl] = useState('');
  const [leetcodeUrl, setLeetcodeUrl] = useState('');

  const departments = ['CSBS', 'CSE', 'ECE', 'EEE', 'AIDS', 'IT'];
  const years = ['I', 'II', 'III', 'IV'];

  const handleSubmit = (e) => {
    e.preventDefault();
  
    if (name === '' || rollNo === '' || department === '' || year === '' || codechefUrl === '' || codeforcesUrl === '' || leetcodeUrl === '') {
      toast.error('Fill All Details');
    } else {
      axios.post('http://localhost:3001/insert_info', {
        name: name,
        rollNo: +rollNo, // Convert to number before sending
        department: department,
        year: year,
        codechef: codechefUrl,
        codeforces: codeforcesUrl,
        leetcode: leetcodeUrl
      }).then(res => {
        // Clear the input fields after successful insertion
        setName('');
        setRollNo('');
        setDepartment('');
        setYear('');
        setCodechefUrl('');
        setCodeforcesUrl('');
        setLeetcodeUrl('');
  
        // Show success message
        toast.success(res.data.message || 'Student added successfully');
      }).catch((err) => {
        console.log(err);
        toast.error(err.response?.data || 'Error while adding student');
      });
    }
  };  

  return (
    <div className="p-8 bg-gradient-to-r from-blue-50 to-white rounded-lg shadow-lg">
      <ToastContainer />
      <h2 className="text-3xl font-bold mb-6 text-blue-600 text-center">Add Student</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-semibold">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold">Roll Number</label>
            <input
              type="number"
              value={rollNo}
              onChange={(e) => setRollNo(e.target.value)}
              className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold">Department</label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
              required
            >
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1 font-semibold">Year</label>
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
              required
            >
              <option value="">Select Year</option>
              {years.map((yr) => (
                <option key={yr} value={yr}>{yr}</option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="block mb-1 font-semibold">CodeChef URL</label>
          <input
            type="url"
            value={codechefUrl}
            onChange={(e) => setCodechefUrl(e.target.value)}
            className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
            placeholder="https://www.codechef.com/username"
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Codeforces URL</label>
          <input
            type="url"
            value={codeforcesUrl}
            onChange={(e) => setCodeforcesUrl(e.target.value)}
            className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
            placeholder="https://codeforces.com/profile/username"
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold">LeetCode URL</label>
          <input
            type="url"
            value={leetcodeUrl}
            onChange={(e) => setLeetcodeUrl(e.target.value)}
            className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
            placeholder="https://leetcode.com/username"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg shadow-lg hover:bg-blue-500 transition duration-200"
        >
          Add Student
        </button>
      </form>
    </div>
  );
};

export default AddStudent;
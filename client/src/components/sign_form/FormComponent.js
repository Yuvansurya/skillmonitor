import React from 'react';
import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const FormComponent = () => {
  const [name, change_name] = useState('');
  const [year, change_year] = useState('');
  const [dept, change_dept] = useState('');
  const navigate = useNavigate();

  const press = (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    axios.post('http://localhost:3001/student-info', {
      name: name,
      dept: dept,
      year: year,
      rollno: Number(localStorage.getItem('rollno'))
    })
    .then(res => {
      navigate('/home');
    })
    .catch(err => {
      console.log(err, 'ss');
      toast.error("Registration failed");
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-800">
      <div className="bg-black p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-white text-2xl mb-6">Student Form</h2>
        <form className="space-y-4" onSubmit={press}>
          <div>
            <label htmlFor="name" className="block text-white">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white placeholder-gray-400"
              placeholder="Enter your name"
              onChange={(e) => change_name(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="year" className="block text-white">Year</label>
            <select
              id="year"
              name="year"
              className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white"
              onChange={(e) => change_year(e.target.value)}
            >
              <option value="I">I</option>
              <option value="II">II</option>
              <option value="III">III</option>
              <option value="IV">IV</option>
            </select>
          </div>

          <div>
            <label htmlFor="department" className="block text-white">Department</label>
            <select
              id="department"
              name="department"
              className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white"
              onChange={(e) => change_dept(e.target.value)}
            >
              <option value="csbs">CSBS</option>
              <option value="cse">CSE</option>
              <option value="aids">AIDS</option>
              <option value="it">IT</option>
              <option value="eee">EEE</option>
              <option value="ece">ECE</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md"
          >
            Submit
          </button>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
};

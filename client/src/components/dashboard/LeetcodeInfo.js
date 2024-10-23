import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as XLSX from 'xlsx'; // Import xlsx

const LeetcodeInfo = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false); // Loading state for fetching data
  const [sort_cf, set_sort_cf] = useState(true);
  const [sort_maxcf, set_sort_maxcf] = useState(true);

  const sort_lc_rating = () => {
    set_sort_cf(!sort_cf);
    const sorted = [...students].sort((x, y) =>
      sort_cf ? y.lc_rating - x.lc_rating : x.lc_rating - y.lc_rating
    );
    setStudents(sorted);
  };

  const sort_cf_maxrating = () => {
    set_sort_maxcf(!sort_maxcf);
    const sorted = [...students].sort((x, y) =>
      sort_maxcf ? y.cf_max_rating - x.cf_max_rating : x.cf_max_rating - y.cf_max_rating
    );
    setStudents(sorted);
  };

  // Fetch all students' Codeforces information
  const fetchStudentRatings = async () => {
    setLoading(true); // Set loading to true before fetching
    try {
      const res = await axios.post('http://localhost:3001/fetch_lc_info');
      setStudents(res.data); // Assuming res.data contains an array of students
      setLoading(false); // Set loading to false after data is fetched
    } catch (err) {
      console.error(err);
      toast.error('Error fetching students data');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentRatings(); // Fetch ratings when component loads
  }, []);

  const handleGetRatingClick = async () => {
    setLoading(true); // Set loading to true while fetching new ratings
    try {
      await axios.post('http://localhost:3001/get_lc_info'); // Trigger backend to update ratings
      fetchStudentRatings(); // Fetch updated ratings once backend finishes
      toast.success('Fetched new ratings successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Error fetching new ratings');
      setLoading(false);
    }
  };

  // Function to create Excel file and download
  const downloadExcel = () => {
    const studentsWithoutId = students.map(({ _id, ...rest }) => rest);

    const worksheet = XLSX.utils.json_to_sheet(studentsWithoutId);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Codeforces Info');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'LeetcodeInfo.xlsx';
    link.click();
  };

  return (
    <div className="p-8 bg-gradient-to-r from-blue-50 to-white rounded-lg shadow-lg">
      <ToastContainer />
      <h2 className="text-3xl font-bold mb-6 text-blue-600 text-center">LeetCode Info</h2>

      <div className="text-center mb-4">
        <button
          onClick={handleGetRatingClick}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200"
          disabled={loading} // Disable button while loading
        >
          {loading ? 'Loading...' : 'Get Rating'}
        </button>
        <button
          onClick={downloadExcel}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition duration-200 ml-4"
          disabled={students.length === 0} // Disable if no student data
        >
          Download Excel
        </button>
      </div>

      {loading ? (
        <div className="text-center text-blue-600">Loading data...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="py-2 px-4">Roll No</th>
                <th className="py-2 px-4">Name</th>
                <th
                  className="py-2 px-4 cursor-pointer hover:bg-blue-700 transition"
                  onClick={sort_lc_rating}
                >
                  Rating {sort_cf ? '▲' : '▼'}
                </th>
                <th className="py-2 px-4">Contest</th>
                <th className="py-2 px-4">percentage</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => (
                <tr key={index} className="text-center border-b">
                  <td className="py-2 px-4">{student.rollno}</td>
                  <td className="py-2 px-4">{student.name}</td>
                  <td className="py-2 px-4">{student.lc_rating || 'N/A'}</td>
                  <td className="py-2 px-4">{student.lc_constestattended || 'N/A'}</td>
                  <td className="py-2 px-4">{student.lc_toppercentage || 'N/A'}</td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default LeetcodeInfo;

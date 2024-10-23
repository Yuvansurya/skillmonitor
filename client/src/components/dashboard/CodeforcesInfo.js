import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as XLSX from 'xlsx'; // Import xlsx

const CodeforcesInfo = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false); // Loading state for fetching data
  const [sort_cf, set_sort_cf] = useState(true);
  const [sort_maxcf, set_sort_maxcf] = useState(true);

  const sort_cf_rating = () => {
    set_sort_cf(!sort_cf);
    const sorted = [...students].sort((x, y) =>
      sort_cf ? y.cf_rating - x.cf_rating : x.cf_rating - y.cf_rating
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
      const res = await axios.post('http://localhost:3001/get_cf_info');
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
      await axios.post('http://localhost:3001/cf_info'); // Trigger backend to update ratings
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
    link.download = 'CodeforcesInfo.xlsx';
    link.click();
  };

  const getRankColor = (rank) => {
    switch (rank) {
      case 'Newbie':
        return 'text-gray-500'; // Gray
      case 'pupil':
        return 'text-[#008000]'; // Purple
      case 'specialist':
        return 'text-[#03A89E]'; // Blue
      case 'expert':
        return 'text-[#0000FF]'; // Green
      case 'candidate master':
        return 'text-[#AA00AA]'; // Cyan
      case 'master':
        return 'text-[#FF8C00]'; // Orange
      case 'international master':
        return 'text-[#FF8C19]'; // Darker Orange
      case 'grandmaster':
        return 'text-red-500'; // Red
      case 'international grandmaster':
        return 'text-red-600'; // Darker Red
      case 'legendary grandmaster':
        return 'text-red-700'; // Black
      case 'tourist':
        return 'text-black-500';
      default:
        return 'text-gray-500'; // Default for unknown ranks
    }
  };

  return (
    <div className="p-8 bg-gradient-to-r from-blue-50 to-white rounded-lg shadow-lg">
      <ToastContainer />
      <h2 className="text-3xl font-bold mb-6 text-blue-600 text-center">Codeforces Info</h2>

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
                  onClick={sort_cf_rating}
                >
                  Rating {sort_cf ? '▲' : '▼'}
                </th>
                <th
                  className="py-2 px-4 cursor-pointer hover:bg-blue-700 transition"
                  onClick={sort_cf_maxrating}
                >
                  Max Rating {sort_maxcf ? '▲' : '▼'}
                </th>
                <th className="py-2 px-4">Rank</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => (
                <tr key={index} className="text-center border-b">
                  <td className="py-2 px-4">{student.rollno}</td>
                  <td className="py-2 px-4">{student.name}</td>
                  <td className="py-2 px-4">{student.cf_rating || 'N/A'}</td>
                  <td className="py-2 px-4">{student.cf_max_rating || 'N/A'}</td>
                  <td className={`py-2 px-4 font-semibold ${getRankColor(student.cf_rank)}`}>
                    {student.cf_rank || 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CodeforcesInfo;

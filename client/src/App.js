/*import React, { useState, useEffect } from 'react'; // [cite: 41, 42]
import axios from 'axios'; // [cite: 45]
import './App.css'; 
function App() {
  const [students, setStudents] = useState([]);
  const [name, setName] = useState("");
  const [rollNo, setRollNo] = useState("");

  // Load students on start
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    const res = await axios.get('http://localhost:5000/api/students');
    setStudents(res.data);
  };

  // Add Student Function [cite: 33]
  const addStudent = async (e) => {
    e.preventDefault();
    if(!name || !rollNo) return alert("Name & Roll No required"); // [cite: 24]
    await axios.post('http://localhost:5000/api/students', { name, rollNo });
    setName(""); setRollNo("");
    fetchStudents(); // Refresh list
  };

  // Toggle Attendance Function [cite: 35]
  const toggleAttendance = async (id, currentStatus) => {
    await axios.put(`http://localhost:5000/api/students/${id}/attendance`, {
      isPresent: !currentStatus
    });
    fetchStudents();
  };

  return (
    <div className="App" style={{ padding: '20px' }}>
      <h1>Student Attendance System</h1>
      
       
      <form onSubmit={addStudent} style={{ marginBottom: '20px' }}>
        <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
        <input placeholder="Roll No" value={rollNo} onChange={e => setRollNo(e.target.value)} />
        <button type="submit">Add Student</button>
      </form>
 
      <table border="1" cellPadding="10" style={{ width: '100%' }}>
        <thead>
          <tr>
            <th>Roll No</th>
            <th>Name</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {students.map(student => (
            <tr key={student._id} style={{ background: student.isPresent ? '#d4edda' : '#f8d7da' }}>
              <td>{student.rollNo}</td>
              <td>{student.name}</td>
              <td>{student.isPresent ? "Present" : "Absent"}</td>
              <td>
                <button onClick={() => toggleAttendance(student._id, student.isPresent)}>
                  Mark {student.isPresent ? "Absent" : "Present"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export default App;*/

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  // --- State Management ---
  const [students, setStudents] = useState([]);
  const [name, setName] = useState("");
  const [rollNo, setRollNo] = useState("");

  // --- API Integration ---
  
  // Load students on start
  useEffect(() => {
    fetchStudents();
  }, []);

  // GET: Fetch all students
  const fetchStudents = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/students');
      setStudents(res.data);
    } catch (err) {
      console.error("Error fetching students:", err);
    }
  };

  // POST: Add a new student
  const addStudent = async (e) => {
    e.preventDefault();
    if (!name || !rollNo) return alert("Name & Roll No are required");

    try {
      await axios.post('http://localhost:5000/api/students', { name, rollNo });
      setName("");   // Clear name input
      setRollNo(""); // Clear rollno input
      fetchStudents(); // Refresh list
    } catch (err) {
      alert("Error: Roll No might already exist.");
    }
  };

  // PUT: Toggle Attendance
  const toggleAttendance = async (id, currentStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/students/${id}/attendance`, {
        isPresent: !currentStatus
      });
      fetchStudents();
    } catch (err) {
      console.error("Error marking attendance:", err);
    }
  };

  // DELETE: Remove student
  const deleteStudent = async (id) => {
    // Confirmation dialog before deleting
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        // Make sure this URL matches your backend route
        await axios.delete(`http://localhost:5000/api/students/${id}`);
        fetchStudents(); // Refresh the list immediately
      } catch (err) {
        console.error("Error deleting:", err);
        alert("Failed to delete. Check server console.");
      }
    }
  };

  // --- Summary Calculations ---
  const totalStudents = students.length;
  const presentCount = students.filter(student => student.isPresent).length;
  const absentCount = totalStudents - presentCount;

  return (
    <div className="container">
      <h1 className="title">Student Attendance System</h1>

      {/* --- Attendance Summary --- */}
      <div className="summary-box">
        <div className="stat-card">
          <h3>Total</h3>
          <p>{totalStudents}</p>
        </div>
        <div className="stat-card present">
          <h3>Present</h3>
          <p>{presentCount}</p>
        </div>
        <div className="stat-card absent">
          <h3>Absent</h3>
          <p>{absentCount}</p>
        </div>
      </div>

      {/* --- Add Student Form --- */}
      <div className="form-box">
        <form onSubmit={addStudent}>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Roll No"
            value={rollNo}
            onChange={(e) => setRollNo(e.target.value)}
            required
          />
          <button type="submit" className="add-btn">Add Student</button>
        </form>
      </div>

      {/* --- Student List Table --- */}
      <table className="student-table">
        <thead>
          <tr>
            <th>Roll No</th>
            <th>Name</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student._id} className={student.isPresent ? "row-present" : "row-absent"}>
              <td>{student.rollNo}</td>
              <td>{student.name}</td>
              <td>
                <span className={student.isPresent ? "badge-present" : "badge-absent"}>
                  {student.isPresent ? "Present" : "Absent"}
                </span>
              </td>
              <td>
                <button 
                  className="toggle-btn"
                  onClick={() => toggleAttendance(student._id, student.isPresent)}
                >
                  Mark {student.isPresent ? "Absent" : "Present"}
                </button>
                <button 
                  className="delete-btn"
                  onClick={() => deleteStudent(student._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {students.length === 0 && (
            <tr>
              <td colSpan="4" style={{textAlign: 'center'}}>No students found. Add one above!</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;
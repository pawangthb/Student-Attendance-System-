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
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import './App.css';

function App() {
  const [students, setStudents] = useState([]);
  const [name, setName] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [sortField, setSortField] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await axios.get('https://student-attendance-system-lk4i.onrender.com');
      setStudents(res.data);
    } catch (err) {
      console.error("Error fetching students:", err);
    }
  };

  const addStudent = async (e) => {
    e.preventDefault();
    if (!name || !rollNo) return alert("Name & Roll No are required");

    const nameRegex = /^[a-zA-Z\s]+$/;
    if (!nameRegex.test(name)) {
      return alert("Name should contain letters only");
    }

    const rollRegex = /^[0-9]+$/;
    if (!rollRegex.test(rollNo)) {
      return alert("Roll No should contain numbers only");
    }

    try {
      await axios.post('https://student-attendance-system-lk4i.onrender.com', { name, rollNo });
      setName("");
      setRollNo("");
      fetchStudents();
    } catch (err) {
      alert("Error: Roll No might already exist.");
    }
  };

  const toggleAttendance = async (id, currentStatus) => {
    try {
      await axios.put(`https://student-attendance-system-lk4i.onrender.com`, {
        isPresent: !currentStatus
      });
      fetchStudents();
    } catch (err) {
      console.error("Error marking attendance:", err);
    }
  };

  const deleteStudent = async (id) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        await axios.delete(`https://student-attendance-system-lk4i.onrender.com`);
        fetchStudents();
      } catch (err) {
        console.error("Error deleting:", err);
        alert("Failed to delete. Check server console.");
      }
    }
  };

  // --- Sorting Logic ---
  const handleSort = (field) => {
    if (sortField === field) {
      // Same field clicked → toggle order
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      // New field clicked → set field, default asc
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const getSortedStudents = () => {
    return [...students].sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      // Roll No is a number — compare as integer
      if (sortField === "rollNo") {
        valA = parseInt(valA);
        valB = parseInt(valB);
        return sortOrder === "asc" ? valA - valB : valB - valA;
      }

      // Name — compare as string
      valA = valA?.toLowerCase();
      valB = valB?.toLowerCase();
      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  };

  const sortedStudents = getSortedStudents();

  // Arrow indicator for active sort column
  const arrow = (field) => {
    if (sortField !== field) return " ↕";
    return sortOrder === "asc" ? " ↑" : " ↓";
  };

  const totalStudents = students.length;
  const presentCount = students.filter(s => s.isPresent).length;
  const absentCount = totalStudents - presentCount;
 
  const chartData = [
    { label: "Total", value: totalStudents, color: "#6366f1" },
    { label: "Present", value: presentCount, color: "#22c55e" },
    { label: "Absent", value: absentCount, color: "#ef4444" },
  ];
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

{/* --- Attendance Chart --- */}
<div className="chart-box">
  <h2 className="chart-title">Attendance Overview</h2>
  <ResponsiveContainer width="100%" height={220}>
    <BarChart data={chartData} barSize={52}>
      <XAxis
        dataKey="label"
        tick={{ fontSize: 13, fill: "#888" }}
        axisLine={false}
        tickLine={false}
      />
      <YAxis
        allowDecimals={false}
        tick={{ fontSize: 12, fill: "#888" }}
        axisLine={false}
        tickLine={false}
        width={24}
      />
      <Tooltip
        cursor={{ fill: "#f3f4f6" }}
        contentStyle={{
          borderRadius: "8px",
          border: "0.5px solid #e5e7eb",
          fontSize: "13px",
          boxShadow: "none"
        }}
        formatter={(value, name) => [value, name]}
        labelFormatter={(label) => `${label}`}
      />
      <Bar dataKey="value" radius={[6, 6, 0, 0]}>
        {chartData.map((entry, index) => (
          <Cell key={index} fill={entry.color} />
        ))}
      </Bar>
    </BarChart>
  </ResponsiveContainer>
</div>

      {/* --- Add Student Form --- */}
      <div className="form-box">
        <form onSubmit={addStudent}>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => {
              const val = e.target.value;
              if (/^[a-zA-Z\s]*$/.test(val)) setName(val);
            }}
            required
          />
          <input
            type="text"
            placeholder="Roll No"
            value={rollNo}
            onChange={(e) => {
              const val = e.target.value;
              if (/^[0-9]*$/.test(val)) setRollNo(val);
            }}
            required
          />
          <button type="submit" className="add-btn">Add Student</button>
        </form>
      </div>

      {/* --- Student List Table --- */}
      <table className="student-table">
        <thead>
          <tr>
            <th
              onClick={() => handleSort("rollNo")}
              style={{ cursor: "pointer", userSelect: "none" }}
            >
              Roll No{arrow("rollNo")}
            </th>
            <th
              onClick={() => handleSort("name")}
              style={{ cursor: "pointer", userSelect: "none" }}
            >
              Name{arrow("name")}
            </th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {sortedStudents.map((student) => (
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
              <td colSpan="4" style={{ textAlign: 'center' }}>
                No students found. Add one above!
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;
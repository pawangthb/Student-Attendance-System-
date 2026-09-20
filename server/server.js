require('dotenv').config(); // ✅ ADD THIS - reads .env file
console.log("URI:", process.env.MONGO_URI);
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// --- 1. Database Connection ---
mongoose.connect(process.env.MONGO_URI) // ✅ CHANGED - was localhost
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("DB Error:", err));

// --- 2. Data Model ---
const StudentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    rollNo: { type: String, required: true, unique: true },
    isPresent: { type: Boolean, default: false }
});

const Student = mongoose.model('Student', StudentSchema);

// --- 3. APIs ---

app.get('/api/students', async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/students', async (req, res) => {
    try {
        const newStudent = new Student(req.body);
        await newStudent.save();
        res.json(newStudent);
    } catch (err) {
        res.status(400).json({ error: "Error: Roll No must be unique" });
    }
});

app.put('/api/students/:id/attendance', async (req, res) => {
    try {
        const { isPresent } = req.body;
        const student = await Student.findByIdAndUpdate(
            req.params.id,
            { isPresent },
            { new: true }
        );
        res.json(student);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/students/:id', async (req, res) => {
    try {
        const id = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send("Invalid ID");
        }
        const result = await Student.findByIdAndDelete(id);
        if (!result) {
            return res.status(404).send("Student not found");
        }
        res.json({ message: "Student Deleted Successfully" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
});

// --- 4. Start Server ---
const PORT = process.env.PORT || 5000; // ✅ CHANGED - reads from .env
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
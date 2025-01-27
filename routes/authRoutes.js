import express from 'express';
import bcrypt from 'bcryptjs';
import student from '../models/student.js';
import { ensureGuest } from '../middleware/ensureGuest.js';

const loginRouter = express.Router();

loginRouter.post("/login", ensureGuest, async (req, res) => {
    const { email, password } = req.body;

    try {
        // Fetch the student record from the database
        const existingStudent = await student.findOne({ where: { email } });

        if (!existingStudent) {
            return res.status(404).json({ message: "Student not found" });
        }

        // Compare the password with the stored hash
        const isMatch = await bcrypt.compare(password, existingStudent.pwd_hash);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        res.status(200).json({ message: "Login successful", student: existingStudent });
    } catch (error) {
        res.status(500).json({ message: "Error logging in", error: error.message });
    }
});


export default loginRouter;
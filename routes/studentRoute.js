import express from 'express';
import bcrypt from 'bcryptjs';
import student from '../models/student.js'; // Ensure correct model import
import { ensureGuest } from '../middleware/ensureGuest.js';

const studentLoginRouter = express.Router();

studentLoginRouter.post("/studentLogin", ensureGuest, async (req, res) => {
    const { email, password, twoStepHash } = req.body; // Added twoStepHash to req.body

    try {
        // Fetch the student record from the database
        const studentMember = await student.findOne({ where: { email } });

        if (!studentMember) {
            console.log("Login failed: Student not found.");
            return res.status(404).json({ message: "Student not found" });
        }

        // Compare the password with the stored hash
        const pwdMatch = await bcrypt.compare(password, studentMember.pwd_hash);

        if (!pwdMatch) {
            console.log("Login failed: Invalid Credentials.");
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Compare the two-step authentication hash
        const twoStepMatch = await bcrypt.compare(twoStepHash, studentMember.two_StepHash);

        if (!twoStepMatch) {
            console.log("Login failed: Invalid Credentials 2SAuth.");
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Store student info in session
        req.session.studentID = studentMember.id;
        req.session.studentEmail = studentMember.email;

        console.log("Login successful for student.");

        // Redirect to dashboard
        return res.render('studentDash', { student: { email: req.session.studentEmail || "Student" } });
    } catch (error) {
        console.error(`Error during login: ${error}`);
        res.status(500).json({ message: "An error occurred during login." });
    }
});

// Student Dashboard Route
studentLoginRouter.get("/studentDash", (req, res) => {
    if (!req.session || !req.session.studentID) {
        console.log("Unauthorized access attempt to /studentDash. Redirecting to /studentloginpage.");
        return res.redirect('/studentloginpage'); // Redirect to login if session expired
    }

    console.log(`Student with ID ${req.session.studentID} accessed the dashboard.`);

    // Render the student dashboard page
    res.render('studentDash', { student: { email: req.session.studentEmail || "Student" } });
});

export default studentLoginRouter;
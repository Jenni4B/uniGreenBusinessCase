import express from 'express';
import bcrypt from 'bcryptjs';
import faculty from '../models/faculty.js'; // Import the faculty model
import { ensureGuest } from '../middleware/ensureGuest.js';

const facultyLoginRouter = express.Router();

facultyLoginRouter.post("/facultyLogin", ensureGuest, async (req, res) => {
    const { email, password, twoStepHash } = req.body; // Added twoStepHash to req.body

    try {
        // Fetch the faculty record from the database
        const facultyMember = await faculty.findOne({ where: { email } });

        if (!facultyMember) {
            console.log("Login failed: Faculty not found.");
            return res.status(404).json({ message: "Faculty not found" });
        }

        // Compare the password with the stored hash
        const pwdMatch = await bcrypt.compare(password, facultyMember.pwd_hash);

        if (!pwdMatch) {
            console.log("Login failed: Invalid Credentials.");
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Compare the two-step authentication hash
        const twoStepMatch = await bcrypt.compare(twoStepHash, facultyMember.two_StepHash);

        if (!twoStepMatch) {
            console.log("Login failed: Invalid Credentials 2SAuth.");
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Store faculty info in session
        req.session.facultyID = facultyMember.id;
        req.session.facultyEmail = facultyMember.email;

        console.log("Login successful for faculty.");

        // Redirect to faculty dashboard
        return res.render('facultyDash', { faculty: { email: req.session.facultyEmail || "Faculty" } });
    } catch (error) {
        console.error(`Error during login: ${error}`);
        res.status(500).json({ message: "An error occurred during login." });
    }
});

// Faculty Dashboard Route
facultyLoginRouter.get("/facultyDash", (req, res) => {
    if (!req.session || !req.session.facultyID) {
        console.log("Unauthorized access attempt to /facultyDash. Redirecting to /facultyloginpage.");
        return res.redirect('/facultyloginpage'); // Redirect to login if session expired
    }

    console.log(`Faculty with ID ${req.session.facultyID} accessed the dashboard.`);

    // Render the faculty dashboard page
    res.render('facultyDash', { faculty: { email: req.session.facultyEmail || "Faculty" } });
});

export default facultyLoginRouter;

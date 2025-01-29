import express from 'express';
import bcrypt from 'bcryptjs';
import admin from '../models/admin.js';
import { ensureGuest } from '../middleware/ensureGuest.js';

const adminLoginRoute = express.Router();

// Handle admin login and validate credentials
adminLoginRoute.post("/", ensureGuest, async (req, res) => {
    const { email, password, adminID } = req.body;

    try {
        // Validate input
        if (!email || !password || !adminID) {
            return res.status(400).json({ message: "Email, password, and Admin ID are required" });
        }

        // Fetch the admin record from the database
        const validAdmin = await admin.findOne({ where: { email } });

        if (!validAdmin) {
            console.log("Login failed: Admin not found.");
            return res.status(404).json({ message: "Admin not found" });
        }

        // Verify Admin ID matches
        const adminIDMatch = await bcrypt.compare(password, validAdmin.two_stepHash);

        if (!adminIDMatch) {
            console.log("Login failed: Invalid Credentials.");
            return res.status(401).json({ message: "Invalid credentials" });
        }
        // Compare the password with the stored hash

        const pwdMatch = await bcrypt.compare(password, validAdmin.pwd_hash);

        if (!pwdMatch) {
            console.log("Login failed: Invalid credentials.");
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Set up session for the admin
        req.session.adminId = validAdmin.id;
        req.session.adminEmail = validAdmin.email;

        console.log("Login successful for an admin.");

        // Redirect to dashboard
        return res.render('dashboard', { admin: { email: req.session.adminEmail || "Admin" } });
    } catch (error) {
        console.error(`Error during login: ${error}`);
        res.status(500).json({ message: "An error occurred during login." });
    }
});

// Render the admin dashboard
adminLoginRoute.get("/dashboard", (req, res) => {
    // Check if admin is logged in
    if (!req.session.adminId) {
        console.log("Unauthorized access attempt to /dashboard. Redirecting to /adminLogin.");
        return res.redirect('/adminloginpage'); 
        // Redirect to the login page if the user doesn't have a session or is expired
    }

    // Log access
    console.log(`Admin with ID ${req.session.adminId} accessed the dashboard.`); // alerts server of access

    // Render the dashboard.ejs template
    res.render('dashboard', { admin: { email: req.session.adminEmail || "Admin" } });
});

export default adminLoginRoute;

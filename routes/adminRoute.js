import express from 'express';
import admin from '../models/admin.js';
import { ensureGuest } from '../middleware/ensureGuest.js';
import { verifyPassword, verifyTwoStep } from '../middleware/verification.js';

const adminLoginRoute = express.Router();

// Handle admin login and validate credentials
adminLoginRoute.post("/", ensureGuest, async (req, res) => {
    const { email, password, two_stepHash } = req.body;
    console.log("Received login request:", req.body);

    try {
        // Validate input fields
        if (!email || !password || !two_stepHash) {
            console.log("Login failed: Missing required fields.");
            return res.status(400).json({ message: "Email, password, and two-step code are required." });
        }

        // Fetch the admin record from the database
        const validAdmin = await admin.findOne({ where: { email } });

        if (!validAdmin) {
            console.log(`Login failed: Admin with email '${email}' not found.`);
            return res.status(404).json({ message: "Admin not found." });
        }

        // Verify admin ID (ensure admin_id exists in the database)
        if (!validAdmin.admin_id) {
            console.log(`Login failed: Admin ID is missing for email '${email}'.`);
            return res.status(400).json({ message: "Invalid admin configuration." });
        }

        // Verify password
        const pwdMatch = await verifyPassword(password, validAdmin.pwd_hash);
        if (!pwdMatch) {
            console.log(`Login failed: Invalid password for email '${email}'.`);
            return res.status(401).json({ message: "Invalid credentials." });
        }

        // Verify two-step authentication
        const twoStepMatch = await verifyTwoStep(two_stepHash, validAdmin.two_stepHash);
        if (!twoStepMatch) {
            console.log(`Login failed: Invalid two-step authentication for email '${email}'.`);
            return res.status(401).json({ message: "Invalid credentials." });
        }

        // Set up session for the admin
        req.session.adminId = validAdmin.admin_id;
        req.session.adminEmail = validAdmin.email;

        console.log(`Login successful: Admin ID ${validAdmin.admin_id}, Email: ${validAdmin.email}`);

        // Redirect to dashboard after successful login
        return res.redirect("/dashboard");
    } catch (error) {
        console.error(`Error during login for email '${email}':`, error);
        return res.status(500).json({ message: "An error occurred during login." });
    }
});

// Render the admin dashboard with session validation
adminLoginRoute.get("/dashboard", (req, res) => {
    if (!req.session.adminId) {
        console.log("Unauthorized access to /dashboard. Redirecting to /adminLogin.");
        return res.redirect('/adminLogin');
    }

    console.log(`Admin with ID ${req.session.adminId} accessed the dashboard.`);
    res.render('dashboard', { admin: { email: req.session.adminEmail || "Admin" } });
});

export default adminLoginRoute;

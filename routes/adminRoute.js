import express from 'express';
import bcrypt from 'bcryptjs';
import admin from '../models/admin.js';
import { ensureGuest } from '../middleware/ensureGuest.js';

const adminLoginRoute = express.Router();

adminLoginRoute.post("/login", ensureGuest, async (req, res) => {
    const { email, password } = req.body;

    try {
        // Fetch the admin record from the database
        const validAdmin = await admin.findOne({ where: { email } });

        if (!validAdmin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        // Compare the password with the stored hash
        const isMatch = await bcrypt.compare(password, validAdmin.pwd_hash);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Set up session for the admin
        req.session.adminId = validAdmin.id;

        // Redirect to dashboard route
        return res.redirect('/dashboard');
    } catch (error) {
        console.log("Error logging in:", error);
        res.status(500).json({ message: "An error occurred during login." });
    }
});

// Add a new route to render the dashboard
adminLoginRoute.get("/dashboard", (req, res) => {
    // Check if admin is logged in
    if (!req.session.adminId) {
        return res.redirect('/login'); // Redirect to the login page if not logged in
    }

    // Render the dashboard.ejs template
    res.render('dashboard', { admin: { email: req.session.adminEmail || "Admin" } });
});

export default adminLoginRoute;
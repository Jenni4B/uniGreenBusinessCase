import bcrypt from 'bcryptjs';
import admin from '../models/admin.js';

// Verify Password 
export const verifyPassword = async (req, res, next) => {
    const { email, password } = req.body || {}; // Default to empty object

    if (!email || !password) {
        console.log('error', 'Email and password are required.');
        res.render('adminLogin', { error: 'Email and password are required.' });
    }
    

    try {
        const validAdmin = await admin.findOne({ where: { email } });
        if (!validAdmin || !(await bcrypt.compare(password, validAdmin.pwd_hash))) {
            req.flash('error', 'Invalid credentials');
            return res.redirect('/adminLogin');
        }
        req.validAdmin = validAdmin; // Store admin info for next middleware
        next();
    } catch (error) {
        console.error("Error verifying password:", error);
        req.flash('error', 'An error occurred.');
        res.redirect('/adminLogin');
    }
};


// Verify Two-Step Code 
// Verify Two-Step Code
export const verifyTwoStep = async (req, res, next) => {
    const { email, adminID } = req.body;

    try {
        const validAdmin = req.validAdmin || (await admin.findOne({ where: { email } }));
        if (!validAdmin) {
            req.flash('error', 'Invalid credentials');
            return res.redirect('/adminLogin');
        }

        if (!(await bcrypt.compare(adminID, validAdmin.two_stepHash))) {
            req.flash('error', 'Invalid two-step authentication code');
            return res.redirect('/adminLogin');
        }

        req.validAdmin = validAdmin; // Ensure it's set for subsequent middleware
        next();
    } catch (error) {
        console.error("Error verifying two-step authentication:", error);
        req.flash('error', 'An error occurred.');
        res.redirect('/adminLogin');
    }
};

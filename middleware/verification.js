import bcrypt from 'bcryptjs';
import admin from '../models/admin.js';

// Verify Password 
// export const verifyPassword = async (req, res, next) => {
//     console.log('verifyPassword called');
//     console.log('req:', typeof req, Object.keys(req));
//     console.log('res:', typeof res, Object.keys(res));
//     const { email, password } = req.body || {};

//     if (!email || !password) {
//         console.log('Error: Email and password are required.');
//         // return res.status(400).json({ error: 'Email and password are required.' });
//         console.log('res object:', typeof res, Object.keys(res));
//         try {
//             res.status(400);
//             return res.json({ error: 'Email and password are required.' });
//         } catch (err) {
//             console.error('Error sending response:', err);
//             return (err);
//         }
//     }

//     try {
//         const validAdmin = await admin.findOne({ where: { email } });
//         if (!validAdmin || !(await bcrypt.compare(password, validAdmin.pwd_hash))) {
//             return res.status(401).json({ error: 'Invalid email or password' });
//         }
//         req.validAdmin = validAdmin; // Store admin info
//         next();
//     } catch (error) {
//         console.error("Error verifying password:", error.message);
//         return res.status(500).json({ error: 'An error occurred during login.' });
//     }
// };

// // Verify Two-Step Code
// export const verifyTwoStep = async (req, res, next) => {
//     const { email, adminID } = req.body;

//     if (!email || !adminID) {
//         return res.status(400).json({ error: 'Email and two-step code are required.' });
//     }

//     try {
//         const validAdmin = req.validAdmin || (await admin.findOne({ where: { email } }));
//         if (!validAdmin) {
//             return res.status(401).json({ error: 'Invalid email' });
//         }

//         if (!(await bcrypt.compare(adminID, validAdmin.two_stepHash))) {
//             return res.status(401).json({ error: 'Invalid two-step authentication code' });
//         }

//         req.validAdmin = validAdmin; 
//         next();
//     } catch (error) {
//         console.error("Error verifying two-step authentication:", error.message);
//         return res.status(500).json({ error: 'An error occurred during two-step verification.' });
//     }
// };

export const verifyPassword = async (inputPassword, storedHash) => {
    try {
        return await bcrypt.compare(inputPassword, storedHash);
    } catch (error) {
        console.error("Error verifying password:", error.message);
        return false;
    }
};

// Verify Two-Step Code
export const verifyTwoStep = async (inputCode, storedHash) => {
    try {
        return await bcrypt.compare(inputCode, storedHash);
    } catch (error) {
        console.error("Error verifying two-step authentication:", error.message);
        return false;
    }
};
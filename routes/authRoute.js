import express from "express";
import { ensureGuest } from "../middleware/ensureGuest.js";
import { verifyPassword, verifyTwoStep } from "../middleware/verification.js";
import admin from "../models/admin.js";
import faculty from "../models/faculty.js";
import student from "../models/student.js";
import Announcement from "../models/annoucements.js";

const authRoute = express.Router();

// Select user model based on userType
// Condenses the switch and if statements to a single function

const getUserModel = (userType) => {
  const models = { admin, faculty, student };
  console.log(`userType: ${userType}`); // Checking if the user type is being passed through
  return models[userType] || null;
}; 

// Fetch announcements (ordered by date)
// Before, I had repeated code (mb lol) to see where the error occurred
// when fetching announcements
// Now, I have a single function to handle it.
const fetchAnnouncements = async () =>
  await Announcement.findAll({ order: [["created_at", "DESC"]] });
  console.log(`Announcements being loaded...`); // Checking if announcements are being fetched

// Handle dashboard rendering with announcements
// simpler function to render the dashboard
// with announcements and user data
const renderDashboard = async (res, dashboard, user, error = null) => {
    // If I make changes, it'll be easier to update now :)
  try {
    const announcements = await fetchAnnouncements();

    // if successful, render the dashboard and pass the user data + announcements
    res.render(dashboard, { user, announcements, error });
    console.log(`Announcements loaded!`); // Checking if the announcements/dashboard is being loaded

  } catch (fetchError) {
    console.error(`Error loading announcements for ${dashboard}:`, fetchError);
    res.status(500).render(dashboard, { user, announcements: [], error: "Failed to load announcements" });
  }
};

//Handles all userType logins through authRoute
authRoute.post("/:userType/login", ensureGuest, async (req, res) => {
  
  const { email, pwd_hash, two_stepHash } = req.body;
  const { userType } = req.params;
  console.log(`Login attempt: ${userType} - ${email}`);
    // 'Login attempt: admin/faculty/student - example@email.com'

    // Check if all fields are filled
  try {
    if (!email || !pwd_hash || !two_stepHash) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Get the user model based on userType
    const UserModel = getUserModel(userType);
    if (!UserModel) return res.status(400).json({ message: "Invalid user type." });

    // Check if user exists and password matches
    const user = await UserModel.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: `${userType} not found.` });

    // If the user_id/type doesn't exist, throw an error message
    const userId = user[`${userType}_id`];
    if (!userId) return res.status(400).json({ message: `Invalid ${userType} configuration.` });

    // Verify password and two-step authentication
    const [pwdMatch, twoStepMatch] = await Promise.all([
      verifyPassword(pwd_hash, user.pwd_hash),
      verifyTwoStep(two_stepHash, user.two_stepHash),
    ]);

    // if not a match, throw an error message
    if (!pwdMatch || !twoStepMatch) return res.status(401).json({ message: "Invalid credentials." });

    // Set session data and render dashboard
    req.session.userId = userId;
    req.session.userEmail = user.email;
    req.session.userType = userType;

    // Success message
    console.log(`Login success: ${userType} (${userId}) - ${email}`);
    await renderDashboard(res, `${userType}Dashboard`, { email: user.email });

  } catch (error) {
    // error thrown
    console.error(`Login error (${userType}):`, error);
    res.status(500).json({ message: "An error occurred during login." });
  }
});

// Validates session & renders dashboard
authRoute.get(`/:userType/Dashboard`, async (req, res) => {
  
  // Is the user allowed to be here?
  const { userType } = req.params;
  console.log(`Dashboard access request: ${userType}`);

  // If not, redirect to login page
  if (!req.session.userId || req.session.userType !== userType) {
    console.log(`Unauthorized access. Redirecting to /${userType}Login.`);
    return res.redirect(`/${userType}Login`);
  }

  // Render :)
  await renderDashboard(res, `${userType}Dashboard`, { email: req.session.userEmail });
});

export default authRoute;

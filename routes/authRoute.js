import express from "express";
import { ensureGuest } from "../middleware/ensureGuest.js";
import { verifyPassword, verifyTwoStep } from "../middleware/verification.js";
import admin from "../models/admin.js";
import faculty from "../models/faculty.js";
import student from "../models/student.js";
import Announcement from "../models/annoucements.js";

const authRoute = express.Router();

// Select user model based on userType
const getUserModel = (userType) => {
  const models = { admin, faculty, student };
  return models[userType] || null;
};

// Fetch announcements (ordered by date)
const fetchAnnouncements = async () => {
  console.log("Fetching announcements...");
  return await Announcement.findAll({ order: [["created_at", "DESC"]] });
};

// Handle dashboard rendering with announcements & prevent caching
const renderDashboard = async (res, dashboard, user, error = null) => {
  try {
    const announcements = await fetchAnnouncements();

    res.set("Cache-Control", "no-store, no-cache, must-revalidate, private"); // Prevent back navigation
    res.render(dashboard, { user, announcements, error });

    console.log(`Dashboard rendered: ${dashboard}`);
  } catch (fetchError) {
    console.error(`Error loading announcements for ${dashboard}:`, fetchError);
    res.status(500).render(dashboard, { user, announcements: [], error: "Failed to load announcements" });
  }
};

// Handles userType login
authRoute.post("/:userType/login", ensureGuest, async (req, res) => {
  const { email, pwd_hash, two_stepHash } = req.body;
  const { userType } = req.params;

  console.log(`Login attempt: ${userType} - ${email}`);

  try {
    if (!email || !pwd_hash || !two_stepHash) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const UserModel = getUserModel(userType);
    if (!UserModel) return res.status(400).json({ message: "Invalid user type." });

    const user = await UserModel.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: `${userType} not found.` });

    const userId = user[`${userType}_id`];
    if (!userId) return res.status(400).json({ message: `Invalid ${userType} configuration.` });

    const [pwdMatch, twoStepMatch] = await Promise.all([
      verifyPassword(pwd_hash, user.pwd_hash),
      verifyTwoStep(two_stepHash, user.two_stepHash),
    ]);

    if (!pwdMatch || !twoStepMatch) return res.status(401).json({ message: "Invalid credentials." });

    // Set session data
    req.session.userId = userId;
    req.session.userEmail = user.email;
    req.session.userType = userType;

    console.log(`Login success: ${userType} (${userId}) - ${email}`);
    await renderDashboard(res, `${userType}Dashboard`, { email: user.email });

  } catch (error) {
    console.error(`Login error (${userType}):`, error);
    await renderDashboard(res, `${userType}Dashboard`, { email: req.body.email }, "An error occurred during login.");
  }
});

// Logout user and redirect to homepage (prevents back button restoring session)
authRoute.post("/logout", (req, res) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        console.error("Error destroying session:", err);
        return res.status(500).json({ message: "Logout failed. Please try again." });
      }
      console.log("User successfully logged out.");

      res.set("Cache-Control", "no-store, no-cache, must-revalidate, private"); // Prevents browser caching
      res.redirect("/");
    });
  } else {
    res.redirect("/");
  }
});

// Validates session, renders dashboard & prevents cached access
authRoute.get(`/:userType/Dashboard`, async (req, res) => {
  const { userType } = req.params;
  console.log(`Dashboard access request: ${userType}`);

  res.set("Cache-Control", "no-store, no-cache, must-revalidate, private"); // Ensures a fresh session check

  if (!req.session.userId || req.session.userType !== userType) {
    console.log(`Unauthorized access. Redirecting to /${userType}Login.`);
    return res.redirect(`/${userType}Login`);
  }

  await renderDashboard(res, `${userType}Dashboard`, { email: req.session.userEmail });
});

export default authRoute;
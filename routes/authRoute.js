import express from "express";
import { ensureGuest } from "../middleware/ensureGuest.js";
import { verifyPassword, verifyTwoStep } from "../middleware/verification.js";
import admin from "../models/admin.js";
import faculty from "../models/faculty.js";
import student from "../models/student.js";
import Announcement from "../models/annoucements.js";

const authRoute = express.Router();

// Handle user login and validate credentials
authRoute.post("/:userType/login", ensureGuest, async (req, res) => {
  const { email, pwd_hash, two_stepHash } = req.body;
  const { userType } = req.params;
  console.log(`Received ${userType} login request:`, req.body);

  try {
    if (!email || !pwd_hash || !two_stepHash) {
      console.log("Login failed: Missing required fields.");
      return res.status(400).json({ message: "All fields are required." });
    }

    let UserModel;
    switch (userType) {
      case "admin":
        UserModel = admin;
        break;
      case "faculty":
        UserModel = faculty;
        break;
      case "student":
        UserModel = student;
        break;
      default:
        return res.status(400).json({ message: "Invalid user type." });
    }

    const validUser = await UserModel.findOne({ where: { email } });
    if (!validUser) {
      console.log(`Login failed: ${userType} with email '${email}' not found.`);
      return res.status(404).json({ message: `${userType} not found.` });
    }

    const userId = validUser[`${userType}_id`];
    if (!userId) {
      console.log(`Login failed: ${userType} ID is missing for email '${email}'.`);
      return res.status(400).json({ message: `Invalid ${userType} configuration.` });
    }

    const pwdMatch = await verifyPassword(pwd_hash, validUser.pwd_hash);
    if (!pwdMatch) {
      console.log(`Login failed: Invalid password for ${userType} email '${email}'.`);
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const twoStepMatch = await verifyTwoStep(two_stepHash, validUser.two_stepHash);
    if (!twoStepMatch) {
      console.log(`Login failed: Invalid two-step authentication for ${userType} email '${email}'.`);
      return res.status(401).json({ message: "Invalid credentials." });
    }

    req.session.userId = userId;
    req.session.userEmail = validUser.email;
    req.session.userType = userType;

    console.log(`Login successful: ${userType} ID ${userId}, Email: ${validUser.email}`);
    console.log(`${userType} with ID ${req.session.userId} looking to access the ${userType} dashboard.`);

    const typeDashboard = `${userType}Dashboard`;

    // Fetch announcements before rendering dashboard
    try {
      const announcements = await Announcement.findAll({
        order: [["created_at", "DESC"]],
      });

      console.log("Loaded announcements:", announcements); // Debugging
      res.render(typeDashboard, { announcements });
    } catch (error) {
      console.error("Error loading dashboard announcements:", error);
      res.status(500).render(typeDashboard, {
        announcements: [],
        error: "Failed to load announcements",
      });
    }
  } catch (error) {
    console.error(`Error during ${userType} login for email '${email}':`, error);
    return res.status(500).json({ message: "An error occurred during login." });
  }
});

// Render the user dashboard with session validation & announcements
authRoute.get(`/:userType/Dashboard`, async (req, res) => {
  const { userType } = req.params;
  console.log(`Received request for ${userType} dashboard
    Session ID: ${req.session.userId}
    User Email: ${req.session.userEmail}`);

  if (!req.session.userId || req.session.userType !== userType) {
    console.log(`Unauthorized access to /${userType}Dashboard. Redirecting to /${userType}Login.`);
    return res.redirect(`/${userType}Login`);
  }

  try {
    // 🔥 Fetch announcements again here for direct dashboard route
    const announcements = await Announcement.findAll({
      order: [["created_at", "DESC"]],
    });

    console.log(`Loaded announcements for ${userType}:`, announcements);
    res.render(`${userType}Dashboard`, {
      user: { email: req.session.userEmail },
      announcements,
    });
  } catch (error) {
    console.error("Error loading dashboard announcements:", error);
    res.status(500).render(`${userType}Dashboard`, {
      user: { email: req.session.userEmail },
      announcements: [],
      error: "Failed to load announcements",
    });
  }
});

export default authRoute;

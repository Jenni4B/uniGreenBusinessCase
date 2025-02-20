import express from "express"
import { ensureGuest } from "../middleware/ensureGuest.js"
import { verifyPassword, verifyTwoStep } from "../middleware/verification.js"
import admin from "../models/admin.js"
import faculty from "../models/faculty.js"
import student from "../models/student.js"
import Announcement from "../models/annoucements.js"

const authRoute = express.Router()

// Handle user login and validate credentials
authRoute.post("/:userType/login", ensureGuest, async (req, res) => {
  const { email, pwd_hash, two_stepHash } = req.body
  const { userType } = req.params
  console.log(`Received ${userType} login request:`, req.body)

  try {
    // Validate input fields
    if (!email || !pwd_hash || !two_stepHash) {
      console.log("Login failed: Missing required fields.")
      return res.status(400).json({ message: "All fields are required." })
    }

    // Determine the user model based on userType
    let UserModel
    switch (userType) {
      case "admin":
        UserModel = admin
        break
      case "faculty":
        UserModel = faculty
        break
      case "student":
        UserModel = student
        break
      default:
        return res.status(400).json({ message: "Invalid user type." })
    }

    // Fetch the user record from the database
    const validUser = await UserModel.findOne({ where: { email } })

    if (!validUser) {
      console.log(`Login failed: ${userType} with email '${email}' not found.`)
      return res.status(404).json({ message: `${userType} not found.` })
    }

    // Verify user ID
    const userId = validUser[`${userType}_id`]
    if (!userId) {
      console.log(`Login failed: ${userType} ID is missing for email '${email}'.`)
      return res.status(400).json({ message: `Invalid ${userType} configuration.` })
    }

    // Verify password
    const pwdMatch = await verifyPassword(pwd_hash, validUser.pwd_hash)
    if (!pwdMatch) {
      console.log(`Login failed: Invalid password for ${userType} email '${email}'.`)
      return res.status(401).json({ message: "Invalid credentials." })
    }

    // Verify two-step authentication
    const twoStepMatch = await verifyTwoStep(two_stepHash, validUser.two_stepHash)
    if (!twoStepMatch) {
      console.log(`Login failed: Invalid two-step authentication for ${userType} email '${email}'.`)
      return res.status(401).json({ message: "Invalid credentials." })
    }

    // Set up session for the user
    req.session.userId = userId
    req.session.userEmail = validUser.email
    req.session.userType = userType

    console.log(`Login successful: ${userType} ID ${userId}, Email: ${validUser.email}`)
    console.log(`${userType} with ID ${req.session.userId} looking to access the ${userType} dashboard.`)

    // Redirect to dashboard after successful login
    const typeDashboard = `/${userType}Dashboard`
    console.log(`Dashboard retrieved: ${typeDashboard}`)
    console.log(`DEBUGG::Successfully logged in as ${userType}`)
     res.render('adminDashboard', {Announcement : "analytics"})

  } catch (error) {
    console.error(`Error during ${userType} login for email '${email}':`, error)
    return res.status(500).json({ message: "An error occurred during login." })
  }
})

// Render the user dashboard with session validation
authRoute.get(`/userType/Dashboard`, (req, res) => {
  const { userType } = req.params
  console.log(`Received request for ${userType} dashboard
    Session ID: ${req.session.userId}
    User Email: ${req.session.userEmail}`)

  if (!req.session.userId || req.session.userType !== userType) {
    console.log(`Unauthorized access to /${userType}Dashboard. Redirecting to /${userType}Login.`)
    return res.redirect(`/${userType}Login`)
  }

  console.log(`${userType} with ID ${req.session.userId} accessed the ${userType} dashboard.`)
  res.render(`${userType}Dashboard`, { user: { email: req.session.userEmail } })
})



export default authRoute


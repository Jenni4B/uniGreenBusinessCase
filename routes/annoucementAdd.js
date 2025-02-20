import express from "express"
import Announcement from "../models/annoucements.js"

const announcementRouter = express.Router()

// POST route to create a new announcement
announcementRouter.post("/announcements", async (req, res) => {
  try {
    const { title, message } = req.body
    const newAnnouncement = await Announcement.create({ title, message })
    res.status(201).json(newAnnouncement)
  } catch (error) {
    console.log("Error creating announcement:", error)
    res.status(500).json({ message: "Error creating announcement" })
  }
})

// GET route to fetch announcements and render dashboard
announcementRouter.get("/", async (req, res) => {
  try {
    const announcements = await Announcement.findAll({
      order: [['created_at', 'DESC']]
    });
    res.render("dashboard", { announcements });
  } catch (error) {
    console.error("Error fetching announcements:", error);
    res.status(500).render("dashboard", { announcements: [], error: "Error fetching announcements" });
  }
});

export default announcementRouter
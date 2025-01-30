import express from 'express';
import Announcement from '../models/annoucements.js'; // Import Sequelize model

const addAnnouncementRouter = express.Router();

// Create Announcement
addAnnouncementRouter.post('/', async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) return res.status(400).json({ error: "Message is required" });

        const newAnnouncement = await Announcement.create({ message });

        res.status(201).json(newAnnouncement);
    } catch (error) {
        console.error("Error creating announcement:", error);
        res.status(500).json({ error: "Server error" });
    }
});

// Get All Announcements
addAnnouncementRouter.get('/', async (req, res) => {
    try {
        const announcements = await Announcement.findAll();
        res.status(200).json(announcements);
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

export default addAnnouncementRouter;
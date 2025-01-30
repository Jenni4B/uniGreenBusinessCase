import express from 'express';
import Announcement from '../models/announcements.js'; // Import Sequelize model

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

const createAnnoucement = document.addEventListener("DOMContentLoaded", () => {
    const addBtn = document.getElementById("addAnnouncementBtn");
    const form = document.getElementById("announcementForm");
    const submitBtn = document.getElementById("submitAnnouncement");
    const closeBtn = document.getElementById("closeForm");

    // Show the form when the button is clicked
    addBtn.addEventListener("click", () => {
        form.classList.remove("hidden");
    });

    // Hide the form when cancel is clicked
    closeBtn.addEventListener("click", () => {
        form.classList.add("hidden");
    });

    // Handle form submission
    submitBtn.addEventListener("click", async () => {
        const message = document.getElementById("announcementMessage").value.trim();

        if (!message) {
            alert("Please enter an announcement message.");
            return;
        }

        try {
            const response = await fetch("/api/announcements", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message }),
            });

            if (!response.ok) throw new Error("Failed to create announcement");

            alert("Announcement created successfully!");
            form.classList.add("hidden"); // Hide form after submission
            document.getElementById("announcementMessage").value = ""; // Clear input

        } catch (error) {
            console.error("Error:", error);
            alert("Error creating announcement.");
        }
    });
});


export {addAnnouncementRouter, createAnnoucement};
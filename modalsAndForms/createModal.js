export function createAnnouncementModal() {
    document.addEventListener("DOMContentLoaded", () => {
        const addBtn = document.getElementById("addAnnouncementBtn");
        const form = document.getElementById("announcementForm");
        const submitBtn = document.getElementById("submitAnnouncement");
        const closeBtn = document.getElementById("closeForm");

        if (!addBtn || !form || !submitBtn || !closeBtn) {
            console.error("One or more elements are missing from the DOM.");
            return;
        }

        // Show the form when the button is clicked
        addBtn.addEventListener("click", () => {
            form.classList.remove("hidden");
            console.log("Add Announcement button clicked");
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
}
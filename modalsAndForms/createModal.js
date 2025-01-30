export function createAnnouncementModal() {
    document.addEventListener("DOMContentLoaded", () => {
        const addBtn = document.getElementById("addAnnouncementBtn");
        const form = document.getElementById("announcementForm");
        const submitBtn = document.getElementById("submitAnnouncement");

        if (!addBtn || !form || !submitBtn) {
            console.error("One or more elements are missing from the DOM.");
            return;
        }

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

                if (!response.ok) {
                    console.error('Error creating announcement:');
                    console.error('Status:', response.status);
                    console.error('Status Text:', response.statusText);
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                alert("Announcement created successfully!");
                
                // Hide Bootstrap modal properly
                const modal = bootstrap.Modal.getInstance(document.getElementById("announcementModal"));
                modal.hide();

                document.getElementById("announcementMessage").value = ""; // Clear input
            } catch (error) {
                console.error("Error:", error);
                alert("Error creating announcement.");
            }
        });

        // Ensure Feather icons load
        feather.replace();
    });
}
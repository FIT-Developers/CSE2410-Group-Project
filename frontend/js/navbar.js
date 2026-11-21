// Used by: frontend/components/navbar.html

// This handles the navbar component.
// It routes the user to the correct page when they click on a navbar button.
document.addEventListener("DOMContentLoaded", () => {
	const placeholder = document.getElementById("navbar-placeholder");
	if (!placeholder) return;

	fetch("../components/navbar.html")
		.then(res => {
			if (!res.ok) throw new Error("Failed to load navbar");
			return res.text();
		})
		.then(html => {
			placeholder.innerHTML = html;

			// Highlights the link matching the current page
			const currentPage = window.location.pathname.split("/").pop() || "home.html";
			placeholder.querySelectorAll("a").forEach(link => {
				if (link.getAttribute("href").endsWith(currentPage)) {
					link.classList.add("active");
				}
			});
		})
		.catch(err => console.error("Navbar component error:", err));
});
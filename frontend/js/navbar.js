// ==========================================================================
// SECTION: Information
// ==========================================================================

	// Author: Michael Woodyard
	// Used by: frontend/index.html and frontend/html/*.html

// ==========================================================================
// SECTION: Navbar
// ==========================================================================

// It routes the user to the correct page when they click on a navbar button.
document.addEventListener("DOMContentLoaded", () => {
	const placeholder = document.getElementById("navbar-placeholder");
	if (!placeholder) return;

	// Check if the current page is inside the /html/ subfolder
	const inSubfolder = window.location.pathname.includes("/html/");
	const basePrefix = inSubfolder ? "../" : "./";

	fetch(`${basePrefix}components/navbar.html`)
		.then(res => {
			if (!res.ok) throw new Error("Failed to load navbar");
			return res.text();
		})
		.then(html => {
			placeholder.innerHTML = html;

			// Highlights the link matching the current page (defaults to index.html at root)
			const currentPage = window.location.pathname.split("/").pop() || "index.html";

			placeholder.querySelectorAll("a").forEach(link => {
				// Adjust link href relative to current page depth
				const rawHref = link.getAttribute("href").replace(/^(\.\.\/|\.\/)/, "");
				link.setAttribute("href", `${basePrefix}${rawHref}`);

				if (rawHref.endsWith(currentPage)) {
					link.classList.add("active");
				}
			});
		})
		.catch(err => console.error("Navbar component error:", err));
});
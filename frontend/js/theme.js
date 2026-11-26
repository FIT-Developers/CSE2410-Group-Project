// ==========================================================================
// SECTION: INFORMATION
// ==========================================================================

	// Author: Michael Woodyard
	// Used by: All HTML files in frontend/html/

	// Note: Manages the application-wide light/dark mode state via localStorage and the root attribute.
	//       Designed to load in early, so themes apply before the browser paints anything.

// ==========================================================================
// SECTION: THEME CONTROLLER (LIGHT / DARK MODE)
// ==========================================================================

// Function that will be immediately invoked
// Any variables created here are scoped locally, it'll prevent any mixups
(function () {

	// Saves and retrieve the theme setting in browser localStorage
	const STORAGE_KEY = 'campus-map-theme';

	/* --- Subsection: Theme Retrieval & Application --- */

	// Reads the saved theme preference from localStorage
	// If no valid preference has been stored yet, then it falls back to dark
	function getPreferredTheme() {
		const saved = localStorage.getItem(STORAGE_KEY);

		// Only accept explicitly supported theme strings
		if (saved === 'light' || saved === 'dark') {
			return saved;
		}

		// Default to light theme
		return 'light';
	}

	// Applies the chosen theme to the document root,
	// Persists it to localStorage, and synchronizes all theme toggle controls on the page
	function applyTheme(theme) {

		// Set the data-theme attribute on <html> so CSS rules take effect
		document.documentElement.setAttribute('data-theme', theme);

		// Persist the selection across page reloads, and tab navigations
		localStorage.setItem(STORAGE_KEY, theme);

		// Sync the Settings page checkbox toggle, if it exists on the current page
		const settingsToggle = document.getElementById('dark-mode-toggle');
		if (settingsToggle) {
			settingsToggle.checked = theme === 'dark';
		}

		// Sync the shared navbar quick-toggle button icon and accessibility label
		const navBtn = document.getElementById('theme-toggle-btn');
		if (navBtn) {
			// Emoji's, depending on the chosen theme
			navBtn.textContent = theme === 'dark' ? '☀️' : '🌙';
			navBtn.setAttribute(
				'aria-label',
				theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'
			);
		}
	}

	/* --- Subsection: Initial Execution & Event Listeners --- */

	// Run immediately when this script is parsed, before DOMContentLoaded
	// so the root element has the right theme before the first paint,
	// preventing a brief flash of the wrong background color
	applyTheme(getPreferredTheme());

	// Once the DOM is fully constructed, resync UI controls and attach listeners
	document.addEventListener('DOMContentLoaded', () => {
		// Re-run applyTheme now that body elements (#dark-mode-toggle, etc.) exist
		applyTheme(getPreferredTheme());

		// Listen for changes on the Settings page toggle switch
		const settingsToggle = document.getElementById('dark-mode-toggle');
		if (settingsToggle) {
			settingsToggle.addEventListener('change', (event) => {
				applyTheme(event.target.checked ? 'dark' : 'light');
			});
		}

		// Use document-level event delegation for the navbar toggle button
		// components/navbar.html is injected asynch. via fetch()
		document.addEventListener('click', (event) => {
			if (event.target.closest('#theme-toggle-btn')) {
				const currentTheme = document.documentElement.getAttribute('data-theme');
				const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
				applyTheme(nextTheme);
			}
		});
	});
})();
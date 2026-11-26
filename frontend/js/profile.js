// ==========================================================================
// SECTION: Information
// ==========================================================================

	// Author: Michael Woodyard
	// Used by: frontend/map.html

// ==========================================================================
// SECTION: Profile Overlay & Auth Drawer
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
	// Overlay & Dock Buttons
	const profileOverlay          = document.getElementById("profile-overlay");
	const navProfileBtn           = document.getElementById("nav-profile-btn");
	const navMapBtn               = document.getElementById("nav-map-btn");
	const closeProfileBtn         = document.getElementById("close-profile-btn");
	const closeProfileSignedInBtn = document.getElementById("close-profile-signed-in-btn");

	// Views
	const signedOutView    = document.getElementById("signed-out-view");
	const signedInView     = document.getElementById("signed-in-view");
	const userDisplayEmail = document.getElementById("user-display-email");

	// Drawer/Backdrop
	const drawer         = document.getElementById("auth-drawer");
	const backdrop       = document.getElementById("auth-backdrop");

	// Open Login/Signup
	const openLoginBtn   = document.getElementById("open-login-btn");
	const openSignupBtn  = document.getElementById("open-signup-btn");

	// Close Drawer
	const closeDrawerBtn = document.getElementById("close-drawer-btn");

	// Tabs
	const tabLogin     = document.getElementById("tab-login");
	const tabSignup    = document.getElementById("tab-signup");

	// Form
	const confirmGroup = document.getElementById("confirm-password-group");
	const confirmInput = document.getElementById("auth-confirm-password");
	const submitBtn    = document.getElementById("auth-submit-btn");
	const authForm     = document.getElementById("auth-form");
	const authFeedback = document.getElementById("auth-feedback");

	// Logout & Theme
	const logoutBtn      = document.getElementById("logout-btn");
	const themeToggleBtn = document.getElementById("theme-toggle-btn");
	let authMode = "login";

	// Search Backdrop & Auto-Close when Bottom Nav Clicked
	const searchPopup    = document.getElementById("search-popup");
	const searchBar      = document.getElementById("search-bar");
	const searchCancel   = document.getElementById("cancel");
	const searchBackdrop = document.getElementById("search-backdrop");
	const bottomNavItems = document.querySelectorAll(".bottom-nav .nav-item");

	// Schedule Overlay
	const scheduleOverlay  = document.getElementById("schedule-overlay");
	const navScheduleBtn   = document.getElementById("nav-schedule-btn");
	const closeScheduleBtn = document.getElementById("close-schedule-btn");

	// Close Search
	function closeSearchUI() {
		if (!searchPopup || !searchPopup.classList.contains("open")) return;
		if (searchCancel) {
			searchCancel.click();
		} else {
			searchPopup.classList.remove("open");
			if (searchBar) searchBar.classList.remove("show");
		}
		if (searchBackdrop) searchBackdrop.classList.remove("open");
	}

	// Keep searchBackdrop synced whenever searchPopup opens or closes
	if (searchPopup && searchBackdrop) {
		const observer = new MutationObserver(() => {
			if (searchPopup.classList.contains("open")) {
				searchBackdrop.classList.add("open");
			} else {
				searchBackdrop.classList.remove("open");
			}
		});
		observer.observe(searchPopup, { attributes: true, attributeFilter: ["class"] });

		searchBackdrop.addEventListener("click", closeSearchUI);
	}

	// Close search bar/dropdown whenever any bottom dock button is clicked
	bottomNavItems.forEach((item) => {
		item.addEventListener("click", () => {
			closeSearchUI();
		});
	});


	// --- Profile Overlay Controls ---
	function openProfileOverlay() {
		closeScheduleOverlay();

		if (!profileOverlay) return;

		profileOverlay.classList.add("open");
		profileOverlay.setAttribute("aria-hidden", "false");

		if (navProfileBtn) navProfileBtn.classList.add("active");
		if (navMapBtn) navMapBtn.classList.remove("active");
	}

	function closeProfileOverlay() {
		closeDrawer();

		if (!profileOverlay) return;

		profileOverlay.classList.remove("open");
		profileOverlay.setAttribute("aria-hidden", "true");

		if (navProfileBtn) navProfileBtn.classList.remove("active");

		if (navMapBtn && (!scheduleOverlay || !scheduleOverlay.classList.contains("open"))) {
			navMapBtn.classList.add("active");
		}
	}

	if (navProfileBtn) {
		navProfileBtn.addEventListener("click", () => {
			if (profileOverlay.classList.contains("open")) {
				closeProfileOverlay();
			} else {
				openProfileOverlay();
			}
		});
	}

	if (navMapBtn) {
		navMapBtn.addEventListener("click", (event) => {
			const profileOpen  = profileOverlay && profileOverlay.classList.contains("open");
			const scheduleOpen = scheduleOverlay && scheduleOverlay.classList.contains("open");

			if (profileOpen || scheduleOpen) {
				event.preventDefault();
				closeProfileOverlay();
				closeScheduleOverlay();
			}
		});
	}

	if (closeProfileBtn) closeProfileBtn.addEventListener("click", closeProfileOverlay);
	if (closeProfileSignedInBtn) closeProfileSignedInBtn.addEventListener("click", closeProfileOverlay);

	profileOverlay.addEventListener("click", (event) => {
		if (event.target === profileOverlay) {
			closeProfileOverlay();
		}
	});

	// --- Schedule Overlay Controls ---
	function openScheduleOverlay() {
		closeProfileOverlay();
		if (!scheduleOverlay) return;
		scheduleOverlay.classList.add("open");
		scheduleOverlay.setAttribute("aria-hidden", "false");
		if (navScheduleBtn) navScheduleBtn.classList.add("active");
		if (navMapBtn) navMapBtn.classList.remove("active");
	}

	function closeScheduleOverlay() {
		if (!scheduleOverlay) return;
		scheduleOverlay.classList.remove("open");
		scheduleOverlay.setAttribute("aria-hidden", "true");
		if (navScheduleBtn) navScheduleBtn.classList.remove("active");
		if (navMapBtn && (!profileOverlay || !profileOverlay.classList.contains("open"))) {
			navMapBtn.classList.add("active");
		}
	}

	if (navScheduleBtn) {
		navScheduleBtn.addEventListener("click", () => {
			if (scheduleOverlay.classList.contains("open")) {
				closeScheduleOverlay();
			} else {
				openScheduleOverlay();
			}
		});
	}

	if (closeScheduleBtn) closeScheduleBtn.addEventListener("click", closeScheduleOverlay);

	if (scheduleOverlay) {
		scheduleOverlay.addEventListener("click", (event) => {
			if (event.target === scheduleOverlay) {
				closeScheduleOverlay();
			}
		});
	}

	// --- Drawer Controls ---
	function setAuthMode(mode) {
		authMode = mode;
		authFeedback.textContent = "";

		if (mode === "signup") {
			tabSignup.classList.add("active");
			tabLogin.classList.remove("active");
			confirmGroup.classList.remove("hidden");
			confirmInput.required = true;
			submitBtn.textContent = "Create Account";
		} else {
			tabLogin.classList.add("active");
			tabSignup.classList.remove("active");
			confirmGroup.classList.add("hidden");
			confirmInput.required = false;
			submitBtn.textContent = "Log In";
		}
	}

	function openDrawer(mode = "login") {
		setAuthMode(mode);
		drawer.classList.add("open");
		backdrop.classList.add("open");
		drawer.setAttribute("aria-hidden", "false");
	}

	function closeDrawer() {
		drawer.classList.remove("open");
		backdrop.classList.remove("open");
		drawer.setAttribute("aria-hidden", "true");
		authFeedback.textContent = "";
	}

	openLoginBtn.addEventListener("click", () => openDrawer("login"));
	openSignupBtn.addEventListener("click", () => openDrawer("signup"));
	closeDrawerBtn.addEventListener("click", closeDrawer);
	backdrop.addEventListener("click", closeDrawer);

	tabLogin.addEventListener("click", () => setAuthMode("login"));
	tabSignup.addEventListener("click", () => setAuthMode("signup"));

	// --- Auth State Rendering ---
	function renderSignedIn(email) {
		userDisplayEmail.textContent = email;
		signedOutView.classList.add("hidden");
		signedInView.classList.remove("hidden");
		closeDrawer();
	}

	function renderSignedOut() {
		signedInView.classList.add("hidden");
		signedOutView.classList.remove("hidden");
	}

	// Check active session via Spring Boot /api/me, with local fallback
	async function checkSession() {
		try {
			const res = await fetch("/api/me", { credentials: "include" });
			if (res.ok) {
				const data = await res.json();
				if (data && data.email) {
					renderSignedIn(data.email);
					return;
				}
			}
		} catch (_) {
			// Backend offline, check demo session
		}

		const savedUser = localStorage.getItem("campus_map_user");
		if (savedUser) {
			renderSignedIn(savedUser);
		} else {
			renderSignedOut();
		}
	}

	// --- Form Submission (/api/login & /api/signup) ---
	authForm.addEventListener("submit", async (event) => {
		event.preventDefault();
		authFeedback.textContent = "";

		const email           = document.getElementById("auth-email").value.trim();
		const password        = document.getElementById("auth-password").value;
		const confirmPassword = confirmInput.value;

		if (authMode === "signup" && password !== confirmPassword) {
			authFeedback.textContent = "Passwords do not match.";
			return;
		}

		submitBtn.disabled    = true;
		submitBtn.textContent = authMode === "signup" ? "Creating Account..." : "Signing In...";

		try {
			let csrfHeader = {};
			const csrfRes = await fetch("/api/csrf", { credentials: "include" });
			if (csrfRes.ok) {
				const csrfData = await csrfRes.json();
				if (csrfData.headerName && csrfData.token) {
					csrfHeader[csrfData.headerName] = csrfData.token;
				}
			}

			if (authMode === "signup") {
				const res = await fetch("/api/signup", {
					method:      "POST",
					headers:     { "Content-Type": "application/json", ...csrfHeader },
					credentials: "include",
					body:        JSON.stringify({ email, password })
				});

				if (!res.ok) {
					throw new Error("Unable to create account. Email may already exist.");
				}
			} else {
				const formBody = new URLSearchParams({ username: email, password });
				const res = await fetch("/api/login", {
					method:      "POST",
					headers:     { "Content-Type": "application/x-www-form-urlencoded", ...csrfHeader },
					credentials: "include",
					body:        formBody
				});

				if (!res.ok) {
					throw new Error("Invalid email or password.");
				}
			}

			localStorage.setItem("campus_map_user", email);
			authForm.reset();
			renderSignedIn(email);
		} catch (err) {
			if (err instanceof TypeError) {
				localStorage.setItem("campus_map_user", email);
				authForm.reset();
				renderSignedIn(email);
			} else {
				authFeedback.textContent = err.message;
			}
		} finally {
			submitBtn.disabled = false;
			submitBtn.textContent = authMode === "signup" ? "Create Account" : "Log In";
		}
	});

	// --- Sign Out ---
	logoutBtn.addEventListener("click", async () => {
		try {
			await fetch("/api/logout", { method: "POST", credentials: "include" });
		} catch (_) {
			// Ignore if backend is offline
		}
		localStorage.removeItem("campus_map_user");
		renderSignedOut();
	});

	// --- Theme Toggle Button ---
	if (themeToggleBtn) {
		themeToggleBtn.addEventListener("click", () => {
			const current = document.documentElement.getAttribute("data-theme") || "dark";
			const next    = current === "dark" ? "light" : "dark";
			document.documentElement.setAttribute("data-theme", next);
			localStorage.setItem("theme", next);
		});
	}

	checkSession();
});
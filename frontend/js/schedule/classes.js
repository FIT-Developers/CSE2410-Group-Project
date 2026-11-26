// ============================================================================================================================================================
// ===================================================Storing, Showing, Adding, Error Handling of Classes======================================================
// ============================================================================================================================================================
// Grabs the localStorage data, if none then empty array
let classes = JSON.parse(localStorage.getItem("myClasses")) || [];

// Auto-format time inputs as the user types
function attachAutoColon(inputEventListener) {

	if (!inputEventListener) return;

	inputEventListener.addEventListener('input', (event) => {
		let digits = event.target.value.replace(/\D/g, '').slice(0, 4);

		if (digits.length === 3) {
			event.target.value = `${digits[0]}:${digits.slice(1)}`;
		} else if (digits.length === 4) {
			event.target.value = `${digits.slice(0, 2)}:${digits.slice(2)}`;
		} else {
			event.target.value = digits;
		}
	});
}

attachAutoColon(document.getElementById('starttime'));
attachAutoColon(document.getElementById('endtime'));


const clsBtn = document.getElementById('cls-btn');
clsBtn.addEventListener('click', function() {
	// Dictionary of all info, this is grabbing all input fields
	const clsname     = document.getElementById('clsname').value;
	const day         = document.getElementById('day-select').value;
	const rawStart    = document.getElementById('starttime').value.trim();
	const rawEnd      = document.getElementById('endtime').value.trim();
	const startPeriod = document.getElementById('start-period').value;
	const endPeriod   = document.getElementById('end-period').value;
	const location    = document.getElementById('location-select').value;
	const rmnum       = document.getElementById('rmnum').value;
	const color       = document.getElementById('color').value;

	const starttime = rawStart ? `${rawStart}${startPeriod}` : "";
	const endtime   = rawEnd ? `${rawEnd}${endPeriod}` : "";

	// We then error check all those fields, if they are empty or time is in acceptable format
	if (clsname == null || clsname == "") {
		console.warn("Class Name is empty");
		return;
	}
	if (rmnum == null || rmnum == "") {
		console.warn("Room Number is empty");
		return;
	}
	if (starttime == null || starttime == "") {
		console.warn("Start Time is empty");
		return;
	} else if (!(/^((8|9|10|11)(:[0-5][0-9])?\s?am|(12|[1-7])(:[0-5][0-9])?\s?pm|8(:00)?\s?pm)$/i.test(starttime.trim()))) {
		console.warn("Start Time wrong format/range (valid range: 8:00am - 8:00pm)");
		return;
	}

	// Useful for converting these string times to values and comparing which one is later in the day
	const toMs = t => Date.parse(`1/1/2000 ${t.replace(/^(\d{1,2})\s*(am|pm)$/i, "$1:00 $2").replace(/(am|pm)$/i, " $1")}`);
	if (endtime == null || endtime == "") {
		console.warn("End Time is empty");
		return;
	} else if (!(/^((8|9|10|11)(:[0-5][0-9])?\s?am|(12|[1-7])(:[0-5][0-9])?\s?pm|8(:00)?\s?pm)$/i.test(endtime.trim()))) {
		console.warn("End Time wrong format/range (valid range: 8:00am - 8:00pm)");
		return;
	} else if (toMs(starttime) >= toMs(endtime)) {
		console.warn("End Time must be later than Start Time");
		return;
	}

	// Go to add class function which pushes data to localStorage and syncs backend
	addClass(clsname, day, starttime, endtime, location, rmnum, color);
	// Places the html blocks on the correct day and times
	renderClasses();

	// Show the list of class objects obtained
	console.log(classes);
});

function normalizeTime(value) {
	const compact = value.trim().toLowerCase().replace(/\s+/g, '');
	return compact.replace(/^(\d{1,2})(am|pm)$/, '$1:00$2');
}


// Add Class
// Michael: Updated so adding a class saves to localStorage,
// updates the grid immediately, clears the inputs, and closes #schedule-add-popup,
// while still syncing with /api/classes when the Spring Boot backend is running
async function addClass(name, day, start, end, loc, room, color) {
	const classData = {
		name:  name,
		day:   day,
		start: normalizeTime(start),
		end:   normalizeTime(end),
		loc:   loc,
		room:  room,
		color: color
	};

	// Save locally and render immediately
	classes.push(classData);
	localStorage.setItem("myClasses", JSON.stringify(classes));
	renderClasses();

	// Reset form fields and close
	document.getElementById('clsname').value   = "";
	document.getElementById('starttime').value = "";
	document.getElementById('endtime').value   = "";
	document.getElementById('rmnum').value     = "";
	document.getElementById('schedule-add-popup').classList.remove('open');
	document.getElementById('scheduleArea').classList.remove('blur-active');

	// Sync with backend API if available
	try {
		const csrfResponse = await fetch('/api/csrf');
		if (csrfResponse.ok) {
			const csrf = await csrfResponse.json();
			await fetch('/api/classes', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					[csrf.headerName]: csrf.token
				},
				body: JSON.stringify(classData)
			});
		}
	} catch (_) {
		// Offline mode: localStorage copy is already saved and rendered
	}
}

// Simple slicing function to convert that time to minutes after midnight
function timeToMinutes(time) {
	let dayOrNight = time.toLowerCase().slice(-2);
	let theTime = time.trim().toLowerCase().slice(0, -2).trim();

	// Separate by colon for hours and minutes
	// Give back a 0 if no colon exists
	let [front, back = '0'] = theTime.split(':');
	front = parseInt(front, 10);
	back = parseInt(back, 10);

	// Convert to 24-hour format
	if (dayOrNight === 'pm' && front !== 12) {front += 12;}
	if (dayOrNight === 'am' && front === 12) {front = 0;}

	// Returns the minutes by multiplying the front by 60 and adding the leftover minutes
	return front * 60 + back;
}

// Actually implementing the html div, of the classes
function renderClasses() {
	// Clear existing blocks before redrawing them
	document.querySelectorAll('.class-block').forEach(el => el.remove());

	const classes = JSON.parse(localStorage.getItem('myClasses')) || [];

	classes.forEach((cls, index) => {
		const col      = document.getElementById(`${cls.day.toLowerCase()}-col`);
		const clsBlock = document.createElement('div');

		// Grab the total time from midnight subtract the starting time from midnight
		// Then add pixel per minute (every hour is 80px tall) to find the top position and do an offset of 10 as elements have padding-top 10px
		const topPx = (timeToMinutes(cls.start) - (8*60)) * (80/60) + 10;

		// Find the difference between start and end time and convert those minutes to the pixels to determine the height
		const heightPx = (timeToMinutes(cls.end) - timeToMinutes(cls.start)) * (80/60);
		const isSmall  = heightPx <= 70;

		/* Styling the class block */
		clsBlock.className      = 'class-block';
		clsBlock.style.position = 'absolute';
		clsBlock.style.top      = `${topPx}px`;
		clsBlock.style.height   = `${heightPx}px`;
		clsBlock.style.left     = '4px';
		clsBlock.style.right    = '4px';
		clsBlock.style.backgroundColor = cls.color;
		clsBlock.style.borderRadius    = '12px';
		clsBlock.style.padding         = '6px 8px';
		clsBlock.style.boxSizing       = 'border-box';
		clsBlock.style.color           = '#ffffff';
		clsBlock.style.overflow        = 'hidden';

		// Html added inside the div element created
		// Includes the class name at the top, then the times then location with room number
		if (isSmall) {
			// Compact layout
			clsBlock.innerHTML = `
				<div style="display: flex; justify-content: space-between; align-items: center; gap: 4px;">
					<div style="font-weight: 600; font-size: 12px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${cls.name}</div>
					<div class="trash-btn" data-index="${index}" style="flex-shrink: 0; line-height: 0; cursor: pointer;">
						<img src="./assets/icons/menu-icons/trash.svg" alt="" style="width: 14px;">
					</div>
				</div>

				<div style="font-size: 10px; opacity: 0.9; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-top: 2px;">
					${cls.start} - ${cls.end} • ${cls.loc} ${cls.room}
				</div>
			`;
		} else {
			// Standard layout
			clsBlock.innerHTML = `
				<div style="display: flex; justify-content: space-between; align-items: center; gap: 4px;">
					<div style="font-weight: 600; font-size: 12px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${cls.name}</div>
					<div class="trash-btn" data-index="${index}" style="flex-shrink: 0; line-height: 0; cursor: pointer;">
						<img src="./assets/icons/menu-icons/trash.svg" alt="" style="width: 14px;">
					</div>
				</div>
				<div style="font-size: 11px; opacity: 0.9;">${cls.start} - ${cls.end}</div>
				<div style="font-size: 11px; opacity: 0.9;">${cls.loc} • ${cls.room}</div>
			`;
		}

		col.appendChild(clsBlock);
	});
}
// On page load, if not, it won't show up
renderClasses();

// find the schedule area, detect a click in it
document.getElementById('scheduleArea').addEventListener('click', (e) => {
	// Finds closest trash icon that was clicked
	const trashBtn = e.target.closest('.trash-btn');
	if (!trashBtn) return; // Ignore clicks that weren't on a trash icon
	e.stopPropagation(); // Prevents triggering any background clicks

	const index = parseInt(trashBtn.dataset.index, 10); // Turns string to decimal int
	// Remove that specific class object from the array using that index
	classes.splice(index, 1);

	// Save updated array to localStorage and rerender
	localStorage.setItem("myClasses", JSON.stringify(classes));
	renderClasses();
});

// ============================================================================================================================================================
// ============================================================================================================================================================
// ============================================================================================================================================================
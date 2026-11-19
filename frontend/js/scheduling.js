document.addEventListener("DOMContentLoaded", () => {
    // getDay() returns 0 (Sun) to 6 (Sat)
    //const today = new Date().getDay(); 
    const today = 2

    
    // Dictionary mapping the day number to your HTML IDs
    const dayMap = {
        1: 'mon',
        2: 'tues',
        3: 'wed',
        4: 'thurs',
        5: 'fri'
    };

    // If today is in the dictionary
    if (dayMap[today]) {
        const dayId = dayMap[today];
        
        document.getElementById(`${dayId}-head`).classList.add('active');
        document.getElementById(`${dayId}-col`).classList.add('active-bg');
    }
});



// Popup Menu Activation
document.querySelector('#add-btn').addEventListener('click', function() {

    // Adds the open class to the html marker popup, allowing it to slide up and be visible
    document.getElementById('marker-popup').classList.add('open');
    document.getElementById('scheduleArea').classList.add('blur-active');

});
document.getElementById('marker-popup').addEventListener('click', (e) => {
    e.stopPropagation();
});
document.getElementById('scheduleArea').addEventListener('click', (e) => {
    document.getElementById('marker-popup').classList.remove('open');
    document.getElementById('scheduleArea').classList.remove('blur-active');
});






// Draggable Handle Code, parts obtained from a stack overflow
const popup = document.getElementById('marker-popup');
const dragHandle = popup.querySelector('.drag-handle');
const scheduleArea = document.getElementById('scheduleArea');

let startY = 0;
let currentDeltaY = 0;
let isDragging = false;

dragHandle.addEventListener('pointerdown', (e) => {
    isDragging = true;
    startY = e.clientY;
    currentDeltaY = 0;
    popup.classList.add('dragging');
});

dragHandle.addEventListener('pointermove', (e) => {
    if (!isDragging) return;
    // Clamp at 0 so dragging upward does nothing
    currentDeltaY = Math.max(0, e.clientY - startY);
    popup.style.transform = `translateY(${currentDeltaY}px)`;
});

function endDrag(e) {
    if (!isDragging) return;
    isDragging = false;

    popup.classList.remove('dragging');

    // Close if dragged down more than 100px (25%)
    if (currentDeltaY > Math.min(120, popup.offsetHeight * 0.25)) {
        popup.classList.remove('open');
        scheduleArea.classList.remove('blur-active');
    }

    // Activate the CSS transform
    popup.style.transform = '';
    currentDeltaY = 0;
}
// Detects finishing the mouse event and calls the function to determine to close or not
dragHandle.addEventListener('pointerup', endDrag);
dragHandle.addEventListener('pointercancel', endDrag);






/* Dropdown for Location obtained from Json */
const locationSelect = document.getElementById('location-select');

async function loadLocations() {
    const response = await fetch('./data/markers.json');
    const locations = await response.json();

    // Sort tooltip alphabetically
    locations.sort((a, b) => a.tooltip.localeCompare(b.tooltip));

    locations.forEach(place => {
        // If no tooltip exists for one
        if (!place.tooltip) return;

        // Create dropdown items with the tooltip
        const option = document.createElement('option');
        option.value = place.tooltip;
        option.textContent = place.tooltip;
        locationSelect.appendChild(option);
    });
}

loadLocations();

// ============================================================================================================================================================
// ===================================================Storing, Showing, Adding, Error Handling of Classes======================================================
// ============================================================================================================================================================

let classes = JSON.parse(localStorage.getItem("myClasses")) || [];

const clsBtn = document.getElementById('cls-btn');
clsBtn.addEventListener('click', function() {
    const clsname = document.getElementById('clsname').value;
    const day = document.getElementById('day-select').value;
    const starttime = document.getElementById('starttime').value;
    const endtime = document.getElementById('endtime').value;
    const location = document.getElementById('location-select').value;
    const rmnum = document.getElementById('rmnum').value;
    const color = document.getElementById('color').value;

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
    } else if (!(/^((8|9|10|11)(:[0-5][0-9])?\s?am|(12|[1-7])(:[0-5][0-9])?\s?pm|8(:00)?\s?pm)$/i.test(starttime.trim()))) { //Regex formatting checking if its in the correct format 
        console.warn("Start Time wrong format/range (8:15pm)");
        return;
    }
    // Javascripts built in Date Parser function, found examples and modified
    // Useful for converting these string times to values and comparing which one is later in the day
    const toMs = t => Date.parse(`1/1/2000 ${t.replace(/^(\d{1,2})\s*(am|pm)$/i, "$1:00 $2").replace(/(am|pm)$/i, " $1")}`);
    if (endtime == null || endtime == "") {
        console.warn("End Time is empty");
        return;
    } else if (!(/^((8|9|10|11)(:[0-5][0-9])?\s?am|(12|[1-7])(:[0-5][0-9])?\s?pm|8(:00)?\s?pm)$/i.test(endtime.trim()))) { //Regex formatting checking if its in the correct format 
        console.warn("End Time wrong format/range (8:15pm)");
        return;
    } else if (toMs(starttime) >= toMs(endtime)) {
        console.warn("End Time must be later than Start Time");
        return;
    }

    addClass(clsname, day, starttime, endtime, location, rmnum, color);
    renderClasses();

    // Show the list of class objects obtained
    console.log(classes);

});

function addClass(name, day, start, end, loc, room, color) {
    classes.push({
        name: name,
        day: day,
        start: start,
        end: end,
        loc: loc,
        room: room,
        color: color
    });
    localStorage.setItem("myClasses", JSON.stringify(classes));
}


function timeToMinutes(time) {

    let dayOrNight = time.toLowerCase().slice(-2);
    let theTime = time.trim().toLowerCase().slice(0, -2).trim();

    // Separate by colon for hours and minutes
    // Give back a 0 if no colon exists
    let [front, back = '0'] = theTime.split(':');
    front = parseInt(front, 10); // The 10 means decimal int not octal or hex
    back = parseInt(back, 10);

    // 4. Convert to 24-hour format
    if (dayOrNight === 'pm' && front !== 12) {front += 12;}
    if (theTime === 'am' && front === 12) {front = 0;}

    // Returns the minutes by multiplying the front by 60 and adding the leftover minutes
    return front * 60 + back;
}

function renderClasses() {
    // Clear existing blocks before redrawing them
    document.querySelectorAll('.class-block').forEach(el => el.remove());

    const classes = JSON.parse(localStorage.getItem('myClasses')) || [];

    classes.forEach(cls => {
        const col = document.getElementById(`${cls.day.toLowerCase()}-col`);
        const clsBlock = document.createElement('div');

        // Grab the total time from midnight subtract the starting time from midnight
        // Then add pixel per minute (every hour is 80px tall) to find the top position and do an offset of 10 as elements have padding-top 10px
        const topPx = (timeToMinutes(cls.start) - (8*60)) * (80/60) + 10;
        // Find the difference between start and end time and convert those minutes to the pixels to determine the height
        const heightPx = (timeToMinutes(cls.end) - timeToMinutes(cls.start)) * (80/60);

        /* Styling the class block */
        clsBlock.className = 'class-block';
        clsBlock.style.position = 'absolute';
        clsBlock.style.top = `${topPx}px`;
        clsBlock.style.height = `${heightPx}px`;
        clsBlock.style.left = '4px';
        clsBlock.style.right = '4px';
        clsBlock.style.backgroundColor = cls.color;
        clsBlock.style.borderRadius = '12px';
        clsBlock.style.padding = '6px 8px';
        clsBlock.style.boxSizing = 'border-box';
        clsBlock.style.color = '#ffffff';
        clsBlock.style.overflow = 'hidden';

        // Html added inside the div element created
        // Includes the class name at the top, then the times then location with room number
        clsBlock.innerHTML = `
            <div style="font-weight: 600; font-size: 13px;">${cls.name}</div>
            <div style="font-size: 11px; opacity: 0.9;">${cls.start} • ${cls.end}</div>
            <div style="font-size: 11px; opacity: 0.9;">${cls.loc} • ${cls.room}</div>
            <div style="position: absolute; bottom: 4px; left: 6px;" class="trash-btn"><img src="./assets/icons/menu-icons/trash.svg" alt="" style="width: 14px;"></div>
        `;

        col.appendChild(clsBlock);
    });
}
// On page load
renderClasses()
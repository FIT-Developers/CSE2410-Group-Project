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
    dragHandle.setPointerCapture(e.pointerId); // Keeps tracking even if finger slides off the handle
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
    if (dragHandle.hasPointerCapture(e.pointerId)) {
        dragHandle.releasePointerCapture(e.pointerId);
    }

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
        option.textContent = place.tooltip;
        locationSelect.appendChild(option);
    });
}

loadLocations();

// ============================================================================================================================================================
// ===================================================Storing, Showing, Adding, Error Handling of Classes======================================================
// ============================================================================================================================================================
/*
let tasks = JSON.parse(localStorage.getItem("myTasks")) || [];

const tasks = [
  { id: 1, title: "Finish map layout", completed: true, priority: "high" },
  { id: 2, title: "Fix scheduling bug", completed: false, priority: "medium" },
  { id: 3, title: "Update CSS styles", completed: false, priority: "low" }
];
localStorage.setItem("myTasks", JSON.stringify(tasks));

const rawData = localStorage.getItem("myTasks");
const savedTasks = rawData ? JSON.parse(rawData) : [];

// 2. Access properties just like a normal array of objects
console.log(savedTasks[0].title); // "Finish map layout"
console.log(savedTasks[1].completed);

const currentTasks = JSON.parse(localStorage.getItem("myTasks")) || [];

// 2. Add a new object to the array
currentTasks.push({
  id: 4,
  title: "Deploy site",
  completed: false,
  priority: "high"
});

// 3. Save the updated array back to localStorage
localStorage.setItem("myTasks", JSON.stringify(currentTasks));
*/

const clsBtn = document.getElementById('cls-btn');
clsBtn.addEventListener('click', function() {
    const clsname = document.getElementById('clsname').value;
    const day = document.getElementById('day-select').value;
    const starttime = document.getElementById('starttime').value;;
    const endtime = document.getElementById('endtime').value;
    //const location = document.getElementById('location').value;
    const rmnum = document.getElementById('rmnum').value;
    const color = document.getElementById('color').value;

    console.log(clsname);
    console.log(day);
    console.log(color);

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

    console.log("Success");

});
/*
function addClass(title, priority) {
    currentTasks.push({
        name: 4,
        day: "Deploy site",
        start: false,
        end: "high",
        loc: "dasfoewi",
        room: "sdasd",
        color: ""
    });
    localStorage.setItem("myTasks", JSON.stringify(tasks));
}
*/
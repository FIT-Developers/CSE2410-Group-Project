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
    } else if (!(/^((8|9|10|11)(:[0-5][0-9])?\s?am|(12|[1-7])(:[0-5][0-9])?\s?pm|8(:00)?\s?pm)$/i.test(starttime.trim()))) { // Regex formatting checking if its in the correct format 
        console.warn("Start Time wrong format/range (8:15pm)");
        return;
    }
    // Javascripts built in Date Parser function, found examples and modified
    // Useful for converting these string times to values and comparing which one is later in the day
    const toMs = t => Date.parse(`1/1/2000 ${t.replace(/^(\d{1,2})\s*(am|pm)$/i, "$1:00 $2").replace(/(am|pm)$/i, " $1")}`);
    if (endtime == null || endtime == "") {
        console.warn("End Time is empty");
        return;
    } else if (!(/^((8|9|10|11)(:[0-5][0-9])?\s?am|(12|[1-7])(:[0-5][0-9])?\s?pm|8(:00)?\s?pm)$/i.test(endtime.trim()))) { // Regex formatting checking if its in the correct format 
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

    classes.forEach((cls, index) => {
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
            <div style="font-size: 11px; opacity: 0.9;">${cls.start} - ${cls.end}</div>
            <div style="font-size: 11px; opacity: 0.9;">${cls.loc} • ${cls.room}</div>
            <div style="position: absolute; bottom: 1px; left: 3px;" class="trash-btn" data-index="${index}" id="trash"><img src="./assets/icons/menu-icons/trash.svg" alt="" style="width: 14px;"></div>
        `;

        col.appendChild(clsBlock);
    });
}
// On page load
renderClasses()

document.getElementById('scheduleArea').addEventListener('click', (e) => {
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
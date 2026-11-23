// ============================================================================================================================================================
// ======================================================Search Algorithm and Arrays===========================================================================
// ============================================================================================================================================================
/* Top 4 Recent Marker Array */
// This function gets called when clicking a marker inside Marker popup function which it passes that data
// This data is stored to recreate it in the Search Bar Dropdown
function recordMarkerClick(titleData, typeData, color, icon, miles, minutes, id) {
    // Make an object to store
    const markerObject = {
    id,
    title: titleData,
    type: typeData,
    color,
    icon,
    miles,
    minutes,
    };

    // Remove the existing item if already present (prevents duplicates and promotes to top) as top is most recent
    recentMarkers = recentMarkers.filter(item => item.id !== id);

    // Push to the front of the array (most recent at index 0)
    recentMarkers.unshift(markerObject);

    if (recentMarkers.length > 4) {
        recentMarkers.pop();
    }

    console.log("Recent marker list: " + recentMarkers);
}


document.getElementById('search-bar').addEventListener('click', (e) => {

    document.getElementById('search-popup').classList.add('open');
    document.getElementById('search-bar').classList.add('show');
    renderRecents()

    // If marker popup is open, then remove it and any active markers and remove route
    if (document.getElementById('marker-popup').classList.contains('open')) {
        document.getElementById('marker-popup').classList.remove('open');
        document.querySelectorAll('.custom-pin').forEach(pin => {
            pin.classList.remove('active-pin');
        });
        if (routeLine) {
            map.removeLayer(routeLine);
            routeLine = null;
        }
    }
});

document.getElementById('cancel').addEventListener('click', (e) => {

    // If input is empty, function is closing popup
    if (document.querySelector('input').value.trim() === '') {
        document.getElementById('search-popup').classList.remove('open');
        document.getElementById('search-bar').classList.remove('show');
    } else {
        document.getElementById('input').value = "";
    }

});

function renderRecents() {

    if (recentMarkers.length == 0) {
        document.getElementById('r-text').hidden = true;
    }
    else {
        document.getElementById('r-text').hidden = false;
    }

    document.querySelectorAll('.recents').forEach(el => el.remove());

    recentMarkers.forEach(markers => {
        const container = document.querySelector('.recent-container');
        const rBlock = document.createElement('div');

        rBlock.className = 'recents';

            rBlock.innerHTML = `
                <div class="icon-container" style="background-color: ${markers.color};">
                    <img src="./assets/icons/${markers.icon}" alt="" class="icon" id="icon">
                </div>
                <div class="text">
                    <h1>${markers.title}</h1>
                    <h2>${markers.type} • ${markers.miles} mi • ${markers.minutes} min</h2>
                </div>
            `;
        
        /* To each element add a event listener for clicks */
        rBlock.addEventListener('click', (e) => {
            // Prevents instantly closing it
            e.stopPropagation();
            
            /* Access the global look up table which uses id and gives back everything about the marker */
            const m = markerDataMap[markers.id];
            /* Check if exists then use that lookup table data for calling the popup function */
            if (m) {
                show_Popup(m.marker, m.titleData, m.typeData, m.img1, m.img2, m.web, m.color, m.icon, m.id);
            }
        });

        container.appendChild(rBlock);
    });
}




// ============================================================================================================================================================
// =========================================================Filter Button======================================================================================
// ============================================================================================================================================================
// Local Storage gets also dictionary stuff, to set the value for each day, if nothing grabs defaults to false
// Info about it https://www.w3schools.com/jsref/prop_win_localstorage.asp




// ============================================================================================================================================================
// =========================================================Percent of Crosswalk===============================================================================
// ============================================================================================================================================================
// SetInterval helps with calling a function every certain amt of time
// Info about it https://www.w3schools.com/jsref/met_win_setinterval.asp
let percent = 0;
function startProgress() {
const intervalId = setInterval(() => {
if (percent <= 100) {
    // Update percent by 1/4 of 1%
        percent += .2193;
        document.querySelector('.crosswalk-container').style.setProperty('--progress', percent); // Show progress on the arc
    } else {
        clearInterval(intervalId); // Clear that interval and reset percent
        percent = 0;
        setTimeout(() => { // Used to wait how ever long the crosswalk is
    // Hold before restarting the progress
    }, 35000); // milliseconds so 6 seconds
    }
}, 250);
} // Total time for 100% is 114s -> 1:54

// Start the function/loop
startProgress();

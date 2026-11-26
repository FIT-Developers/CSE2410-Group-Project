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

    localStorage.setItem("recentList", JSON.stringify(recentMarkers));
    console.log("Recent marker list: " + recentMarkers);
}


document.getElementById('search-bar').addEventListener('click', (e) => {

    document.getElementById('search-popup').classList.add('open');
    document.getElementById('search-bar').classList.add('show');

    if (document.querySelector('input').value.trim() === '') {
        renderRecents();
    } else {
        document.getElementById('r-text').hidden = true;
        document.querySelectorAll('.recents').forEach(el => el.remove());

        renderSearch(document.querySelector('input').value.trim());
    }

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

document.getElementById('search-bar').addEventListener('input', function(event) {
    if (document.querySelector('input').value.trim() === '') {
        renderRecents();
    } else {
        document.getElementById('r-text').hidden = true;
        document.querySelectorAll('.recents').forEach(el => el.remove());

        // Start search algorithm and update when typing
        renderSearch(document.querySelector('input').value.trim());
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

// Multi-word prefix search algorithm and renders the searches in div blocks
function renderSearch(prefix) {
    // Standardize it so no issues arrise
    trimmedPrefix = prefix.trim().toLowerCase();

    // If the input is nothing then don't waste algorithm time
    if(trimmedPrefix === "") return;

    // Call the filter function to return a list matching a boolean set in that function
    const results = markerNames.filter(checkSearch); 

    // Function that returns modified list that meets boolean standards
    function checkSearch([, words]) {
        return Array.isArray(words) && words.some(word => word.toLowerCase().startsWith(trimmedPrefix));
    }

    // Grabs the first element in each of the arrays to obtain ID
    // Information obtained from documentation: https://javascript.plainenglish.io/get-the-first-element-of-an-array-in-javascript-488a31cfc940 which gives code examples for this
    let idList = results.map(id => id[0])
    console.log(idList);


    // Copied code from the recents list, slightly modified, works on the same principles
    // But uses just an id which for marker data is grabbed from the mapping list
    document.querySelectorAll('.recents').forEach(el => el.remove());

    // This slice here just truncates anything after 8, so it only grabbed the first 8 in the list to reduce clutter on screen
    idList.slice(0, 8).forEach(id => {
        const container = document.querySelector('.recent-container');
        const Block = document.createElement('div');

        // Need the marker info, so just use the mapping list to obtain that from id stored, used for div styling
        const data = markerDataMap[id];

        // For each result having its routing info given
        let dist = 0;
        let time = 0;

        // Grab that data used for time and distance away (it's only 8 operations max per search so shouldn't be slow)
        if (currentCoords != null && graphData != null) {
            const result = calculateRoute(currentCoords[0], currentCoords[1], data.marker.getLatLng().lat, data.marker.getLatLng().lng, graphData); 
            dist = result.miles;
            time = result.minutes;
        }

        Block.className = 'recents';

            Block.innerHTML = `
                <div class="icon-container" style="background-color: ${data.color};">
                    <img src="./assets/icons/${data.icon}" alt="" class="icon" id="icon">
                </div>
                <div class="text">
                    <h1>${data.titleData}</h1>
                    <h2>${data.typeData} • ${dist} mi • ${time} min</h2>
                </div>
            `;
        
        /* Same code before */
        Block.addEventListener('click', (e) => {
            e.stopPropagation();
            
            const m = markerDataMap[id];
            if (m) {
                show_Popup(m.marker, m.titleData, m.typeData, m.img1, m.img2, m.web, m.color, m.icon, m.id);
            }
        });

        container.appendChild(Block);
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

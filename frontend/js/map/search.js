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

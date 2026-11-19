// ============================================================================================================================================================
// ======================================================Search Algorithm and Arrays===========================================================================
// ============================================================================================================================================================
/* Top 4 Recent Marker Array */
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

    // Remove the existing item if already present (prevents duplicates and promotes to top)
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
const filterStates = {
    M: localStorage.getItem('filter_state_M') === "true",
    Tu: localStorage.getItem('filter_state_Tu') === "true",
    W: localStorage.getItem('filter_state_W') === "true",
    Th: localStorage.getItem('filter_state_Th') === "true",
    F: localStorage.getItem('filter_state_F') === "true"
};
// Adds a dropdown when clicking the filter button, which shows the days of the week
document.addEventListener("DOMContentLoaded", () => {
    // Have variables for the HTML ID's, fetch them
    const filterContainer = document.querySelector(".filter-container");
    const filterBtn = document.getElementById("filterBtn");

    // When btn clicked sets filter container to have .active
    filterBtn.addEventListener("click", (event) => {
        event.stopPropagation(); // Prevents immediate close from bubbling up to document
        filterContainer.classList.toggle("active");
    });

    // If clicking outside contained, then get rid of dropdown/.active
    document.addEventListener("click", (event) => {
        if (!filterContainer.contains(event.target)) {
            filterContainer.classList.remove("active");
        }
    });

    // The list of id's in the html
    const filterDays = ['M', 'Tu', 'W', 'Th', 'F'];
    // Loop through those ids
    filterDays.forEach(dayId => {
        // store the id as a element in a variable
        const dayElement = document.getElementById(dayId);
        
        // If that global list is true for that id then give it the class to change css
        if (filterStates[dayId]) {
            dayElement.classList.add('active-filter');
        }
        // When clicking that element change its global boolean value
        dayElement.addEventListener('click', (event) => {
            event.stopPropagation(); 
            // Simple invert boolean
            filterStates[dayId] = !filterStates[dayId];
            // Toggle the CSS class based on the new boolean value
            dayElement.classList.toggle('active-filter', filterStates[dayId]);
            // Save new boolean to localStorage by using setItem, this is so it can persist on reload
            localStorage.setItem(`filter_state_${dayId}`, filterStates[dayId]);
        });
    });
});
// ============================================================================================================================================================
// ============================================================================================================================================================
// ============================================================================================================================================================

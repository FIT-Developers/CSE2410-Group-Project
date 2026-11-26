// ============================================================================================================================================================
// ===================================================Highlight Current Date, Fetch Buildings From JSON========================================================
// ============================================================================================================================================================

document.addEventListener("DOMContentLoaded", () => {
    // getDay() returns 0 (Sun) to 6 (Sat)
    const today = new Date().getDay(); 

    
    // Dictionary mapping the day number to the HTML IDs
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
// ============================================================================================================================================================
// ============================================================================================================================================================
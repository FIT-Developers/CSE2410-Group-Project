// ============================================================================================================================================================
// ===============================================================Fetch JSON Data==============================================================================
// ============================================================================================================================================================
// ==> Documentation on markers for future reference: https://leafletjs.com/reference.html#marker
// Grabbed online for how to parse and obtain .json data as this is new to me
// Grabs .json data then for each instance creates a marker with its color, icon, tooltip and coords added to it
// Error catching added

let allLocations = []; // Global variable to store/pass all markers at once to a function
fetch('./data/markers.json')
    .then(response => response.json())
    .then(locations => {
    locations.forEach(loc => {
        allLocations = locations;

        // Creates custom marker with icon and color data
        const marker = L.marker([loc.lat, loc.lng], { icon: createCustomPin(loc.color, loc.icon) }).addTo(map);

        // Uses the new marker pop function and simply passes each unique marker data to function to change out html elements
        marker_Popup(marker, loc.tooltip, loc.type, loc.img1, loc.img2, loc.web, loc.color, loc.icon, loc.id);
    });
})
.catch(error => console.error('Error loading markers:', error));


fetch('./data/graph.json')
    .then(response => response.json())
    .then(data => {
        graphData = data;
    })
    .catch(error => console.error('Error loading graph data:', error));



// ============================================================================================================================================================
// ===============================================================Weather API==================================================================================
// ============================================================================================================================================================

async function getWeatherCode(lat, lon) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,weather_code`;
    
    try {

        const response = await fetch(url);

        const data = await response.json();

        const weatherCodes = data.hourly.weather_code;
        const times = data.hourly.time;

        // Find the index of the hour closest to the current time
        // Grabbed from documentation to parse the list of hourly weather codes and find the one current one
        const nowISO = new Date().toISOString().slice(0, 13) + ":00"; // Formats to "YYYY-MM-DDTHH:00"
        const currentIndex = times.findIndex(t => t.startsWith(nowISO));
        const targetIndex = currentIndex !== -1 ? currentIndex : 0;

        const currentWeatherCode = weatherCodes[targetIndex];

        console.log(`weatherCode is ${currentWeatherCode}`)

        changeWeatherIcon(currentWeatherCode)
    }
    catch(error) {
        console.warn("Weather Error " + error);
    };
    
}
function changeWeatherIcon(code) {
    const mapping = {
        0: "Sunny.svg",
        1: "Sunny.svg",
        2: "Cloudy.svg",
        3: "Cloudy.svg",
        45: "Foggy.svg",
        48: "Foggy.svg",
        51: "Heavy_Rain.svg",
        53: "Heavy_Rain.svg",
        55: "Heavy_Rain.svg",
        56: "Heavy_Rain.svg",
        57: "Heavy_Rain.svg",
        61: "Heavy_Rain.svg",
        63: "Heavy_Rain.svg",
        65: "Heavy_Rain.svg",
        66: "Heavy_Rain.svg",
        67: "Heavy_Rain.svg",
        95: "Thunder.svg",
        97: "Thunder.svg",
    }

    const weatherElement = document.getElementById("weather-icon");
    weatherElement.src = `./assets/icons/weather/${mapping[code]}`;
}
// ============================================================================================================================================================
// ============================================================================================================================================================
// ============================================================================================================================================================
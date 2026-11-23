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

// Info on how the fetch works: https://www.w3schools.com/js/js_api_fetch.asp
// Basic fetching off the graph, where it grabbed that json file and all its data, and stored that data in the global variable graphData (used for routing)
fetch('./data/graph.json')
    .then(response => response.json())
    .then(data => {
        graphData = data;
    })
    .catch(error => console.error('Error loading graph data:', error)); // Error handling 



// ============================================================================================================================================================
// ===============================================================Weather API==================================================================================
// ============================================================================================================================================================

// Using the documentation from https://open-meteo.com/en/docs (which was poorly designed)
async function getWeatherCode(lat, lon) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code`; // Weather_code needs to be here to obtain
    // You grab that api fetch url

    try { // Try and catches were needed (most likely for fetch errors)

        // Basic way to get info
        const response = await fetch(url);

        // Another required piece from the documentation
        const data = await response.json();

        // From that data, its a JSON with a good amount of information, and holds format data, which we want the one updating hourly, then inside that grab info
        // Changed to now give the current weather code, so no need for any time, targetIndex checks
        const weatherCode = data.current.weather_code; // Weather code is summary of the weather, where it gives a code that can mean rainy or sunny

        console.log(`weatherCode is ${weatherCode}`)

        // Calls this function which maps that int weatherCode to an icon that represents it
        // Weather code dictionary is at the bottom: https://open-meteo.com/en/docs?hourly=temperature_2m,weather_code
        changeWeatherIcon(weatherCode)
    }
    catch(error) {
        console.warn("Weather Error " + error);
    };
    
}
function changeWeatherIcon(code) { // Int mapping to correct icon
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
    // Then obtain the weather icon element and replace its src, with a new file path to the new icon
    const weatherElement = document.getElementById("weather-icon");
    weatherElement.src = `./assets/icons/weather/${mapping[code]}`;
}
// ============================================================================================================================================================
// ============================================================================================================================================================
// ============================================================================================================================================================
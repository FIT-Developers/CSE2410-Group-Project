// !====> Git Notes <====!
/*
git checkout Prototype
git pull origin Prototype

git checkout -b feature/scheduling-page     {{feature/<page-name>  feature/<component> backend/<service> fix/<bug-name>}}
{git push -u origin feature/user-login}

git add *
git commit -m "Add"
git push origin Prototype
*/
// ==> Run Live Server for Mobile Testing: ngrok http 5500


// ============================================================================================================================================================
// ==================================================Variables, Bounds, Coordinates, Areas, Polygons===========================================================
// ============================================================================================================================================================
// ==> Polygon covering the whole world, needed for inversion polygon
var worldPolygon = [
    [360, -180],
    [360, 180],
    [-360, 180],
    [-360, -180]
];

// ==> Complex Polygon that covers important parts of campus (This polygon was created from a polygon drawing website on maps)
var campusPolygon = [[28.070417, -80.625449], [28.070417, -80.624848], [28.069707, -80.624848], [28.069707, -80.621120], [28.068711, -80.621120], [28.068711, -80.619682], [28.064138, -80.619682], [28.064138, -80.619167], [28.062510, -80.619167], [28.062510, -80.621248], [28.059944, -80.621248], [28.059944, -80.620036], [28.058760, -80.620036], [28.058760, -80.621281], [28.057908, -80.621281], [28.057908, -80.625545], [28.063834, -80.625545], [28.063834, -80.626066], [28.064378, -80.626066], [28.064378, -80.625449], [28.070417, -80.625449]];
//used for routing to make sure user can't route off campus
const campusBounds = L.latLngBounds(campusPolygon);

// ==> Creating a inverted polygon where its a polygon of the world besides the campus
var invertedPolygon = [worldPolygon, campusPolygon];

// Create global variables to fix multiple markers being placed with reload
let currentCoords = null; 
let userMarker = null;
let accuracyCircle = null;


// ==> Setting up the bounds of the campus
var corner1 = L.latLng(28.078443910089728, -80.63768835876286),
corner2 = L.latLng(28.052555774594666, -80.60473406535691),
bounds = L.latLngBounds(corner1, corner2);
// ============================================================================================================================================================
// ============================================================================================================================================================
// ============================================================================================================================================================



// ============================================================================================================================================================
// ==================================================MAP OBJECT, BASEMAPS/VIEW LAYERS, VISUAL BOUNDS===========================================================
// ============================================================================================================================================================
// ==> Adding the map itself, this holds the boundaries, how elastic the snap back to the boundaries are, and zooms allowed
// MaxBounds is set the variable bounds which is from two corners that hold lat and long
// maxBoundsViscosity is how elastic it feels when going out, (0 is smooth, 1 is like a hard wall, the rest is bounce back)
var map = L.map('map', {
    MaxBounds: bounds,
    maxBoundsViscosity: 1.0,
    minZoom: 16,
    maxZoom: 22,
    zoomControl: false,
    attributionControl: false,

    tileSize: 256,

    inertia: false, // Stops the flicking, going out of bounds
    
    // Smoothness:
    crossOrigin: true
}).setView([28.063810, -80.623834], 18);


// ==> A fix for getting the bounds to actually limit the user's drag
// States when dragging make sure its inside of the bounds set earlier
// Animate messes stuff up so keep it false
map.on('drag', function() {
    map.panInsideBounds(bounds, { animate: false });
});


// Searched and found a random url that works for leaflet and its in satellite view, might scrap carto roadmap view
var satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
    subdomains: 'abcd',
    maxNativeZoom: 20,
    maxZoom: 22,

    keepBuffer: 12,                 
    updateWhenIdle: false,          // Loads tiles immediately during panning/zooming, not after stopping
    updateWhenZooming: true,        // Keeps rendering tiles while zoom animations play
}).addTo(map);


// ==> customRenderer is a fix to zooming and dragging having grey areas load in after
// This allows a pre render of the grey far outside the visible screen
const customRenderer = L.svg({ padding: 1.0 });
L.polygon(invertedPolygon, {
    renderer: customRenderer,
    color: 'transparent',
    fillColor: 'black',
    fillOpacity: 0.6,
    className: "campus_mask"
}).addTo(map);
// ============================================================================================================================================================
// ============================================================================================================================================================
// ============================================================================================================================================================



// ============================================================================================================================================================
// ========================================MARKERS, TOOLTIPS, POPUPS AND CUSTOM MARKER FUNCTION================================================================
// ============================================================================================================================================================
// ==> Returns a divIcon class that uses the variable that contains the html (svg icon stuff), which can then be read by L.marker creation in its icon: (properties)
// Adds icons from assets aswell, sourced from: https://www.svgrepo.com/collection/dazzle-line-icons/7?search=book
function createCustomPin(bgColor, iconName) {
    var Pin = `
        <!-- Basic svg setup, xmlns sets up standard rules, viewbox is the canvas created as min-x, min-y, width, height, then renders at physical size by width and height-->
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 120" width="30" height="38">

            <!-- Custom Svg Path of a teardrop, drawn with https://yqnn.github.io/svg-path-editor/ -->
            <path d="M 50 10 A 38 38 0 0 1 88 48 C 88 68 65 90 50 94 C 35 90 12 68 12 48 A 38 38 0 0 1 50 10 Z" 
                    fill="#FFFFFF" />
                
            <!-- Create a inner circle of the arguement color -->
            <circle cx="50" cy="48" r="32" fill="${bgColor}" />
            
            <!-- Create a basic svg img and have its colors and brightness set so its all white -->
            <image href="./assets/icons/${iconName}" x="26" y="26" width="48" height="48" style="filter: brightness(0) invert(1);" />
            

        </svg>
    `;

    // ==> Creates a divIcon from leaflet documentation, this includes the htmk/svg icon stuff, icon size, where the origin point of icon is
    // Also className is literally the class name for when operating css, so use .custom-pin for changing the CSS of these pins
    // Documentation on this: https://leafletjs.com/reference.html#icon
    return L.divIcon({
        className: 'custom-pin',
        html: Pin,
        iconSize: [30, 38],
        iconAnchor: [15, 28]
    });
}

// ==> Documentation on markers for future reference: https://leafletjs.com/reference.html#marker
// Grabbed online for how to parse and obtain .json data as this is new to me
// Grabs .json data then for each instance creates a marker with its color, icon, tooltip and coords added to it
// Error catching added
fetch('./data/markers.json')
    .then(response => response.json())
    .then(locations => {
    locations.forEach(loc => {

        // Creates custom marker with icon and color data
        const marker = L.marker([loc.lat, loc.lng], { icon: createCustomPin(loc.color, loc.icon) }).addTo(map);

        // Uses the new marker pop function and simply passes each unique marker data to function to change out html elements
        marker_Popup(marker, loc.tooltip, loc.type, loc.img1, loc.img2, loc.web, loc.color, loc.icon, loc.id);
        
    });
})
.catch(error => console.error('Error loading markers:', error));






// ==> Function to add marker popup with each marker data from json
let selectedBuilding = null;

let routeLine = null;
let markerWebsite = null;

let recentMarkers = [];

// Grab the json graph data with nodes, edges and adjancey list
// => Done similarly for markers.json using the same documentation
let graphData = null;

fetch('./data/graph.json')
    .then(response => response.json())
    .then(data => {
        graphData = data;
    })
    .catch(error => console.error('Error loading graph data:', error));
    

function marker_Popup(marker, titleData, typeData, img1, img2, web, color, icon, id) {
    marker.on('click', (e) => {
        
        // Prevent map click event from immediately closing the sheet
        // Documentation on this: https://leafletjs.com/reference.html#domevent-stoppropagation
        L.DomEvent.stopPropagation(e);

        // Removes all the active markers class 
        document.querySelectorAll('.custom-pin').forEach(pin => {
            pin.classList.remove('active-pin');
        });
        // Enlarge active marker, similar to google maps
        marker.getElement().classList.add('active-pin');

        selectedBuilding = marker.getLatLng();
        markerWebsite = web

        // Grabs the html id, and replaces the content in it with unique marker data
        document.getElementById('MarkerName').textContent = titleData;
        document.getElementById('TypeName').textContent = typeData;

        document.getElementById('img-1').src = img1;
        document.getElementById('img-2').src = img2;


        // Do routing to find distance and time and draw a polyline on the map
        if (currentCoords != null && graphData != null) {
                const result = calculateRoute(currentCoords[0], currentCoords[1], marker.getLatLng().lat, marker.getLatLng().lng, graphData); 
                document.getElementById('Distance').textContent = result.miles + " mi";
                document.getElementById('TimeAway').textContent = result.minutes + " min";

                recordMarkerClick(titleData, typeData, color, icon, result.miles, result.minutes, id);

                // Clear the old route line before drawing a new one
                if (routeLine) {
                    map.removeLayer(routeLine);
                }

                // Check if length is real and then draw the new path
                if (result.path && result.path.length > 0) {
                    // Info for polyline can be found: https://leafletjs.com/reference.html#polyline
                    // result.path is a list of [lat, long]
                    routeLine = L.polyline(result.path, {
                        color: '#B65050',
                        weight: 6,
                        opacity: 0.9
                    }).addTo(map);
                }
        // If json data fails / Graphdata and if currentCoords / player location is off then don't calculate routes
        } else {
            document.getElementById('Distance').textContent = "? mi";
            document.getElementById('TimeAway').textContent = "? min";
        }
        
        // Adds the open class to the html marker popup, allowing it to slide up and be visible
        document.getElementById('marker-popup').classList.add('open');

        // Used to keep the marker centered higher, Math.pow counteracts the zooming issue
        const offset = (.0008 / Math.pow(2, map.getZoom() - 18));
        // Make user go to that marker they clicked, only goto, keep the same zoom
        map.setView([marker.getLatLng().lat - offset, marker.getLatLng().lng], map.getZoom(), {
            animate: true,
            pan: { duration: 0.5 }
        });
    });

}





// Little code that makes the X icon work, so when clicked removes class of marker popup therefore closing it
document.querySelector('#close').addEventListener('click', function() {
    document.getElementById('marker-popup').classList.remove('open');
    // Removes the active markers class when exiting popup
    document.querySelectorAll('.custom-pin').forEach(pin => {
        pin.classList.remove('active-pin');
    });

    // If there is a polyline, remove that line and set that bool off
    // Gets rid of the route when popup drops
    if (routeLine) {
        map.removeLayer(routeLine);
        routeLine = null;
    }
});

// Website button now redirects to website in json
document.querySelector('#website').addEventListener('click', function(){
    window.open(markerWebsite, '_blank');
})

// When direction button is pressed start nav -Robert (backend)
let navigating = false;
document.querySelector('#directions').addEventListener('click', async function(event) {
    event.preventDefault();
    // Kills nav if button pressed again and removes route line
    if (navigating) {
        navigating = false;

        if (routeLine) {
            map.removeLayer(routeLine);
            routeLine = null;
        }

        return;
    }
    navigating = true;
    lastRouteUpdate = Date.now();
    await updateRoute();
});

// Any clicks outside on map, slide the popup down and is no longer visible
map.on('click', () => {
    document.getElementById('marker-popup').classList.remove('open');
    // Removes the active markers class when exiting popup
    document.querySelectorAll('.custom-pin').forEach(pin => {
        pin.classList.remove('active-pin');
    });

    // If there is a polyline, remove that line and set that bool off
    // Gets rid of the route when popup drops
    if (routeLine) {
        map.removeLayer(routeLine);
        routeLine = null;
    }
    
}); 

// This prevents clicks on the actually popup to slide it down
document.getElementById('marker-popup').addEventListener('click', (e) => {
    e.stopPropagation();
});





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

    console.log(recentMarkers);
}












// ============================================================================================================================================================
// ============================================================================================================================================================
// ============================================================================================================================================================


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



// ============================================================================================================================================================
// ======================================================LIVE USER GPS, With User Marker=======================================================================
// ============================================================================================================================================================
function updateData() {
    console.log("Function executed at:", new Date().toLocaleTimeString());
  // Your update logic here
}
const intervalId = setInterval(updateData, 3600000);

// ==> Grabs correct coords and location of a user (Followed by https://www.youtube.com/watch?v=4D6nJd_ORX4)
// Watches the users position and updates it accurately and connects to better signals if possible for better accuracy *watchPosition()
if (navigator.geolocation) {
    const watchId = navigator.geolocation.watchPosition(successLocation, errorLocation, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
    });
}

function successLocation(position) {
    // Storing and grabbing cords
    const {latitude, longitude, accuracy} = position.coords;


    // Store code for outside function use
    currentCoords = [latitude, longitude];

    if (currentCoords != null) {
        getWeatherCode(currentCoords[0], currentCoords[1]);
        setInterval(getWeatherCode(currentCoords[0], currentCoords[1]), 3600000);
    }

    // Deletes Markers if there already present, to have room to create new ones
    if (userMarker) {
        map.removeLayer(userMarker);
    }
    if (accuracyCircle) {
        map.removeLayer(accuracyCircle);
    }

    // Specific User Marker
    var GPS_Pin = `
        <!-- Basic svg setup, xmlns sets up standard rules, viewbox is the canvas created as min-x, min-y, width, height, then renders at physical size by width and height-->
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="30" height="30">

            <!-- Custom Svg Path of a teardrop, drawn with https://yqnn.github.io/svg-path-editor/ -->
            <circle cx="50" cy="50" r="38" fill="#FFFFFF" />
                
            <!-- Create a inner circle of the arguement color -->
            <circle cx="50" cy="50" r="32" fill="#B65050" />
        </svg>
    `;

    var User = L.divIcon({
        className: 'user-pin',
        html: GPS_Pin,
        iconSize: [40, 40],
        iconAnchor: [20, 20]
    });


    userMarker = L.marker([latitude, longitude], { icon: User}).addTo(map)

    // Blue Accuracy Circle
    accuracyCircle = L.circle([latitude, longitude], {
        radius: accuracy,
        fillOpacity: .2,
        color: '#B65050'
    }).addTo(map);
    if (navigating && Date.now() - lastRouteUpdate >= 5000) {
        lastRouteUpdate = Date.now();
        updateRoute();
    }
}
function errorLocation(error) {
    console.error(error);
    alert("Location access failed. Loading default view")
}
document.querySelector('.active-location-btn').addEventListener('click', function() {
    if (currentCoords) {
        map.setView(currentCoords, map.getZoom(), {
            animate: true,
            pan: {
                duration: 0.5,
                easeLinearity: 0.5
            }
        });
    // Goes down in zoom when over user
    map.once('moveend', function() {
        map.flyTo(currentCoords, 19, {
            animate: true,
            duration: 0.5
        });
    });
    } else {
        console.log("Location doesn't exist or permission denied.");
}
});
// ============================================================================================================================================================
// ============================================================================================================================================================
// ============================================================================================================================================================



// ============================================================================================================================================================
// ===============================================================Backend Stuff================================================================================
// ============================================================================================================================================================
// ==> Draws the route gotten from backend on screen every 5 seconds
// Uses fetch request to backend
let routeInProgress = false;
let lastRouteUpdate = 0;
async function updateRoute() {
    
    if(!userMarker || !selectedBuilding || routeInProgress || !campusBounds.contains(userMarker.getLatLng())) return;

    routeInProgress = true;

    try {
        const position = userMarker.getLatLng();
        const response = await fetch('/api/route', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                start: {
                    lat: position.lat,
                    lng: position.lng
                },
                destination: {
                    lat: selectedBuilding.lat,
                    lng: selectedBuilding.lng
                }
            })
        });

        if (!response.ok) {
            throw new Error(`Route request failed (${response.status})`);
        }

        const data = await response.json();


        if (routeLine) {
            map.removeLayer(routeLine);
        }

        routeLine = L.polyline(data.path, {
            color: '#0078ff',
            weight: 5
        }).addTo(map);

        document.getElementById('marker-popup').classList.remove('open');

        map.fitBounds(routeLine.getBounds(), {
            padding: [30, 30]
        });
    } catch (error) {
        console.error(error);
        
    } finally{
        routeInProgress = false
    }

}

// ============================================================================================================================================================
// ============================================================================================================================================================
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
// ==============================================Routing Engine (Dijistraks on Graph)==========================================================================
// ============================================================================================================================================================
// Optimized and Short Path Finding Code grabbed from the internet, can't remember where, as I didn't document it but modified to fit for my nodes and edges
const S = 1.4;
const dist = (y1, x1, y2, x2) => Math.hypot(y1 - y2, x1 - x2) * 111139;

const findNode = (y, x, N) => {
    let m = 1/0, id = null;
    for (let i in N) {
        let d = dist(y, x, N[i].lat, N[i].lng);
        if (d < m) { m = d; id = i; }
    }
    return { i: id, d: m, t: m / S };
};

const findEdge = (y, x, N, E) => {
    let m = 1/0, id = null;
    for (let i in N) {
        let d = dist(y, x, N[i].lat, N[i].lng);
        if (d < m) { m = d; id = i; }
    }
    for (let k in E) {
        let u = N[E[k].u], v = N[E[k].v];
        if (!u || !v) continue;
        let my = (u.lat + v.lat) / 2, mx = (u.lng + v.lng) / 2;
        let dM = dist(y, x, my, mx);
        if (dM < m) {
            let du = dist(my, mx, u.lat, u.lng), dv = dist(my, mx, v.lat, v.lng);
            m = dM + Math.min(du, dv);
            id = du < dv ? u.id : v.id;
        }
    }
    return { i: id, d: m, t: m / S };
};

function calculateRoute(userLat, userLng, markerLat, markerLng, graphData) {
    let G = typeof graphData === 'string' ? JSON.parse(graphData) : graphData;
    let N = {};
    G.nodes.forEach(node => { N[node.id] = node; });
    
    let E = G.edges, A = G.adjacencyList;

    let u = findEdge(userLat, userLng, N, E), m = findNode(markerLat, markerLng, N);
    if (!u.i || !m.i) return { miles: 0, minutes: 0, path: [] };
    
    let t = {}, d = {}, prev = {}, U = new Set(Object.keys(A));
    for (let n of U) { t[n] = 1/0; d[n] = 1/0; prev[n] = null; }
    t[u.i] = 0; d[u.i] = 0;

    while (U.size > 0) {
        let c = null;
        for (let n of U) if (c === null || t[n] < t[c]) c = n;
        if (t[c] === 1/0 || c === m.i) break;
        U.delete(c);
        
        for (let nb of (A[c] || [])) {
            if (!U.has(nb.node)) continue;
            let alt = t[c] + nb.weight;
            if (alt < t[nb.node]) {
                t[nb.node] = alt;
                d[nb.node] = d[c] + nb.distance;
                prev[nb.node] = c; // Track the previous node for the path
            }
        }
    }
    
    // Debugging
    if (t[m.i] === 1/0) {
    console.warn("No path found! Start node:", u.i, "End node:", m.i);
    return { miles: 0, minutes: 0, path: [] };
    }

    // Reconstruct the physical path coordinates
    let pathCoords = [];
    let curr = m.i;
    while (curr !== null) {
        pathCoords.push([N[curr].lat, N[curr].lng]);
        curr = prev[curr];
    }
    pathCoords.reverse(); // Flip it so it goes from Start -> End
    
    // Connect the user's exact location to the start of the node path
    pathCoords.unshift([userLat, userLng]);

    return {
        miles: +((u.d + d[m.i] + m.d) / 1609.34).toFixed(1),
        minutes: +((u.t + t[m.i] + m.t) / 60).toFixed(1),
        path: pathCoords
    };
}
// ============================================================================================================================================================
// ============================================================================================================================================================
// ============================================================================================================================================================
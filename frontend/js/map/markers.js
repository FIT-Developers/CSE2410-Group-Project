// ============================================================================================================================================================
// ========================================MARKER POPUPS, POPUP BTNS AND CUSTOM MARKER FUNCTION================================================================
// ============================================================================================================================================================
// ==> Returns a divIcon class that uses the variable that contains the html (svg icon stuff), which can then be read by L.marker creation in its icon: (properties)
// Adds icons from assets aswell, sourced from: https://www.svgrepo.com/collection/dazzle-line-icons/7?search=book
function createCustomPin(bgColor, iconName, id) {
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
        id: `${id}`,
        html: Pin,
        iconSize: [30, 38],
        iconAnchor: [15, 28]
    });
}


const markerDataMap = {};

function marker_Popup(marker, titleData, typeData, img1, img2, web, color, icon, id) {

    /* Lookup table, so outside functions just need id, to get all the information for a popup */
    markerDataMap[id] = { marker, titleData, typeData, img1, img2, web, color, icon, id };

    // Find all pills and loop through each one finding a click
    document.querySelectorAll('.pill').forEach((pill) => {
        pill.addEventListener('click', () => {  
            // Remove all active markers before
            marker.getElement().classList.remove('active-pin');

            // Get what type was clicked
            const heading = (pill.querySelector('h1')).textContent;

            if (typeData == heading) {
                marker.getElement().classList.add('active-pin');
            }
            
                    // Zooms out smoothly
            map.setZoom(16, { animate: true });

        });
    });

    marker.on('click', (e) => {
        // Prevent map click event from immediately closing the sheet
        // Documentation on this: https://leafletjs.com/reference.html#domevent-stoppropagation
        L.DomEvent.stopPropagation(e);

        show_Popup(marker, titleData, typeData, img1, img2, web, color, icon, id);
    });

}



function show_Popup(marker, titleData, typeData, img1, img2, web, color, icon, id) {

        // Removes all the active markers class 
        document.querySelectorAll('.custom-pin').forEach(pin => {
            pin.classList.remove('active-pin');
        });

        // Enlarge active marker, similar to google maps
        marker.getElement().classList.add('active-pin');

        // Store website url, used for when clicking the btn
        markerWebsite = web

        // If search bar is open, then remove it, clicking on marker, but check first
        if (document.getElementById('search-popup').classList.contains('open')) {
            document.getElementById('search-popup').classList.remove('open');
            document.getElementById('search-bar').classList.remove('show');
        }
        // Grabs the html id, and replaces the content in it with unique marker data
        document.getElementById('MarkerName').textContent = titleData;
        document.getElementById('TypeName').textContent = typeData;

        document.getElementById('img-1').src = img1;
        document.getElementById('img-2').src = img2;

        // Checks
        console.log("Marker data obtained successfully at: " + marker.getLatLng());

        // Do routing to find distance and time and draw a polyline on the map
        if (currentCoords != null && graphData != null) {
                // Routing function that returns a path, miles and minutes
                const result = calculateRoute(currentCoords[0], currentCoords[1], marker.getLatLng().lat, marker.getLatLng().lng, graphData); 
                // Replace elements with accurate routing info
                document.getElementById('Distance').textContent = result.miles + " mi";
                document.getElementById('TimeAway').textContent = result.minutes + " min";

                // Record the marker being clicked, inside here because we want miles and minutes already calculated so its easier for Search Bar recents
                recordMarkerClick(titleData, typeData, color, icon, result.miles, result.minutes, id);

                // Clear the old route line before drawing a new one
                if (routeLine) {
                    map.removeLayer(routeLine);
                }

                // Check if length is real and then draw the new path
                if (result.path && result.path.length > 0) {
                    // Info for polyline can be found: https://leafletjs.com/reference.html#polyline
                    // result.path is a list of [lat, long]

                    console.log("Successfully obtained fastest route from user to marker with " + result.path.length + " nodes.");

                    // Draw the polyline following the outputted path data
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
    // Need Code
});

// Any clicks outside on map, slide the popup down and is no longer visible
map.on('click', () => {
    document.getElementById('marker-popup').classList.remove('open');

    document.getElementById('search-popup').classList.remove('open');
    document.getElementById('search-bar').classList.remove('show');
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
document.getElementById('marker-popup').addEventListener('focus', (e) => {
    e.stopPropagation();
});

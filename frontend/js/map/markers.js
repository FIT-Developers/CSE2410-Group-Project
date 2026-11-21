// ============================================================================================================================================================
// ========================================MARKER POPUPS, POPUP BTNS AND CUSTOM MARKER FUNCTION================================================================
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


let parkingPolygon = null; 

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

        console.log("Marker data obtained successfully at: " + marker.getLatLng());

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


        // This is to check and see if a marker has "parking" in it's name, if it does
        // then search for it's polygon definition in the "parking-borders.json"
        let parkingString = "parking";  
        if (id.toLowerCase().includes(parkingString)) {
            fetch('./data/parking-borders.json')
            .then(response => response.json())
            .then(items => {
                items.definitions.forEach(def => {
                    if (def.id == id) {
                        let coordinates = def.coordinates; 
                        parkingPolygon = L.polygon(coordinates, {
                            color : 'red', 
                            weight : 3, 
                            fillColor : 'red',
                            fillOpacity : 0.5
                        }).addTo(map); 
                    }
                });
            })
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

    // If there is a parking polygon outline, remove it and set it back to null
    if (parkingPolygon) {
    map.removeLayer(parkingPolygon); 
    parkingPolygon = null; 
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

    // If there is a parking polygon outline, remove it and set it back to null
    if (parkingPolygon) {
    map.removeLayer(parkingPolygon); 
    parkingPolygon = null; 
    }
    
}); 

// This prevents clicks on the actually popup to slide it down
document.getElementById('marker-popup').addEventListener('click', (e) => {
    e.stopPropagation();
});

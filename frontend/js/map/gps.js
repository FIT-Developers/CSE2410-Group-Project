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

    showClassRoutes(allLocations);

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
    // Notify the location is working
    console.log("Location obtained successfully at: " + latitude + ", " + longitude);

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


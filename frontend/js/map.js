// !====> Git Notes <====!
/*
git checkout Prototype
git pull origin Prototype

git checkout -b feature/scheduling-page     {{feature/<page-name>  feature/<component> backend/<service> fix/<bug-name>}}

git add *
git commit -m "Add responsive grid layout for calendar scheduling page"
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

// ==> Creating a inverted polygon where its a polygon of the world besides the campus
var invertedPolygon = [worldPolygon, campusPolygon];


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
    minZoom: 17,
    maxZoom: 22
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
    maxZoom: 22
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
var Evans_Library = L.marker([28.065824,-80.622820], { icon: createCustomPin('#6B8E9B','book.svg') }).addTo(map)
Evans_Library.bindTooltip("John H. Evans Library"); // Basic Tooltip creation on the marker

var Skurla_Hall = L.marker([28.064435,-80.624572], { icon: createCustomPin('#c5a336','grad_cap.svg') }).addTo(map)
Skurla_Hall.bindTooltip("George M. Skurla Hall");

var Roberts_Hall = L.marker([28.06933296623996, -80.62454490022863], { icon: createCustomPin('#4cdd9e','house.svg') }).addTo(map)
Roberts_Hall.bindTooltip("Roberts Hall");

var Tennis_Courts = L.marker([28.06827840908719, -80.62448146598793], { icon: createCustomPin('#367b45','tennis.svg') }).addTo(map)
Tennis_Courts.bindTooltip("Tennis & Pickleball Courts");

// ==> Show a highlighted rectangle where the parking area is when hovering over parking, animation and rounding is done by CSS
// More about rectangles and its properties, were found on https://leafletjs.com/reference.html#rectangle
// Later this needs to be turned into a function so multiple parking markers can work (needs marker and bounds parameter)
const area = L.rectangle([[28.069694059142638, -80.6253013744353], 
    [28.06765795584343, -80.62506137512882]], {
    color: '#7ab8ff', fillColor: '#0078FF', fillOpacity: 0.15, weight: 1,
    className: 'parking_7', interactive: false
}).addTo(map);

var Parking_7 = L.marker([28.068709965835726, -80.62516521548011], { icon: createCustomPin('#606069','parking.svg') }).addTo(map)
Parking_7.bindTooltip("Parking Lot 7");
Parking_7.on('mouseover', () => area.getElement()?.classList.add('active')); // Ternary operation to make the code take up less lines
Parking_7.on('mouseout', () => area.getElement()?.classList.remove('active'));


var Brownlie = L.marker([28.067202396374327, -80.62520549743712], { icon: createCustomPin('#4cdd9e','house.svg') }).addTo(map)
Brownlie.bindTooltip("Brownlie Hall");

var Pantherium = L.marker([28.066847506842795, -80.62414693021333], { icon: createCustomPin('#9b53b9','masks.svg') }).addTo(map)
Pantherium.bindTooltip("Pantherium");

var Denius_Center = L.marker([28.066511698330658, -80.62369840781662], { icon: createCustomPin('#c5a336','grad_cap.svg') }).addTo(map)
Denius_Center.bindTooltip("Denius Student Center");

var Bookstore = L.marker([28.066333035434727, -80.62378106888966], { icon: createCustomPin('#7b2f1c','bag.svg') }).addTo(map)
Bookstore.bindTooltip("Florida Tech Bookstore");

var Jerome_Admin = L.marker([28.066422745432106, -80.62446252886568], { icon: createCustomPin('#65abcc','shield.svg') }).addTo(map)
Jerome_Admin.bindTooltip("Jerome P. Keuper Administration Building");

var Dining_Hall = L.marker([28.062367657194457, -80.62272603625505], { icon: createCustomPin('#c0ca85','fork.svg') }).addTo(map)
Dining_Hall.bindTooltip("Panther Dining Hall");

var Pool = L.marker([28.062793914626525, -80.62274722253706], { icon: createCustomPin('#05487f','water.svg') }).addTo(map)
Pool.bindTooltip("Panther Aquatic Center");

var Clemente = L.marker([28.063397060424393, -80.62258844704462], { icon: createCustomPin('#1c1b1b','dumbell.svg') }).addTo(map)
Clemente.bindTooltip("Charles and Ruth Clemente Center for Sports and Recreation");

var Gas = L.marker([28.06369793990833, -80.62177176400293], { icon: createCustomPin('#4b6955','gas.svg') }).addTo(map)
Gas.bindTooltip("Gas Mobil");

var Olin_Eng = L.marker([28.063267280455182, -80.62395276215993], { icon: createCustomPin('#c5a336','grad_cap.svg') }).addTo(map)
Olin_Eng.bindTooltip("F.W. Olin Engineering Complex");

var Olin_Life = L.marker([28.063220878633135, -80.62468584789855], { icon: createCustomPin('#c5a336','grad_cap.svg') }).addTo(map)
Olin_Life.bindTooltip("F.W. Olin Life Sciences Building");

var Olin_Phys = L.marker([28.06245240668176, -80.62390778688403], { icon: createCustomPin('#c5a336','grad_cap.svg') }).addTo(map)
Olin_Phys.bindTooltip("F.W. Olin Physical Sciences Center");
// ============================================================================================================================================================
// ============================================================================================================================================================
// ============================================================================================================================================================



// ============================================================================================================================================================
// ======================================================LIVE USER GPS, With User Marker=======================================================================
// ============================================================================================================================================================
// Create global variables to fix multiple markers being placed with reload
let userMarker = null;
let accuracyCircle = null;
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
    console.log("Accuracy in metres:",accuracy);

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
            <circle cx="50" cy="50" r="32" fill="#00c4ef" />
        </svg>
    `;

    User = L.divIcon({
        className: 'user-pin',
        html: GPS_Pin,
        iconSize: [40, 40],
        iconAnchor: [20, 20]
    });


    userMarker = L.marker([latitude, longitude], { icon: User}).addTo(map)

    // Blue Accuracy Circle
    accuracyCircle = L.circle([latitude, longitude], {
        radius: accuracy,
        fillOpacity: .2
    }).addTo(map);
}
function errorLocation(error) {
    console.error(error);
    alert("Location access failed. Loading default view")
}
// ============================================================================================================================================================
// ============================================================================================================================================================
// ============================================================================================================================================================

// Added custom User Marker with glow, Fixed Bug with SVG's being black for darkmode
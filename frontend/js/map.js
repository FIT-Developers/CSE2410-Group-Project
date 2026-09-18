// !====> Git Notes <====!
/*
git checkout main
git pull origin main

git checkout -b feature/scheduling-page     {{feature/<page-name>  feature/<component> backend/<service> fix/<bug-name>}}

git add *
git commit -m "Add responsive grid layout for calendar scheduling page"
git push origin feature/scheduling-page
*/


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

// ==> Adding the map itself, this holds the boundaries, how elastic the snap back to the boundaries are, and zooms allowed
// MaxBounds is set the variable bounds which is from two corners that hold lat and long
// maxBoundsViscosity is how elastic it feels when going out, (0 is smooth, 1 is like a hard wall, the rest is bounce back)
var map = L.map('map', {
    MaxBounds: bounds,
    maxBoundsViscosity: 1.0,
    minZoom: 16,
    maxZoom: 22
}).setView([28.063810, -80.623834], 18);


// == A fix for getting the bounds to actually limit the user's drag
// States when dragging make sure its inside of the bounds set earlier
// Animate messes stuff up so keep it false
map.on('drag', function() {
    map.panInsideBounds(bounds, { animate: false });
});


// Using Carto for map styles and rendering tiles (uses my API Key for this)
// Style choosen is a detailed vector called voyager with no labels as customs will be implemented
const openStreetMap = L.tileLayer(`https://basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}.png?key=cb1_3q00_1_e26b53eeeb6cdda52535c6ad`, {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxNativeZoom: 20, // This helps zoom in closer, but doesn't render new tiles just scales it
    maxZoom: 22
}).addTo(map);


// ==> customRenderer is a fix to zooming and dragging having grey areas load in after
// This allows a pre render of the grey far outside the visible screen
const customRenderer = L.svg({ padding: 1.0 });
L.polygon(invertedPolygon, {
    renderer: customRenderer,
    color: 'transparent',
    fillColor: 'gray',
    fillOpacity: 0.7
}).addTo(map);



// Returns a divIcon class that uses the variable that contains the html (svg icon stuff), which can then be read by L.marker creation in its icon: (properties)
function createCustomPin(bgColor) {
    var Pin = `
        <!-- Basic svg setup, xmlns sets up standard rules, viewbox is the canvas created as min-x, min-y, width, height, then renders at physical size by width and height-->
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 120" width="30" height="38">

            <!-- Custom Svg Path of a teardrop, drawn with https://yqnn.github.io/svg-path-editor/ -->
            <path d="M 50 10 A 38 38 0 0 1 88 48 C 88 68 65 90 50 94 C 35 90 12 68 12 48 A 38 38 0 0 1 50 10 Z" 
                    fill="#FFFFFF" />
                
            <!-- Create a inner circle of the arguement color -->
            <circle cx="50" cy="48" r="32" fill="${bgColor}" />
            
        </svg>
    `;

    // Creates a divIcon from leaflet documentation, this includes the htmk/svg icon stuff, icon size, where the origin point of icon is
    // Also className is literally the class name for when operating css, so use .custom-pin for changing the CSS of these pins
    // Documentation on this: https://leafletjs.com/reference.html#icon
    return L.divIcon({
        className: 'custom-pin',
        html: Pin,
        iconSize: [30, 38],
        iconAnchor: [15, 28]
    });
}

// Documentation on markers for future reference: https://leafletjs.com/reference.html#marker
var Evans_Library = L.marker([28.065824,-80.622820], { icon: createCustomPin('#6B8E9B') }).addTo(map)
Evans_Library.bindTooltip("John H. Evans Library"); // Basic Tooltip creation on the marker

var Skurla_Hall = L.marker([28.064435,-80.624572], { icon: createCustomPin('#c5a336') }).addTo(map)
Evans_Library.bindTooltip("George M. Skurla Hall");
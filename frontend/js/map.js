// !====> Git Notes <====!
/*
git checkout main
git pull origin main

git checkout -b feature/scheduling-page     {{feature/<page-name>  feature/<component> backend/<service> fix/<bug-name>}}

git add *
git commit -m "Add responsive grid layout for calendar scheduling page"
git push origin feature/scheduling-page
/*


// ==> Polygon covering the whole world, needed for inversion polygon
var worldPolygon = [
  [360, -180],
  [360, 180],
  [-360, 180],
  [-360, -180]
];

// ==> Complex Polygon that covers important parts of campus
var campusPolygon = [[28.070417, -80.625449], [28.070417, -80.624848], [28.069707, -80.624848], [28.069638, -80.62112], [28.068711, -80.621163], [28.068695, -80.619682], [28.064138, -80.6198], [28.064091, -80.619167], [28.06251, -80.619189], [28.062519, -80.621248], [28.059944, -80.621259], [28.059878, -80.620036], [28.05876, -80.620058], [28.058789, -80.621291], [28.057908, -80.621281], [28.057975, -80.625615], [28.063834, -80.625545], [28.063824, -80.626076], [28.064378, -80.626066], [28.064383, -80.625513], [28.070417, -80.625449]];

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


// ==? A fix for getting the bounds to actually limit the user's drag
// States when dragging make sure its inside of the bounds set earlier
// Animate messes stuff up so keep it false
map.on('drag', function() {
    map.panInsideBounds(bounds, { animate: false });
});


// ==> Adds the openStreetMap style for the basis of the map
const openStreetMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap'
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


// ==> Adds a marker at specific coordinates to the map
var marker = L.marker([28.065796, -80.622820]).addTo(map);
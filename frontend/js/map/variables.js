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


// ==> Function to add marker popup with each marker data from json
let selectedBuilding = null;

let routeLine = null;
let markerWebsite = null;

let recentMarkers = [];

// Grab the json graph data with nodes, edges and adjancey list
// => Done similarly for markers.json using the same documentation
let graphData = null;
// ============================================================================================================================================================
// ============================================================================================================================================================
// ============================================================================================================================================================

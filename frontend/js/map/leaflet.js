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

// White lines fix, from leaflets tiles
// Bug is: https://github.com/Leaflet/Leaflet/issues/3575
// Code/Solution was found online via a github: https://gist.github.com/cmulders/acbbe8a8ff170e34c37b
(function() {
    var originalInitTile = L.GridLayer.prototype._initTile;
    L.GridLayer.include({
        _initTile: function(tile) {
            originalInitTile.call(this, tile);
            var tileSize = this.getTileSize();
            tile.style.width = tileSize.x + 0.1 + 'px';
            tile.style.height = tileSize.y + 0.1 + 'px';
        }
    });
})();


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

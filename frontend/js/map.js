// !====> Git Notes <====!
/*
git checkout Prototype
git pull origin Prototype

git checkout -b feature/scheduling-page     {{feature/<page-name>  feature/<component> backend/<service> fix/<bug-name>}}

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
var campusPolygon = [
	[28.070417, -80.625449],
	[28.070417, -80.624848],
	[28.069707, -80.624848],
	[28.069707, -80.621120],
	[28.068711, -80.621120],
	[28.068711, -80.619682],
	[28.064138, -80.619682],
	[28.064138, -80.619167],
	[28.062510, -80.619167],
	[28.062510, -80.621248], 
	[28.059944, -80.621248],
	[28.059944, -80.620036],
	[28.058760, -80.620036],
	[28.058760, -80.621281],
	[28.057908, -80.621281],
	[28.057908, -80.625545],
	[28.063834, -80.625545],
	[28.063834, -80.626066],
	[28.064378, -80.626066],
	[28.064378, -80.625449],
	[28.070417, -80.625449]
];

// ==> Creating a inverted polygon where its a polygon of the world besides the campus
var invertedPolygon = [worldPolygon, campusPolygon];

// ==> Setting up the bounds of the campus
var corner1 = L.latLng(28.078443910089728, -80.63768835876286),
corner2 = L.latLng(28.052555774594666, -80.60473406535691),
bounds = L.latLngBounds(corner1, corner2);


// ============================================================================================================================================================
// ==================================================MAP OBJECT, BASEMAPS/VIEW LAYERS, VISUAL BOUNDS===========================================================
// ============================================================================================================================================================
var map = L.map('map', {
	MaxBounds: bounds,
	maxBoundsViscosity: 1.0,
	minZoom: 16,
	maxZoom: 22,
	zoomControl: false,
	attributionControl: false,
	keepBuffer: 12,                  
	updateWhenIdle: false,           // Loads tiles immediately during panning/zooming, not after stopping
	updateWhenZooming: true,        // Keeps rendering tiles while zoom animations play
	tileSize: 256,
	crossOrigin: true
}).setView([28.063810, -80.623834], 18);

map.on('drag', function() {
	map.panInsideBounds(bounds, { animate: false });
});

var satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
	subdomains: 'abcd',
	maxNativeZoom: 20,
	maxZoom: 22
}).addTo(map);

const customRenderer = L.svg({ padding: 1.0 });
L.polygon(invertedPolygon, {
	renderer: customRenderer,
	color: 'transparent',
	fillColor: 'black',
	fillOpacity: 0.6,
	className: "campus_mask"
}).addTo(map);


// ============================================================================================================================================================
// ========================================MARKERS, TOOLTIPS, POPUPS AND CUSTOM MARKER FUNCTION================================================================
// ============================================================================================================================================================
function createCustomPin(bgColor, iconName) {
	var Pin = `
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 120" width="30" height="38">
			<path d="M 50 10 A 38 38 0 0 1 88 48 C 88 68 65 90 50 94 C 35 90 12 68 12 48 A 38 38 0 0 1 50 10 Z" fill="#FFFFFF" />
			<circle cx="50" cy="48" r="32" fill="${bgColor}" />
			<image href="./assets/icons/${iconName}" x="26" y="26" width="48" height="48" style="filter: brightness(0) invert(1);" />
		</svg>
	`;

	return L.divIcon({
		className: 'custom-pin',
		html: Pin,
		iconSize: [30, 38],
		iconAnchor: [15, 28]
	});
}

const area = L.rectangle([[28.069694059142638, -80.6253013744353], 
	[28.06765795584343, -80.62506137512882]], {
	color: '#7ab8ff', fillColor: '#0078FF', fillOpacity: 0.15, weight: 1,
	className: 'parking_7', interactive: false
}).addTo(map);

function marker_Popup(marker, titleData, typeData, img1, img2) {
	marker.on('click', (e) => {
		L.DomEvent.stopPropagation(e);

		document.getElementById('MarkerName').textContent = titleData;
		document.getElementById('TypeName').textContent = typeData;

		document.getElementById('img-1').src = img1;
		document.getElementById('img-2').src = img2;

		document.getElementById('marker-popup').classList.add('open');
	});
}

document.querySelector('#close').addEventListener('click', function() {
	document.getElementById('marker-popup').classList.remove('open');
});

// Any clicks outside on map, slide the popup down
map.on('click', () => {
	document.getElementById('marker-popup').classList.remove('open');
});
document.getElementById('marker-popup').addEventListener('click', (e) => {
	e.stopPropagation();
});


// ============================================================================================================================================================
// ==================================================MAP CONTROLS: FETCH, SEARCH & CATEGORY FILTERING==========================================================
// ============================================================================================================================================================

// Global array to store marker instances and metadata for filtering/searching
let allMarkers = [];

// Fetch locations from JSON and set up markers & overlay listeners
fetch('./data/markers.json')
  .then(response => response.json())
  .then(locations => {
	locations.forEach(loc => {
	  const marker = L.marker([loc.lat, loc.lng], { icon: createCustomPin(loc.color, loc.icon) }).addTo(map);
	  marker_Popup(marker, loc.tooltip, loc.type, loc.img1, loc.img2);
	  
	  // Store reference to marker instance and its data
	  allMarkers.push({
		  markerInstance: marker,
		  data: loc
	  });
	});

	// Initialize search and filter listeners once markers are ready
	setupCategoryFilters();
	setupLiveSearch();
  })
  .catch(error => console.error('Error loading markers:', error));


// ==> Category Filter Pills Logic
function setupCategoryFilters() {
	const filterButtons = document.querySelectorAll('.filter-btn');

	filterButtons.forEach(button => {
		button.addEventListener('click', () => {
			// Update UI active state on pills
			filterButtons.forEach(btn => btn.classList.remove('active'));
			button.classList.add('active');

			const selectedCategory = button.dataset.category;

			// Filter markers on map by comparing dataset category with loc.type
			allMarkers.forEach(({ markerInstance, data }) => {
				if (selectedCategory === 'all' || data.type === selectedCategory) {
					markerInstance.addTo(map);
				} else {
					markerInstance.remove();
				}
			});
		});
	});
}


// ==> Live Search & Auto-Centering Logic
function setupLiveSearch() {
	const searchInput = document.getElementById('search-input');
	const searchResults = document.getElementById('search-results');

	searchInput.addEventListener('input', (e) => {
		const query = e.target.value.toLowerCase().trim();
		searchResults.innerHTML = '';

		if (!query) {
			searchResults.classList.add('hidden');
			return;
		}

		// Filter locations matching tooltip title or type
		const matches = allMarkers.filter(({ data }) => 
			data.tooltip.toLowerCase().includes(query) || 
			data.type.toLowerCase().includes(query)
		);

		if (matches.length === 0) {
			searchResults.classList.add('hidden');
			return;
		}

		// Populate search dropdown list
		matches.forEach(({ markerInstance, data }) => {
			const li = document.createElement('li');
			li.textContent = data.tooltip;
			
			li.addEventListener('click', () => {
				// Fly camera to location and trigger popup click
				map.flyTo([data.lat, data.lng], 18, { animate: true, duration: 1.2 });
				
				searchResults.classList.add('hidden');
				searchInput.value = '';

				markerInstance.fire('click');
			});

			searchResults.appendChild(li);
		});

		searchResults.classList.remove('hidden');
	});

	// Close search dropdown when clicking outside
	document.addEventListener('click', (e) => {
		if (!e.target.closest('.search-container')) {
			searchResults.classList.add('hidden');
		}
	});
}


// ============================================================================================================================================================
// ======================================================LIVE USER GPS, With User Marker=======================================================================
// ============================================================================================================================================================
let userMarker = null;
let accuracyCircle = null;

if (navigator.geolocation) {
	const watchId = navigator.geolocation.watchPosition(successLocation, errorLocation, {
		enableHighAccuracy: true,
		timeout: 10000,
		maximumAge: 0
	});
}

function successLocation(position) {
	const {latitude, longitude, accuracy} = position.coords;

	if (userMarker) {
		map.removeLayer(userMarker);
	}
	if (accuracyCircle) {
		map.removeLayer(accuracyCircle);
	}

	var GPS_Pin = `
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="30" height="30">
			<circle cx="50" cy="50" r="38" fill="#FFFFFF" />
			<circle cx="50" cy="50" r="32" fill="#B65050" />
		</svg>
	`;

	var User = L.divIcon({
		className: 'user-pin',
		html: GPS_Pin,
		iconSize: [40, 40],
		iconAnchor: [20, 20]
	});

	userMarker = L.marker([latitude, longitude], { icon: User}).addTo(map);

	accuracyCircle = L.circle([latitude, longitude], {
		radius: accuracy,
		fillOpacity: .2,
		color: '#B65050'
	}).addTo(map);
}

function errorLocation(error) {
	console.error(error);
	alert("Location access failed. Loading default view");
}
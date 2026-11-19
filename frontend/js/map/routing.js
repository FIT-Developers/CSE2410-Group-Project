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
        if (d < m) { m = d; id = String(i); }
    }
    return { i: id, d: m, t: m / S };
};

function calculateRoute(userLat, userLng, markerLat, markerLng, graphData) {
    let G = typeof graphData === 'string' ? JSON.parse(graphData) : graphData;
    let N = {};
    G.nodes.forEach(node => { N[node.id] = node; });
    
    let A = G.adjacencyList;

    let u = findNode(userLat, userLng, N), m = findNode(markerLat, markerLng, N);
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
            let nextNode = String(nb.node);
            if (!U.has(nextNode)) continue;
            let alt = t[c] + nb.weight;
            if (alt < t[nextNode]) {
                t[nextNode] = alt;
                d[nextNode] = d[c] + nb.distance;
                prev[nextNode] = c; // Track the previous node for the path
            }
        }
    }
    
    // Debugging, as it informs the start node and end node for problem solving
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
        // Do 70% from the actual calculated time as its too high on average
        minutes: +(((u.t + t[m.i] + m.t) / 60) * 0.70).toFixed(1),
        path: pathCoords
    };
}


// ============================================================================================================================================================
// ===========================================================Class Routing with Dates=========================================================================
// ============================================================================================================================================================
let classRouteLines = [];
function showClassRoutes(locations) {

    if (currentCoords == null && graphData == null || !locations) return; // If no user location or routing failure abort

    const classes = JSON.parse(localStorage.getItem('myClasses')) || [];

    const today = new Date(); 
    const dayMap = {
        1: 'Mon',
        2: 'Tues',
        3: 'Wed',
        4: 'Thurs',
        5: 'Fri'
    };
    const theDay = dayMap[today.getDay()]
    console.log(theDay);
    if (!theDay) return; // Weekends

    const totalMinutes = today.getHours() * 60 + today.getMinutes();

    const todaysClasses = classes.filter(cls => cls.day === theDay); // If the objects variable day has the string of today's date then add to array
    if (todaysClasses.length === 0) return; // If no classes exist, no routes can be drawn so abort

    // Clear the old routes before drawing a new ones
    classRouteLines.forEach(line => map.removeLayer(line));
    classRouteLines = [];

    todaysClasses.forEach(cls => {
        const place = locations.find(loc => loc.tooltip === cls.loc || loc.id === cls.loc);

        const result = calculateRoute(currentCoords[0], currentCoords[1], place.lat, place.lng, graphData);
        
        const difference = Math.abs(totalMinutes - timeToMinutes(cls.start)); // Grab abs difference
        const opacity = Math.min(0.80 ,Math.exp(-0.0057 * difference)); // Exponential decay function to help increase opacity quicker when time is closer
        console.log(difference);

        // Check if length is real and then draw the new path
        if (result.path && result.path.length > 0) {

            const line = L.polyline(result.path, {
                color: cls.color || '#B65050',
                weight: 6,
                opacity: opacity
            }).addTo(map);
            classRouteLines.push(line); // Have that line stored for removal process later
        }

    });
}
// Convert weird time string to total minutes
function timeToMinutes(time) {

    let dayOrNight = time.toLowerCase().slice(-2);
    let theTime = time.trim().toLowerCase().slice(0, -2).trim();

    // Separate by colon for hours and minutes
    // Give back a 0 if no colon exists
    let [front, back = '0'] = theTime.split(':');
    front = parseInt(front, 10); // The 10 means decimal int not octal or hex
    back = parseInt(back, 10);

    // 4. Convert to 24-hour format
    if (dayOrNight === 'pm' && front !== 12) {front += 12;}
    if (theTime === 'am' && front === 12) {front = 0;}

    // Returns the minutes by multiplying the front by 60 and adding the leftover minutes
    return front * 60 + back;
}
// ============================================================================================================================================================
// ============================================================================================================================================================
// ============================================================================================================================================================
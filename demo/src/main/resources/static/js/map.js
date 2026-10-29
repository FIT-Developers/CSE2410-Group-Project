var map = L.map('map').setView([28.063810, -80.623834], 16);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

fetch('/node-data/edge-output.json')
  .then(response => response.json())
  .then(edges => {
    edges.forEach(edge => {
        //const marker = L.marker([edge.node1Coord.lat, edge.node1Coord.lon], {title: edge.node1}).addTo(map);
        //const marker2 = L.marker([edge.node2Coord.lat, edge.node2Coord.lon], {title: edge.node2}).addTo(map);
        var pathcoords = [[edge.node1Coord.lat, edge.node1Coord.lon],
                          [edge.node2Coord.lat, edge.node2Coord.lon] ]; 
        
        var polyline = L.polyline(pathcoords, {color: 'red'}).addTo(map);
    });
  })
  .catch(error => console.error('Error loading markers:', error));

var map = L.map('map').setView([28.063810, -80.623834], 16);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

var marker = L.marker([28.065796, -80.622820]).addTo(map);
let portflows;
function FetchPortFlows(){
    fetch('data/port_flows.geojson')
    .then(response => response.json())
    .then(data => {
        portflows = data;
        console.log(">>> Data fetched:");
        console.log(portflows);

    })
}

let ports;
function FetchPorts(){
    fetch('data/attributed_ports.geojson')
    .then(response => response.json())
    .then(data => {
            ports = data;
            console.log(">>>Ports Fetched:");
            console.log("ports");
            DisplayPorts();
        }
    )
}
var map = L.map('map').setView([0, 0], 2);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

var fromport ;

var linestyle = {
    "weight": 5
}

var portflows_render;
function DisplayPortFlows(fromport){
    
   portflows_render =  L.geoJSON(portflows, {
        style: function(feature){
            return {weight: feature.properties.FLOWS / 50000 };
        },
        filter: function(feature,layer){
            return feature.properties.Port1 == fromport;
        }
 
    }).addTo(map);
}   

function DisplayPorts(){
    L.geoJSON(ports, {
        pointToLayer: function(feature, coords){
            markerOptions = {
                radius: 3,
                weight: 1,
                color: "#000000",
                FillColor: "#EEF527"
            };
            return L.circleMarker(coords, markerOptions);
        }
    }).addTo(map).on('mouseover', onHover).on('mouseout', ClearLines);
}

function ClearLines(){
    console.log("mouse off")
    portflows_render.clearLayers();
}
function onHover(e){
    fromport = e.layer.feature.properties.LOCODE;
    DisplayPortFlows(fromport);
}

window.onload = function(){
    FetchPortFlows();
    FetchPorts();
}
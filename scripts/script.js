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
//var map = L.map('map').setView([0, 0], 2)

var map = L.map('map')
        .setView([0, 0], 2)

L.tileLayer(
            'https://api.mapbox.com/styles/v1/maxkuempel/cmlywfg2x001a01smhezzavbb/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWF4a3VlbXBlbCIsImEiOiJjbWxmaTRnemgwMjhpM2VxNHY0OWgyZnowIn0.4vT-IDEnXFLYMUFluo4MSw',
            {
              maxZoom: 19,
              attribution:
                '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> © <a href="https://www.mapbox.com/about/maps/">Mapbox</a> <strong><a href="https://labs.mapbox.com/contribute/" target="_blank">Improve this map</a></strong>'
            }
          ).addTo(map);

var fromport ;

var linestyle = {
    "weight": 5
}

var portflows_render;
function DisplayPortFlows(fromport){
   portflows_render =  L.geoJSON(portflows, {
        style: function(feature){
            return {weight: feature.properties.FLOWS / 50000,
                color:  "#f7ea45"
            };
            
        },
        filter: function(feature,layer){
            return feature.properties.Port1 == fromport;
        }
 
    }).addTo(map);
}   

function DisplayPorts(){
    
    L.geoJSON(ports, {
        onEachFeature: function (feature, layer){
            layer.bindTooltip(
                feature.properties.Name +
                ", " +
                feature.properties.Country)
        },
        pointToLayer: function(feature, coords){
            markerOptions = {
                radius: 8,
                weight: 1,
                color: 	"#bfc05b",
            };
            return L.circleMarker(coords, markerOptions);
        }
    }).addTo(
        map
    ).on('mouseover', onHover).on('mouseout', ClearLines);
}


function ClearLines(e){
    console.log("mouse off :(")
    portflows_render.clearLayers();
    this.closePopup();
}
function onHover(e){
    console.log("mouse on!");
    fromport = e.layer.feature.properties.LOCODE;
    DisplayPortFlows(fromport);
    this.openPopup();
}

window.onload = function(){
    FetchPortFlows();
    FetchPorts();
}
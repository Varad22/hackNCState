import L from "leaflet";

const markerIcon = L.icon({
  iconUrl: "/marker.png", 
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32], 
});

export default markerIcon;

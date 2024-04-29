import Leaflet from "leaflet";
import marker from "../assets/marker.svg";
import markerShadow from "../assets/marker-shadow.png";

const customMapMarker = new Leaflet.Icon({
  iconUrl: marker,
  iconRetinaUrl: marker,
  iconAnchor: [11.25, 30],
  popupAnchor: [0, -30],
  shadowUrl: markerShadow,
  shadowSize: new Leaflet.Point(25, 25),
  shadowAnchor: [7, 25],
  iconSize: new Leaflet.Point(22.5, 30),
  className: 'custom-leaflet-marker'
  }
)

export default customMapMarker;
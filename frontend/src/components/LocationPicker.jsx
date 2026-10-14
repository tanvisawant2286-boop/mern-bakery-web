import { useEffect, useState } from "react";
import { CircleMarker, MapContainer, TileLayer, useMap, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const STORE = { lat: 17.0345, lng: 74.6005 };

export default function LocationPicker({ location, setLocation }) {
  const center = location ? [location.lat, location.lng] : [STORE.lat, STORE.lng];
  const [locationStatus, setLocationStatus] = useState("");
  const [locating, setLocating] = useState(false);

  function findCurrentLocation() {
    if (!navigator.geolocation) {
      setLocationStatus("Location is not supported by this browser. Click the map to place a pin.");
      return;
    }

    setLocating(true);
    setLocationStatus("");
    navigator.geolocation.getCurrentPosition(
      position => {
        setLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
        setLocationStatus("Current location selected.");
        setLocating(false);
      },
      error => {
        const message = error.code === error.PERMISSION_DENIED
          ? "Location permission was denied. Allow location access in your browser, or click the map to place a pin."
          : error.code === error.TIMEOUT
            ? "Finding your location timed out. Try again or click the map to place a pin."
            : "Could not get your location. Click the map to place a pin.";
        setLocationStatus(message);
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 }
    );
  }

  return <div className="location-picker">
    <MapContainer center={center} zoom={13} scrollWheelZoom={false}>
      <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <MapClick onSelect={setLocation} />
      <MapCenter center={location} />
      {location && <CircleMarker center={[location.lat, location.lng]} radius={9} pathOptions={{ color: "#b55c4c", fillColor: "#d97d6b", fillOpacity: 0.9 }} />}
    </MapContainer>
    <div className="d-flex justify-content-between align-items-center mt-2 gap-2 flex-wrap"><small className="text-muted-custom">{location ? `${location.lat.toFixed(5)}, ${location.lng.toFixed(5)}` : "No location selected yet."}</small>
      <button type="button" className="btn soft-btn rounded-pill btn-sm" onClick={findCurrentLocation} disabled={locating}>
        <i className="bi bi-geo-alt-fill" /> {locating ? "Finding location..." : "Use my location"}
      </button>
    </div>
    {locationStatus && <small className="d-block mt-2 text-muted-custom" role="status">{locationStatus}</small>}
  </div>;
}

function MapClick({ onSelect }) {
  useMapEvents({ click(event) { onSelect({ lat: event.latlng.lat, lng: event.latlng.lng }); } });
  return null;
}

function MapCenter({ center }) {
  const map = useMap();
  useEffect(() => { if (center) map.setView([center.lat, center.lng], 15); }, [center, map]);
  return null;
}

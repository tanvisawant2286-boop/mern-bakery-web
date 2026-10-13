import { useEffect } from "react";
import { CircleMarker, MapContainer, TileLayer, useMap, useMapEvents } from "react-leaflet";

const STORE = { lat: 17.0345, lng: 74.6005 };

export default function LocationPicker({ location, setLocation }) {
  const center = location ? [location.lat, location.lng] : [STORE.lat, STORE.lng];
  return <div className="location-picker">
    <MapContainer center={center} zoom={13} scrollWheelZoom={false}>
      <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <MapClick onSelect={setLocation} />
      <MapCenter center={location} />
      {location && <CircleMarker center={[location.lat, location.lng]} radius={9} pathOptions={{ color: "#b55c4c", fillColor: "#d97d6b", fillOpacity: 0.9 }} />}
    </MapContainer>
    <div className="d-flex justify-content-between align-items-center mt-2 gap-2 flex-wrap"><small className="text-muted-custom">{location ? `${location.lat.toFixed(5)}, ${location.lng.toFixed(5)}` : "No location selected yet."}</small>
      <button type="button" className="btn soft-btn rounded-pill btn-sm" onClick={() => {
        if (!navigator.geolocation) return;
        navigator.geolocation.getCurrentPosition(
          position => setLocation({ lat: position.coords.latitude, lng: position.coords.longitude }),
          () => window.alert("Could not get your location. Click the map to place a pin."),
          { enableHighAccuracy: true, timeout: 10000 }
        );
      }}><i className="bi bi-geo-alt-fill" /> Use my location</button>
    </div>
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

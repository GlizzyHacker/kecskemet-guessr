// sort-imports-ignore
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet/dist/leaflet.css';
import { MapContainer, Marker, Popup, TileLayer, useMapEvents } from 'react-leaflet';

export default function Map({ location, guess, onMapClick, guesses }) {
  return (
    <MapContainer
      center={[46.90801, 19.69256]}
      zoom={15}
      scrollWheelZoom={true}
      style={{ height: '400px', width: '600px' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      />
      <GuessMarker onMapClick={onMapClick} guess={guess}></GuessMarker>
      {location == null ? null : (
        <Marker opacity={0.5} position={[location.lat, location.lng]}>
          <Popup>Image Location</Popup>
        </Marker>
      )}
      {guesses?.map((e) => (
        <Marker key={e.player.id} position={[e.latLng.lat, e.latLng.lng]}>
          <Popup>
            {e.player.name}'s Guess score:{e.score}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

export function GuessMarker({ onMapClick, guess }) {
  const map = useMapEvents({
    click: (e) => {
      onMapClick(e.latlng);
    },
  });
  return (
    <>
      {guess == null ? null : (
        <Marker position={[guess.lat, guess.lng]}>
          <Popup>My guess</Popup>
        </Marker>
      )}
    </>
  );
}

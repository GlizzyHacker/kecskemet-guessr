// sort-imports-ignore
import { GuessWithPlayer, ParsedCordinates } from '@/types/game';
import { LatLng } from 'leaflet';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet/dist/leaflet.css';
import { MapContainer, Marker, Popup, TileLayer, useMapEvents } from 'react-leaflet';

export default function Map(options: {
  location: ParsedCordinates | null;
  guess: ParsedCordinates | null;
  onMapClick: (point: LatLng) => void;
  guesses: GuessWithPlayer[];
}) {
  return (
    <MapContainer
      center={[46.90801, 19.69256]}
      zoom={15}
      scrollWheelZoom={true}
      style={{ minHeight: '500px', width: '1000px', overflow: 'hidden', zIndex: 0 }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      />
      <GuessMarker onMapClick={options.onMapClick} guess={options.guess}></GuessMarker>
      {!options.location ? null : (
        <Marker opacity={0.5} position={[options.location!.lat, options.location!.lng]}>
          <Popup>Image Location</Popup>
        </Marker>
      )}
      {options.guesses?.map((e) => (
        <Marker key={e.player.id} position={[e.latLng.lat, e.latLng.lng]}>
          <Popup>
            {e.player.name}'s Guess score:{e.score}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

export function GuessMarker(options: { onMapClick: (point: LatLng) => void; guess: ParsedCordinates | null }) {
  const map = useMapEvents({
    click: (e) => {
      options.onMapClick(e.latlng);
    },
  });
  return (
    <>
      {options.guess == null ? null : (
        <Marker position={[options.guess.lat, options.guess.lng]}>
          <Popup>My guess</Popup>
        </Marker>
      )}
    </>
  );
}

// sort-imports-ignore
import { GuessWithPlayer, ParsedCordinates } from '@/types/game';
import { LatLng } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import DrawAreas from './draw_areas';
import { GuessMarker } from './guess_marker';
import LocationMarker from './location_marker';

export default function Map(options: {
  location: ParsedCordinates | null;
  guess: ParsedCordinates | null;
  onMapClick: (point: LatLng) => void;
  guesses: GuessWithPlayer[];
  areas: string[];
}) {
  return (
    <MapContainer
      center={[46.90801, 19.69256]}
      zoom={15}
      scrollWheelZoom={true}
      style={{
        objectFit: 'cover',
        height: '100%',
        width: '100%',
        minHeight: '250px',
        minWidth: '250px',
        overflow: 'hidden',
        zIndex: 0,
      }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      />
      <DrawAreas areasToShow={options.areas}></DrawAreas>
      <GuessMarker onMapClick={options.onMapClick} guess={options.guess}></GuessMarker>
      <LocationMarker location={options.location} bounds={options.guesses.map((e) => e.latLng)} />
      {options.guesses?.map((e) => (
        <Marker key={e.player.id} position={[e.latLng.lat, e.latLng.lng]}>
          <Popup>
            {e.player.name}'s guess score:{e.score}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

// sort-imports-ignore
import { GuessWithPlayer, ParsedCordinates } from '@/types/game';
import { LatLng } from 'leaflet';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet/dist/leaflet.css';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import DrawAreas from './draw_areas';
import { GuessMarker } from './guess_marker';
import LocationMarker from './location_marker';

export default function Map({
  location,
  guess,
  onMapClick,
  guesses,
  areas,
  hint,
}: {
  location?: ParsedCordinates | undefined;
  guess?: ParsedCordinates | undefined;
  onMapClick?: (point: LatLng) => void;
  guesses?: GuessWithPlayer[];
  areas?: string[];
  hint?: string | undefined;
}) {
  //NEEDED TO FIX MAP GLITCHES
  window.dispatchEvent(new Event('resize'));

  return (
    <MapContainer
      center={[46.90801, 19.69256]}
      zoom={12}
      scrollWheelZoom
      style={{
        objectFit: 'cover',
        height: '100%',
        width: '100%',
        minHeight: '250px',
        minWidth: '250px',
        overflow: 'hidden',
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
        zIndex: 0,
      }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      />
      {areas && <DrawAreas areasToShow={areas} hint={hint} />}
      <GuessMarker onMapClick={onMapClick} guess={guess} />
      <LocationMarker location={location} bounds={guesses?.map((e) => e.latLng) ?? []} />
      {guesses?.map((e) => (
        <Marker key={e.player.id} position={[e.latLng.lat, e.latLng.lng]}>
          <Popup>
            {e.player.name}&apos;s guess score:{e.score}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

import { ParsedCordinates } from '@/types/game';
import { LatLng } from 'leaflet';
import { Marker, Popup, useMapEvents } from 'react-leaflet';

export function GuessMarker({
  onMapClick,
  guess,
}: {
  onMapClick: ((point: LatLng) => void) | undefined;
  guess: ParsedCordinates | undefined;
}) {
  useMapEvents({
    click: (e) => {
      onMapClick?.(e.latlng);
    },
  });
  return !guess ? null : (
    <Marker position={[guess.lat, guess.lng]}>
      <Popup>My guess</Popup>
    </Marker>
  );
}

import { ParsedCordinates } from '@/types/game';
import { LatLng } from 'leaflet';
import { Marker, Popup, useMapEvents } from 'react-leaflet';

export function GuessMarker(options: { onMapClick: (point: LatLng) => void; guess: ParsedCordinates | undefined }) {
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

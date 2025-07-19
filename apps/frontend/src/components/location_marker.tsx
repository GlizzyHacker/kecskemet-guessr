import { ParsedCordinates } from '@/types/game';
import { LatLngBounds } from 'leaflet';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { Marker, Popup, useMap } from 'react-leaflet';

export default function LocationMarker(options: {
  location: ParsedCordinates | undefined;
  bounds: ParsedCordinates[] | undefined;
}) {
  const t = useTranslations('GuessMarker');
  const map = useMap();
  useMemo(() => {
    if (options.location) {
      const points = new LatLngBounds([[options.location.lat, options.location.lng]]);
      if (options.bounds) {
        for (let i = 0; i < options.bounds.length; i++) {
          points.extend([options.bounds[i].lat, options.bounds[i].lng]);
        }
      }
      map.fitBounds(points);
    }
  }, [options.location]);

  return !options.location ? null : (
    <Marker opacity={0.5} position={[options.location!.lat, options.location!.lng]}>
      <Popup>{t('location')}</Popup>
    </Marker>
  );
}

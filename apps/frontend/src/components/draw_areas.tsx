import useAreas from '@/hooks/useAreas';
import { LatLngBounds } from 'leaflet';
import { useMemo } from 'react';
import { Polygon, useMap } from 'react-leaflet';

export default function DrawAreas({ areasToShow, hint }: { areasToShow: string[]; hint?: string }) {
  const { data: areas } = useAreas();
  const map = useMap();

  useMemo(() => {
    if (!areas) {
      return;
    }
    const selectedAreas = [...areas].filter((area) => areasToShow.find((show) => show == area[0]));
    const points = new LatLngBounds([]);
    selectedAreas.forEach((area) => {
      area[1].geometry.coordinates[0].forEach((cord) => points.extend({ lat: cord[1], lng: cord[0] }));
    });

    if (points.isValid()) {
      map.fitBounds(points);
    }
  }, [areasToShow.length]);

  if (!areas) {
    return;
  }

  return [...areas].map((area) => (
    <div key={area[0]}>
      {areasToShow.find((show) => show == area[0]) ? (
        <Polygon
          className={hint == area[0] ? 'fill-green-300' : 'fill-primary'}
          fillOpacity={0.4}
          stroke={false}
          positions={area[1].geometry.coordinates[0].map((cord) => {
            return {
              lng: cord[0],
              lat: cord[1],
            };
          })}
        />
      ) : null}
    </div>
  ));
}

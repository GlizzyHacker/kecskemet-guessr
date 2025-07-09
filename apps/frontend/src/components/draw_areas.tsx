import useAreas from '@/hooks/useAreas';
import { Polygon } from 'react-leaflet';

export default function DrawAreas({ areasToShow }: { areasToShow: string[] }) {
  const { data: areas } = useAreas();
  if (!areas) {
    return;
  }
  return [...areas].map((area) => (
    <div id={area[0]}>
      {areasToShow.find((show) => show == area[0]) ? (
        <Polygon
          className='fill-primary'
          fillOpacity={0.4}
          stroke={false}
          positions={area[1].geometry.coordinates[0].map((cord) => {
            return {
              lng: cord[0],
              lat: cord[1],
            };
          })}
        ></Polygon>
      ) : null}
    </div>
  ));
}

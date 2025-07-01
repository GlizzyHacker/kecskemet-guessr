import SelectGame from '@/components/select_game';

export default function Play() {
  return (
    <main className='flex flex-col items-center justify-center'>
      <SelectGame />
    </main>
  );
}

function parseCordinates(val: string) {
  const rawLatLng = val.split(',');
  const latLng = { lat: Number(rawLatLng[0]), lng: Number(rawLatLng[1]) };
  return latLng;
}

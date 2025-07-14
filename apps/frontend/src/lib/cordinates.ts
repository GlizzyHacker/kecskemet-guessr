import { LatLng } from 'leaflet';

export function parseCordinates(val: string): Partial<LatLng> {
  const rawLatLng = val.split(',');
  const latLng = { lat: Number(rawLatLng[0]), lng: Number(rawLatLng[1]) };
  return latLng;
}

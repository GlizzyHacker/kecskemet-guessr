import { ParsedCordinates } from '@/types/game';

export function parseCordinates(val: string): ParsedCordinates {
  const rawLatLng = val.split(',');
  const latLng = { lat: Number(rawLatLng[0]), lng: Number(rawLatLng[1]) };
  return latLng;
}

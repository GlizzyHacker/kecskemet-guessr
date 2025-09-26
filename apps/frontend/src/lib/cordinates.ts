import { ParsedCordinates } from '@/types/game';

export function parseCordinates(val: string): ParsedCordinates {
  const rawLatLng = val.split(',');
  const latLng = { lat: Number(rawLatLng[0]), lng: Number(rawLatLng[1]) };
  return latLng;
}

export function getDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const radius = 6371;
  const degLat = deg2rad(lat2 - lat1);
  const degLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(degLat / 2) * Math.sin(degLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(degLon / 2) * Math.sin(degLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = radius * c; // in km
  return distance;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

export function getDistance(lat1, lon1, lat2, lon2) {
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

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

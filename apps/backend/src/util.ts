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

//Winding number algorithm implementation
export function inPolygon(x: number, y: number, polygon: number[][]) {
  let wn = 0;
  polygon.forEach((a, i) => {
    const b = i + 1 >= polygon.length ? polygon[0] : polygon[i + 1];
    if (a[1] >= y && b[1] <= y) {
      //Interpolate the x value of the line at the same y of the given point
      const t = (y - b[1]) / (a[1] - b[1]);
      const lineX = a[0] * t + b[0] * (1 - t);
      if (lineX > x) {
        wn--;
      }
    }
    if (a[1] < y && b[1] > y) {
      //Interpolate the x value of the line at the same y of the given point
      const t = (y - a[1]) / (b[1] - a[1]);
      const lineX = b[0] * t + a[0] * (1 - t);
      if (lineX > x) {
        wn++;
      }
    }
  });

  return wn != 0;
}

export function getSecondsSince(date: Date): number {
  return Math.floor(Math.abs(Date.now() - date.getTime()) / 1000);
}

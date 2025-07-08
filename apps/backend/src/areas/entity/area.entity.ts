export class Geodata {
  name: string;
  features: Feature[];
}

export class Feature {
  properties: {
    Name: string;
  };
  geometry: {
    coordinates: number[][][];
  };
}

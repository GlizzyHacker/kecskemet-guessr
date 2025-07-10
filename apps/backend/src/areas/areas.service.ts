import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { readFile } from 'fs/promises';
import { Feature, Geodata } from './entity/area.entity';

@Injectable()
export class AreasService {
  constructor() {
    this.getAreas();
  }
  areas: Geodata;

  async findAll(): Promise<Map<string, Feature>> {
    await this.getAreas();
    const areas = new Map();
    this.areas.features.forEach((feat) => {
      areas.set(feat.properties.Name, feat);
    });
    return areas;
  }

  async getAreas() {
    if (this.areas) {
      return;
    }
    const response = await readFile('./assets/Kecskemet.geojson', { encoding: 'utf-8' });
    if (!response) {
      throw new InternalServerErrorException('Failed to get areas');
    }
    this.areas = await JSON.parse(response);
  }

  async validate(areas: string[]) {
    await this.getAreas();
    const validated: string[] = [];
    areas.forEach((area) => {
      if (this.areas.features.some((feat) => feat.properties.Name == area)) {
        validated.push(area);
      }
    });
    if (validated.length == 0) {
      validated.push(this.areas.features[0].properties.Name);
    }
    return validated;
  }
}

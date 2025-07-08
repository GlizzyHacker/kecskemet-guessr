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
    if (!this.areas) {
      await this.getAreas();
    }
    const areas = new Map();
    this.areas.features.forEach((feat) => {
      areas.set(feat.properties.Name, feat);
    });
    return areas;
  }

  async getAreas() {
    const response = await readFile('./assets/Kecskemet.geojson', { encoding: 'utf-8' });
    if (!response) {
      throw new InternalServerErrorException('Failed to get areas');
    }
    this.areas = await JSON.parse(response);
  }
}

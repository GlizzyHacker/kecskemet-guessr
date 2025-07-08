import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { mkdir, readFile, writeFile } from 'fs/promises';
import { request } from 'https';
import { PrismaService } from 'nestjs-prisma';
import { AreasService } from 'src/areas/areas.service';
import { Feature } from 'src/areas/entity/area.entity';
import { getDistance, inPolygon } from 'src/util';
import { CreateImageDto } from './dto/create-image.dto';

@Injectable()
export class ImagesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly areas: AreasService
  ) {}

  difficulties;

  async create(createImageDto: CreateImageDto) {
    const allAreas = await this.areas.findAll();
    let areas: Array<Feature>;
    switch (createImageDto.area) {
      case 'NORMAL':
        areas = [allAreas.get('Nagykorut')];
        break;
      case 'EXPANDED':
        areas = [
          allAreas.get('Nagykorut'),
          allAreas.get('Mariavaros'),
          allAreas.get('Mukertvaros'),
          allAreas.get('Szechenyivaros+hollandfalu'),
          allAreas.get('Domb'),
          allAreas.get('Szentlaszlo+rendorfalu'),
          allAreas.get('Egyetem+Beketer+deliiparterulet'),
          allAreas.get('Bethlenvaros'),
          allAreas.get('Hunyadivaros'),
          allAreas.get('Szentistvan'),
          allAreas.get('Petofivaros'),
        ];
        break;
      case 'ALL':
        areas = Array.from(allAreas, (v) => v[1]);
        break;
    }
    if (!this.difficulties) {
      const response = await readFile('./assets/difficulties.json', { encoding: 'utf-8' });
      if (!response) {
        throw new InternalServerErrorException('Failed to get difficulties');
      }
      this.difficulties = JSON.parse(response);
    }
    const preset = this.difficulties.presets.find((preset) => preset.name == createImageDto.difficulty.toLowerCase());

    const cordinates = await getCordinates(areas);
    const downloadUrl = await getImageAt(cordinates.lat, cordinates.lng, preset);
    const data = await getImage(downloadUrl);
    if (!data) {
      throw new InternalServerErrorException('Failed to create image');
    }

    const url = `./images/guessrimg${Date.now()}.jpg`;
    await mkdir('./images', { recursive: true });
    await writeFile(url, data);

    try {
      return await this.prisma.image.create({
        data: { ...createImageDto, url: url, cordinates: `${cordinates.lat},${cordinates.lng}` },
      });
    } catch (e) {
      console.error(e);
      throw new BadRequestException('Could not create Image');
    }
  }

  async getImageUrl(id: number) {
    const image = await this.prisma.image.findUnique({
      where: { id },
    });

    if (!image) {
      throw new NotFoundException(`Image with id ${id} not found`);
    }

    return image.url;
  }

  findAll() {
    return `This action returns all images`;
  }

  async findOne(id: number) {
    const image = await this.prisma.image.findUnique({
      where: { id },
    });

    if (!image) {
      throw new NotFoundException(`Image with id ${id} not found`);
    }

    return image;
  }

  // update(id: number, updateImageDto: UpdateImageDto) {
  //   return `This action updates a #${id} image`;
  // }

  remove(id: number) {
    return `This action removes a #${id} image`;
  }
}

async function getCordinates(areas: Feature[]) {
  const originLat = 46.90801;
  const originLon = 19.69256;

  //GET FARTHEST CORDINATE
  const farthest = areas
    .map((feat) => feat.geometry.coordinates[0])
    .flat()
    .reduce((max: number[], point: number[]) =>
      getDistance(point[1], point[0], originLat, originLon) > getDistance(max[1], max[0], originLat, originLon)
        ? point
        : max
    );

  const radius = Math.sqrt(Math.pow(farthest[1] - originLat, 2) + Math.pow(farthest[0] - originLon, 2));

  let retries = 0;
  let status = '';
  let body;
  let area;
  while (status != 'OK') {
    if (retries > 100) {
      throw new InternalServerErrorException('Failed to create image');
    }
    const lat = originLat + radius * (1 - Math.random() * 2);
    const lng = originLon + radius * (1 - Math.random() * 2);
    area = areas.find((a) => inPolygon(lng, lat, a.geometry.coordinates[0]));
    if (area) {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/streetview/metadata?radius=100&location=${lat},${lng}&key=${process.env.GOOGLE_STREET_VIEW_KEY}`
      );
      if (response.status == 200) {
        body = await response.json();
        status = body.status;
      }
    }
    retries++;
  }
  console.log(`${retries} retries`);
  //TODO: WRITE RESPONSE TO IMAGE FILE METADATA
  return { lat: body.location.lat, lng: body.location.lng, area: area };
}

async function getImageAt(
  lat: number,
  lon: number,
  preset: { pitchMax: number; pitchMin: number; fovMax: number; fovMin: number }
) {
  const direction = Math.floor(Math.random() * 360);
  const pitch = Math.floor(Math.random() * (preset.pitchMax - preset.pitchMin)) + preset.pitchMin;
  const fov = Math.floor(Math.random() * (preset.fovMax - preset.fovMin)) + preset.fovMin;
  return `https://maps.googleapis.com/maps/api/streetview?return_error_code=true&size=1000x1000&location=${lat},${lon}&fov=${fov}&heading=${direction}&pitch=${pitch}&key=${process.env.GOOGLE_STREET_VIEW_KEY}`;
}

async function getImage(url: string): Promise<Buffer> {
  return new Promise((resolve) => {
    request(url, async function (response) {
      const data = [];

      response.on('data', function (chunk) {
        data.push(chunk);
      });

      response.on('completed', async function () {
        if (response.statusCode == 404) {
          resolve(null);
        } else {
          resolve(Buffer.concat(data));
        }
      });

      response.on('end', function () {
        if (response.statusCode == 404) {
          resolve(null);
        } else {
          resolve(Buffer.concat(data));
        }
      });
    }).end();
  });
}

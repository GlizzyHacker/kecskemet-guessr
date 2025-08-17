import {
  BadRequestException,
  GoneException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { mkdir, readFile, unlink, writeFile } from 'fs/promises';
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
    if ((await this.prisma.image.count()) >= Number(process.env.MAXIMUM_IMAGE_COUNT)) {
      this.deleteWorstImage();
    }

    const allAreas = await this.areas.findAll();
    const areas: Array<Feature> = [];
    createImageDto.areas.forEach((area) => {
      const feat = allAreas.get(area);
      if (feat) {
        areas.push(feat);
      }
    });
    if (areas.length == 0) {
      throw new InternalServerErrorException('Failed to find areas');
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
        data: {
          url: url,
          cordinates: `${cordinates.lat},${cordinates.lng}`,
          area: cordinates.area.properties.Name,
          difficulty: createImageDto.difficulty,
        },
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

    if (image.deleted) {
      new GoneException('Image was deleted');
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

  async findForPlayers(createImageDto: CreateImageDto, playerIds: number[]) {
    const imageScore = await this.prisma.imageScore.findFirst({
      where: {
        image: {
          area: { in: createImageDto.areas },
          difficulty: createImageDto.difficulty,
          deleted: false,
          //Filter for rounds none of the players have played before
          Round: { none: { game: { members: { some: { playerId: { in: playerIds } } } } } },
        },
      },
      orderBy: { score: 'desc' },
      skip: Math.random() * 100,
      include: { image: true },
    });
    return imageScore?.image;
  }

  async findOrCreateForPlayers(createImageDto: CreateImageDto, playerIds: number[]) {
    let image;
    //Small chance to create new image anyway
    if (Math.random() > 0.01 && (await this.prisma.image.count()) >= Number(process.env.TARGET_IMAGE_COUNT)) {
      image = await this.findForPlayers(createImageDto, playerIds);
    }
    if (!image) {
      image = await this.create(createImageDto);
    }
    return image;
  }

  async delete(id: number) {
    const image = await this.prisma.image.update({ where: { id }, data: { deleted: true } });
    await unlink(image.url);
    return image;
  }

  async deleteWorstImage() {
    const imageScore = await this.prisma.imageScore.findFirst({
      where: {
        //Filter for images not in play
        image: { deleted: false, Round: { none: { game: { active: { equals: true } } } } },
      },
      orderBy: { score: 'asc' },
    });
    if (imageScore) {
      return await this.delete(imageScore.id);
    }
    return null;
  }
}

async function getCordinates(areas: Feature[]): Promise<{ lat: number; lng: number; area: Feature }> {
  const origin = areas
    .map((feat) => feat.geometry.coordinates[0])
    .flat()
    .reduce((avg, cord) => [(avg[0] + cord[0]) / 2, (avg[1] + cord[1]) / 2]);

  //GET FARTHEST CORDINATE
  const farthest = areas
    .map((feat) => feat.geometry.coordinates[0])
    .flat()
    .reduce((max: number[], point: number[]) =>
      getDistance(point[1], point[0], origin[1], origin[0]) > getDistance(max[1], max[0], origin[1], origin[0])
        ? point
        : max
    );

  const radius = Math.sqrt(Math.pow(farthest[1] - origin[1], 2) + Math.pow(farthest[0] - origin[0], 2));

  let retries = 0;
  let status = '';
  let body;
  let area;
  while (status != 'OK') {
    if (retries > 100) {
      throw new InternalServerErrorException('Failed to create image');
    }
    const lat = origin[1] + radius * (1 - Math.random() * 2);
    const lng = origin[0] + radius * (1 - Math.random() * 2);
    area = areas.find((a) => inPolygon(lng, lat, a.geometry.coordinates[0]));
    if (area) {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/streetview/metadata?radius=100&location=${lat},${lng}&key=${process.env.GOOGLE_STREET_VIEW_KEY}`
      );
      if (response.status == 200) {
        body = await response.json();
        status = body.status;
      } else {
        console.log(response);
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

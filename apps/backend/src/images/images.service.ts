import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { mkdir, writeFile } from 'fs/promises';
import { request } from 'https';
import { PrismaService } from 'nestjs-prisma';
import { CreateImageDto } from './dto/create-image.dto';

@Injectable()
export class ImagesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createImageDto: CreateImageDto) {
    const cordinates = await getCordinates();
    const downloadUrl = getImageAt(cordinates.lat, cordinates.lng);
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

async function getCordinates() {
  const originLat = 46.90801;
  const originLon = 19.69256;
  const radius = 0.0115;

  const lat = originLat + radius * (1 - Math.random() * 2);
  const lng = originLon + radius * (1 - Math.random() * 2);

  //CHECK IF IN AREA

  let retries = 0;
  let status = '';
  let body;
  while (status != 'OK') {
    if (retries > 10) {
      throw new InternalServerErrorException('Failed to create image');
    }
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/streetview/metadata?radius=100&location=${lat},${lng}&key=${process.env.GOOGLE_STREET_VIEW_KEY}`
    );
    if (response.status == 200) {
      body = await response.json();
      status = body.status;
    }
    retries++;
  }
  console.log(`${retries} retries`);
  //TODO: WRITE RESPONSE TO IMAGE FILE METADATA
  return { lat: body.location.lat, lng: body.location.lng };
}

function getImageAt(lat: number, lon: number) {
  const direction = Math.floor(Math.random() * 360);
  const pitch = Math.floor(Math.random() * 10);
  const fov = Math.floor(Math.random() * 30) + 20;
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

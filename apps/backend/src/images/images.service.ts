import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateImageDto } from './dto/create-image.dto';

@Injectable()
export class ImagesService {
  constructor(private readonly prisma: PrismaService) {}

  create(createImageDto: CreateImageDto) {
    const originLat = 46.90801;
    const originLon = 19.69256;
    const radius = 0.0115;
    const lat = originLat + radius * Math.random();
    const lon = originLon + radius * Math.random();
    const direction = Math.floor(Math.random() * 360);
    const pitch = Math.floor(Math.random() * 10);
    const fov = Math.floor(Math.random() * 20) + 10;
    const url = `https://maps.googleapis.com/maps/api/streetview?return_error_code=true&size=1000x1000&location=${lat},${lon}&fov=${fov}&heading=${direction}&pitch=${pitch}&key=${process.env.key}`;
    try {
      return this.prisma.image.create({
        data: { ...createImageDto, url: url, cordinates: `${lat},${lon}` },
      });
    } catch (e) {
      console.error(e);
      throw new BadRequestException('Could not create Image');
    }
  }

  findAll() {
    return `This action returns all images`;
  }

  findOne(id: number) {
    return `This action returns a #${id} image`;
  }

  // update(id: number, updateImageDto: UpdateImageDto) {
  //   return `This action updates a #${id} image`;
  // }

  remove(id: number) {
    return `This action removes a #${id} image`;
  }
}

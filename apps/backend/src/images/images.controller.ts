import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, StreamableFile } from '@nestjs/common';
import { createReadStream } from 'fs';
import { CreateImageDto } from './dto/create-image.dto';
import { ImagesService } from './images.service';

@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Post()
  async create(@Body() createImageDto: CreateImageDto) {
    return await this.imagesService.create(createImageDto);
  }

  @Get()
  findAll() {
    return this.imagesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const url = await this.imagesService.getImageUrl(id);
    const file = createReadStream(url);
    return new StreamableFile(file, { type: 'image/jpeg' });
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateImageDto: UpdateImageDto) {
  //   return this.imagesService.update(+id, updateImageDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.imagesService.remove(+id);
  }
}

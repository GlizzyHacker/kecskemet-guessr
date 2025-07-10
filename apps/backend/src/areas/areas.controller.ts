import { Controller, Get } from '@nestjs/common';
import { AreasService } from './areas.service';

@Controller('areas')
export class AreasController {
  constructor(private readonly areasService: AreasService) {}

  @Get()
  async getAll() {
    const map = await this.areasService.findAll();
    //Map cannot be converted to json
    return [...map];
  }
}

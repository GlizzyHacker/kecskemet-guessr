import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateRoundDto } from './dto/create-round.dto';
import { RoundsService } from './rounds.service';

@Controller('rounds')
export class RoundsController {
  constructor(private readonly roundsService: RoundsService) {}

  @Post()
  create(@Body() createRoundDto: CreateRoundDto) {
    return this.roundsService.create(createRoundDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roundsService.findOne(+id);
  }
}

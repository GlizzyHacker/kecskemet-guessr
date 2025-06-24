import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { GamesService } from './games.service';

@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Post()
  async create(@Body() createGameDto: CreateGameDto) {
    return await this.gamesService.create(createGameDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.gamesService.findOne(+id);
  }
}

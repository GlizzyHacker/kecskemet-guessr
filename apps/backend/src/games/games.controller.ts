import { Body, Controller, Get, GoneException, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CurrentPlayer } from 'src/auth/current-player.decorator';
import { CreateGameDto } from './dto/create-game.dto';
import { GamesService } from './games.service';

@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Post()
  async create(@Body() createGameDto: CreateGameDto) {
    return await this.gamesService.create(createGameDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Get(':id')
  async findOne(@CurrentPlayer() player, @Param('id') id: string) {
    const game = await this.gamesService.findOne(+id, true);
    if (game.active || game.members.some((member) => member.playerId == player.id)) {
      return game;
    }
    return new GoneException('Game is over');
  }
}

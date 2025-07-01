import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CurrentPlayer } from 'src/auth/current-player.decorator';
import { CreatePlayerDto } from './dto/create-player.dto';
import { PlayersService } from './players.service';

@Controller('players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Post()
  async create(@Body() createPlayerDto: CreatePlayerDto) {
    const player = await this.playersService.create(createPlayerDto);
    return player;
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  async getCurrentPlayer(@CurrentPlayer() player) {
    return await this.playersService.findOne(player.id);
  }

  @Patch('me')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  async updateCurrentPlayer(@Body() createPlayerDto: CreatePlayerDto, @CurrentPlayer() player) {
    return await this.playersService.update(player.id, createPlayerDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.playersService.findOne(+id);
  }
}

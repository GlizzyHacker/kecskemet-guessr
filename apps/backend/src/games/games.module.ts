import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { GuessesService } from 'src/guesses/guesses.service';
import { ImagesService } from 'src/images/images.service';
import { MembersService } from 'src/members/members.service';
import { RoundsService } from 'src/rounds/rounds.service';
import { GamesController } from './games.controller';
import { GamesGateway } from './games.gateway';
import { GamesService } from './games.service';

@Module({
  controllers: [GamesController],
  providers: [GamesGateway, GamesService, GuessesService, RoundsService, JwtService, ImagesService, MembersService],
})
export class GamesModule {}

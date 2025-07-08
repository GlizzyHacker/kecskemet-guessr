import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AreasModule } from 'src/areas/areas.module';
import { GuessesModule } from 'src/guesses/guesses.module';
import { ImagesModule } from 'src/images/images.module';
import { MembersModule } from 'src/members/members.module';
import { RoundsModule } from 'src/rounds/rounds.module';
import { GamesController } from './games.controller';
import { GamesGateway } from './games.gateway';
import { GamesService } from './games.service';

@Module({
  controllers: [GamesController],
  providers: [GamesService, GamesGateway, JwtService],
  imports: [GuessesModule, RoundsModule, ImagesModule, MembersModule, AreasModule],
})
export class GamesModule {}

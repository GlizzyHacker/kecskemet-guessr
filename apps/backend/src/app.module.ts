import { Module } from '@nestjs/common';
import { PrismaModule } from 'nestjs-prisma';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GamesModule } from './games/games.module';
import { GuessesModule } from './guesses/guesses.module';
import { ImagesModule } from './images/images.module';
import { PlayersModule } from './players/players.module';
import { RoundsModule } from './rounds/rounds.module';
import { MembersModule } from './members/members.module';

@Module({
  imports: [
    PrismaModule.forRoot({ isGlobal: true }),
    ImagesModule,
    RoundsModule,
    GamesModule,
    GuessesModule,
    PlayersModule,
    MembersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { PrismaModule } from 'nestjs-prisma';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AreasModule } from './areas/areas.module';
import { AuthModule } from './auth/auth.module';
import { GamesModule } from './games/games.module';
import { GuessesModule } from './guesses/guesses.module';
import { ImagesModule } from './images/images.module';
import { MembersModule } from './members/members.module';
import { PlayersModule } from './players/players.module';
import { RoundsModule } from './rounds/rounds.module';
import { MessagesModule } from './messages/messages.module';

@Module({
  imports: [
    PrismaModule.forRoot({ isGlobal: true }),
    ImagesModule,
    RoundsModule,
    GamesModule,
    GuessesModule,
    PlayersModule,
    MembersModule,
    AuthModule,
    AreasModule,
    MessagesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

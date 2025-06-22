import { Module } from '@nestjs/common';
import { GuessesService } from './guesses.service';
import { GuessesController } from './guesses.controller';

@Module({
  controllers: [GuessesController],
  providers: [GuessesService],
})
export class GuessesModule {}

import { Body, Controller, Post } from '@nestjs/common';
import { CreateGuessDto } from './dto/create-guess.dto';
import { GuessesService } from './guesses.service';

@Controller('guesses')
export class GuessesController {
  constructor(private readonly guessesService: GuessesService) {}

  @Post()
  create(@Body() createGuessDto: CreateGuessDto) {
    return this.guessesService.create(createGuessDto);
  }
}

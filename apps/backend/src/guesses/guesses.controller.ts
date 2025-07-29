import { Body, Controller, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { CreateGuessDto } from './dto/create-guess.dto';
import { UpdateGuessDto } from './dto/update-guess.dto';
import { GuessesService } from './guesses.service';

@Controller('guesses')
export class GuessesController {
  constructor(private readonly guessesService: GuessesService) {}

  @Post()
  create(@Body() createGuessDto: CreateGuessDto) {
    return this.guessesService.create(createGuessDto);
  }

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateGuessDto: UpdateGuessDto) {
    return await this.guessesService.update(id, updateGuessDto);
  }
}

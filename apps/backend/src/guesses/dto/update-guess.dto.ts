import { PartialType } from '@nestjs/swagger';
import { IsInt, IsNumber, Max, Min } from 'class-validator';
import { CreateGuessDto } from './create-guess.dto';

export class UpdateGuessDto extends PartialType(CreateGuessDto) {
  @IsNumber()
  @IsInt()
  @Min(-1)
  @Max(1)
  vote: number;
}

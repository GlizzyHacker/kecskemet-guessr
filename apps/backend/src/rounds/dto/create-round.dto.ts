import { Area, Difficulty } from '@prisma/client';
import { IsEnum, IsNumber } from 'class-validator';

export class CreateRoundDto {
  @IsNumber()
  gameId: number;

  @IsEnum(Difficulty)
  difficulty: Difficulty;

  @IsEnum(Area)
  area: Area;
}

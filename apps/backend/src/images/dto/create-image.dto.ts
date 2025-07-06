import { Area, Difficulty } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class CreateImageDto {
  @IsEnum(Difficulty)
  difficulty: Difficulty;

  @IsEnum(Area)
  area: Area;
}

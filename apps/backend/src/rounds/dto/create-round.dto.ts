import { Difficulty } from '@prisma/client';
import { ArrayMinSize, IsArray, IsEnum, IsInt, IsNumber, IsString } from 'class-validator';

export class CreateRoundDto {
  @IsNumber()
  gameId: number;

  @IsArray()
  @IsInt({ each: true })
  @ArrayMinSize(1)
  playerIds: number[];

  @IsEnum(Difficulty)
  difficulty: Difficulty;

  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  areas: string[];
}

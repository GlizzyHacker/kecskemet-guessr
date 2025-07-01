import { IsNumber, IsString } from 'class-validator';

export class Player {
  @IsNumber()
  id: number;
  @IsString()
  name: string;
}

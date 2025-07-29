import { IsInt, IsNumber, Max, Min } from 'class-validator';

export class UpdateImageDto {
  @IsNumber()
  @IsInt()
  @Min(-1)
  @Max(1)
  vote: number;
}

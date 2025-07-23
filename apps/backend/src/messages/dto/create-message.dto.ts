import { IsInt, IsOptional, IsString, Length } from 'class-validator';

export class createMessageDto {
  @IsString()
  @Length(1, 200)
  content: string;

  @IsOptional()
  @IsInt()
  memberId: number;

  @IsInt()
  gameId: number;
}

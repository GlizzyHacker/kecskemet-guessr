import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateGuessDto } from './dto/create-guess.dto';

@Injectable()
export class GuessesService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createGuessDto: CreateGuessDto) {
    try {
      return await this.prisma.guess.create({
        data: {
          member: { connect: { id: createGuessDto.memberId } },
          round: { connect: { id: createGuessDto.roundId } },
          cordinates: createGuessDto.cordinates,
          score: createGuessDto.score,
        },
      });
    } catch (e) {
      console.error(e);
      throw new BadRequestException('Could not create Guess');
    }
  }
}

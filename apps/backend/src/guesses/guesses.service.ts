import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateGuessDto } from './dto/create-guess.dto';
import { UpdateGuessDto } from './dto/update-guess.dto';

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

  async update(id: number, updateGuessDto: UpdateGuessDto) {
    const image = await this.prisma.guess.update({ where: { id }, data: updateGuessDto });

    if (!image) {
      throw new NotFoundException(`Guess with id ${id} not found`);
    }

    return image;
  }
}

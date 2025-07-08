import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Guess, Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { ImagesService } from 'src/images/images.service';
import { CreateRoundDto } from './dto/create-round.dto';

@Injectable()
export class RoundsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly imageService: ImagesService
  ) {}

  async create(createRoundDto: CreateRoundDto) {
    const image = await this.imageService.create({
      areas: createRoundDto.areas,
      difficulty: createRoundDto.difficulty,
    });
    try {
      return await this.prisma.round.create({
        data: { gameId: createRoundDto.gameId, imageId: image.id },
        include: { game: true },
      });
    } catch (e) {
      console.error(e);
      throw new BadRequestException('Could not create round');
    }
  }

  findAll() {
    return `This action returns all rounds`;
  }

  async findOne(id: number) {
    const round = await this.prisma.round.findUnique({
      where: { id },
      include: { guesses: true, image: true },
    });

    if (!round) {
      throw new NotFoundException(`Round with id ${id} not found`);
    }

    return round;
  }

  async addGuess(id: number, guess: Guess) {
    try {
      return await this.prisma.round.update({
        where: { id },
        data: { guesses: { connect: guess } },
        include: { guesses: { include: { member: true } }, image: true },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2025') {
          throw new NotFoundException(`Game with id ${id} not found`);
        }
      }
      console.error(e);
      throw new BadRequestException(`Could not update board with id ${id}`);
    }
  }
}

import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { RoundsService } from 'src/rounds/rounds.service';
import { CreateGameDto } from './dto/create-game.dto';

@Injectable()
export class GamesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly roundService: RoundsService
  ) {}

  async create(createGameDto: CreateGameDto) {
    try {
      return await this.prisma.game.create({
        data: { ...createGameDto },
      });
    } catch (e) {
      console.error(e);
      throw new BadRequestException('Could not create Game');
    }
  }

  async findOne(id: number) {
    const game = await this.prisma.game.findUnique({
      where: { id },
      include: {
        rounds: true,
        members: {
          include: { guesses: { select: { id: true, roundId: true, memberId: true, score: true } }, player: true },
        },
      },
    });

    if (!game) {
      throw new NotFoundException(`Game with id ${id} not found`);
    }

    return game;
  }

  async nextRound(id: number) {
    try {
      //INCREMENT FIRST TO AVOID WAITING FOR NEXT ROUND
      const game = await this.prisma.game.update({
        where: { id },
        data: { round: { increment: 1 } },
      });
      const round = await this.roundService.create({ gameId: id, ...game });
      return await this.prisma.game.update({
        where: { id },
        include: { members: true, rounds: true },
        data: { rounds: { connect: round } },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2025') {
          throw new NotFoundException(`Game with id ${id} not found`);
        }
      }
      console.error(e);
      throw new BadRequestException(`Could not update game with id ${id}`);
    }
  }

  async finish(id: number) {
    try {
      return await this.prisma.game.update({
        where: { id },
        data: { active: false },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2025') {
          throw new NotFoundException(`Game with id ${id} not found`);
        }
      }
      console.error(e);
      throw new BadRequestException(`Could not update game with id ${id}`);
    }
  }
}

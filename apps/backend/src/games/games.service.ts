import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Player, Prisma } from '@prisma/client';
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
      throw new BadRequestException('Could not create Image');
    }
  }

  async addPlayer(id: number, player: Player) {
    try {
      return await this.prisma.game.update({
        where: { id },
        data: { players: { connect: player } },
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

  async findOne(id: number) {
    const game = await this.prisma.game.findUnique({
      where: { id },
      include: { rounds: true, players: true },
    });

    if (!game) {
      throw new NotFoundException(`Game with id ${id} not found`);
    }

    return game;
  }

  async nextRound(id: number) {
    const round = await this.roundService.create({ gameId: id });
    try {
      return await this.prisma.game.update({
        where: { id },
        include: { players: true, rounds: true },
        data: { round: { increment: 1 }, rounds: {} },
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

  remove(id: number) {}
}

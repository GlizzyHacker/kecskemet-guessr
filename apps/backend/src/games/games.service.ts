import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { AreasService } from 'src/areas/areas.service';
import { RoundsService } from 'src/rounds/rounds.service';
import { generateJoinCode } from 'src/util';
import { CreateGameDto } from './dto/create-game.dto';

@Injectable()
export class GamesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly roundService: RoundsService,
    private readonly areaService: AreasService
  ) {}

  async create(createGameDto: CreateGameDto) {
    const areas = await this.areaService.validate(createGameDto.areas);
    try {
      return await this.prisma.game.create({
        data: {
          totalRounds: createGameDto.totalRounds,
          difficulty: createGameDto.difficulty,
          area: areas.join(','),
          hint: createGameDto.hint,
          timer: createGameDto.timer,
          joinCode: generateJoinCode(),
          memberLimit: createGameDto.memberLimit,
        },
      });
    } catch (e) {
      console.error(e);
      throw new BadRequestException('Could not create Game');
    }
  }
  async findJoinCode(joinCode: string, includeMessages: boolean = false) {
    const game = await this.prisma.game.findFirst({
      where: { joinCode: joinCode, active: true },
      include: {
        messages: includeMessages,
        rounds: { include: { image: { select: { id: true, area: true } } } },
        members: {
          include: {
            guesses: { select: { id: true, roundId: true, memberId: true, score: true } },
            player: true,
          },
        },
      },
    });

    if (!game) {
      throw new NotFoundException(`Active game with join code ${joinCode} not found`);
    }

    if (!game.hint) {
      game.rounds.forEach((round) => (round.image.area = undefined));
    }

    return game;
  }

  async findOne(id: number, includeMessages: boolean = false) {
    const game = await this.prisma.game.findUnique({
      where: { id },
      include: {
        messages: includeMessages,
        rounds: { include: { image: { select: { id: true, area: true } } } },
        members: {
          include: {
            guesses: { select: { id: true, roundId: true, memberId: true, score: true } },
            player: true,
          },
        },
      },
    });

    if (!game) {
      throw new NotFoundException(`Game with id ${id} not found`);
    }

    if (!game.hint) {
      game.rounds.forEach((round) => (round.image.area = undefined));
    }

    return game;
  }

  async nextRound(id: number) {
    try {
      //INCREMENT FIRST TO AVOID WAITING FOR NEXT ROUND
      const game = await this.prisma.game.update({
        where: { id },
        data: { round: { increment: 1 } },
        include: { members: true },
      });
      try {
        const round = await this.roundService.create({
          gameId: id,
          difficulty: game.difficulty,
          areas: game.area.split(','),
          playerIds: game.members.map((member) => member.playerId),
        });
        return await this.prisma.game.update({
          where: { id },
          include: { members: true, rounds: true },
          data: { rounds: { connect: round } },
        });
      } catch (e) {
        await this.prisma.game.update({
          where: { id },
          data: { round: { decrement: 1 } },
        });
        throw e;
      }
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

  @Cron(CronExpression.EVERY_30_MINUTES)
  async finishInactiveGames() {
    const cutoffDate = new Date(Date.now() - 60 * 1000 * Number(process.env.GAME_INACTIVITY_MINUTES));
    const result = await this.prisma.game.updateMany({
      where: { updatedAt: { lte: cutoffDate }, active: true },
      data: { active: false },
    });
    if (result.count > 0) {
      console.log(`Finished ${result.count} inactive games`);
    }
  }
}

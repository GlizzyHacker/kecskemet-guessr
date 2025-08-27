import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Role } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { CreatePlayerDto } from './dto/create-player.dto';

@Injectable()
export class PlayersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createPlayerDto: CreatePlayerDto) {
    try {
      return await this.prisma.player.create({
        data: createPlayerDto,
      });
    } catch (e) {
      console.error(e);
      throw new BadRequestException('Could not create player');
    }
  }

  async findOne(id: number) {
    const player = await this.prisma.player.findUnique({
      where: { id },
    });

    if (!player) {
      throw new NotFoundException(`Player with id ${id} not found`);
    }

    return player;
  }

  async update(id: number, createPlayerDto: CreatePlayerDto) {
    const player = await this.prisma.player.findUnique({ where: { id } });
    if (!player) {
      throw new NotFoundException(`Player with id ${id} not found`);
    }

    return this.prisma.player.update({ where: { id }, data: createPlayerDto });
  }

  async changeRole(id: number, role: Role) {
    const player = await this.prisma.player.findUnique({ where: { id } });
    if (!player) {
      throw new NotFoundException(`Player with id ${id} not found`);
    }

    return this.prisma.player.update({ where: { id }, data: { role: role } });
  }
}

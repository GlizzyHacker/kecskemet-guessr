import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';

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

  findAll() {
    return `This action returns all players`;
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

  update(id: number, updatePlayerDto: UpdatePlayerDto) {
    return `This action updates a #${id} player`;
  }

  remove(id: number) {
    return `This action removes a #${id} player`;
  }
}

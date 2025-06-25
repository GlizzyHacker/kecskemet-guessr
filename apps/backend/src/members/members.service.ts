import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateMemberDto } from './dto/create-member.dto';

@Injectable()
export class MembersService {
  constructor(private readonly prisma: PrismaService) {}
  async add(createMemberDto: CreateMemberDto) {
    const member = await this.prisma.member.updateManyAndReturn({
      where: { playerId: createMemberDto.playerId, gameId: createMemberDto.gameId },
      data: { connected: true },
      include: { game: true, player: true },
    });

    if (member.length != 1) {
      try {
        return await this.prisma.member.create({
          data: { ...createMemberDto },
          include: { game: true, player: true },
        });
      } catch (e) {
        console.error(e);
        throw new BadRequestException('Could not create Member');
      }
    } else if (member.length > 1) {
      throw new BadRequestException('Too many Members');
    }
    return member[0];
  }

  async remove(createMemberDto: CreateMemberDto) {
    const member = await this.prisma.member.updateMany({
      where: { playerId: createMemberDto.playerId, gameId: createMemberDto.gameId },
      data: { connected: false },
    });

    if (member.count != 1) {
      throw new BadRequestException('Member was not in game');
    }
    return member;
  }

  async removeAt(id: number) {
    const member = await this.prisma.member.update({
      where: { id },
      data: { connected: false },
    });

    if (!member) {
      throw new BadRequestException('Member not found');
    }
    return member;
  }
}

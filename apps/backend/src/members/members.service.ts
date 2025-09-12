import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateMemberDto } from './dto/create-member.dto';

@Injectable()
export class MembersService {
  constructor(private readonly prisma: PrismaService) {}

  async add(createMemberDto: CreateMemberDto) {
    const members = await this.prisma.member.updateManyAndReturn({
      where: { playerId: createMemberDto.playerId, gameId: createMemberDto.gameId },
      data: { connected: true },
      include: { game: { include: { members: true } }, player: true },
    });

    let member;
    if (members.length == 0) {
      try {
        member = await this.prisma.member.create({
          data: { ...createMemberDto },
          include: { game: { include: { members: true } }, player: true },
        });
      } catch (e) {
        console.error(e);
        throw new BadRequestException('Could not create Member');
      }
    } else if (members.length > 1) {
      throw new BadRequestException('Too many Members');
    } else {
      member = members[0];
    }

    if (!member.game.members.some((m) => m.isOwner)) {
      await this.makeOwner(member.id);
    }

    return member;
  }

  async remove(createMemberDto: CreateMemberDto) {
    const member = await this.prisma.member.updateManyAndReturn({
      where: { playerId: createMemberDto.playerId, gameId: createMemberDto.gameId },
      data: { connected: false },
      include: { game: { include: { members: true } } },
    });
    if (member.length != 1) {
      throw new BadRequestException('Member was not in game');
    }
    if (member[0].isOwner) {
      const possibleOwners = member[0].game.members.filter((m) => m.connected && m.id != member[0].id);
      if (possibleOwners.length > 0) {
        await this.changeOwner(possibleOwners[0].id);
      }
    }
    return member;
  }

  async removeAt(id: number) {
    const member = await this.prisma.member.update({
      where: { id },
      data: { connected: false },
      include: { game: { include: { members: true } } },
    });

    if (!member) {
      throw new BadRequestException('Member not found');
    }
    if (member.isOwner) {
      const possibleOwners = member.game.members.filter((m) => m.connected && m.id != member.id);
      if (possibleOwners.length > 0) {
        await this.changeOwner(possibleOwners[0].id);
      }
    }
    return member;
  }

  async makeOwner(id: number) {
    try {
      return await this.prisma.member.update({
        where: { id: id },
        data: { isOwner: true },
        include: { game: { include: { members: true } } },
      });
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException('Could not make member owner');
    }
  }

  async removeOwner(id: number) {
    try {
      return await this.prisma.member.update({
        where: { id: id, isOwner: true },
        data: { isOwner: false },
        include: { game: { include: { members: true } } },
      });
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException('Could not remove owner');
    }
  }

  async changeOwner(id: number) {
    const member = await this.makeOwner(id);
    const owners = member.game.members.filter((m) => m.isOwner && m.id != id);
    owners.forEach(async (owner) => {
      await this.removeOwner(owner.id);
    });
    return member;
  }
}

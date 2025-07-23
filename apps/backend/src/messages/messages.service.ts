import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { createMessageDto } from './dto/create-message.dto';

@Injectable()
export class MessagesService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createMessageDto: createMessageDto) {
    try {
      return await this.prisma.message.create({
        data: {
          content: createMessageDto.content,
          gameId: createMessageDto.gameId,
          memberId: createMessageDto.memberId,
        },
        include: { member: true, game: true },
      });
    } catch (e) {
      console.error(e);
      throw new BadRequestException('Could not create Message');
    }
  }
}

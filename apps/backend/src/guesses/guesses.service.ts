import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateGuessDto } from './dto/create-guess.dto';
import { UpdateGuessDto } from './dto/update-guess.dto';

@Injectable()
export class GuessesService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createGuessDto: CreateGuessDto) {
    try {
      return await this.prisma.guess.create({
        data: { ...createGuessDto },
      });
    } catch (e) {
      console.error(e);
      throw new BadRequestException('Could not create Guess');
    }
  }

  findAll() {
    return `This action returns all guesses`;
  }

  findOne(id: number) {
    return `This action returns a #${id} guess`;
  }

  update(id: number, updateGuessDto: UpdateGuessDto) {
    return `This action updates a #${id} guess`;
  }

  remove(id: number) {
    return `This action removes a #${id} guess`;
  }
}

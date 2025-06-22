import { Module } from '@nestjs/common';
import { ImagesService } from 'src/images/images.service';
import { RoundsController } from './rounds.controller';
import { RoundsService } from './rounds.service';

@Module({
  controllers: [RoundsController],
  providers: [RoundsService, ImagesService],
})
export class RoundsModule {}

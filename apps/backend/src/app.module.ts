import { Module } from '@nestjs/common';
import { PrismaModule } from 'nestjs-prisma';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ImagesModule } from './images/images.module';

@Module({
  imports: [PrismaModule.forRoot({ isGlobal: true }), ImagesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

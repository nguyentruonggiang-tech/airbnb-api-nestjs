import { Module } from '@nestjs/common';
import { RoomsController } from './rooms.controller';
import { RoomsService } from './rooms.service';
import { PrismaModule } from 'src/modules-system/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [RoomsController],
  providers: [RoomsService],
})
export class RoomsModule {}

import { Module } from '@nestjs/common';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { CloudinaryModule } from 'src/modules-system/cloudinary/cloudinary.module';
import { PrismaModule } from 'src/modules-system/prisma/prisma.module';
import { StatisticsController } from './statistics.controller';
import { StatisticsService } from './statistics.service';

@Module({
  imports: [PrismaModule, CloudinaryModule],
  controllers: [StatisticsController],
  providers: [StatisticsService, RolesGuard],
})
export class StatisticsModule {}

import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
import { SuccessMessage } from 'src/common/decorators/success-message.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { StatisticsService } from './statistics.service';

@ApiTags('ThongKe')
@Controller('thong-ke')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get('tong-quan')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Dashboard thống kê tổng quan (chỉ ADMIN)' })
  @ApiOkResponse({ description: 'Lấy thống kê tổng quan thành công' })
  @ApiUnauthorizedResponse({ description: 'Chưa đăng nhập hoặc token không hợp lệ' })
  @ApiForbiddenResponse({ description: 'Không có quyền, chỉ ADMIN mới được truy cập' })
  @SuccessMessage('Lấy thống kê tổng quan thành công')
  getOverview() {
    return this.statisticsService.getOverview();
  }
}

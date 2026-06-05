import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
import { SuccessMessage } from 'src/common/decorators/success-message.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { YearQueryDto } from './dto/year-query.dto';
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

  @Get('doanh-thu-theo-thang')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Doanh thu theo từng tháng trong năm (chỉ ADMIN)' })
  @ApiOkResponse({ description: 'Lấy doanh thu theo tháng thành công' })
  @ApiUnauthorizedResponse({ description: 'Chưa đăng nhập hoặc token không hợp lệ' })
  @ApiForbiddenResponse({ description: 'Không có quyền, chỉ ADMIN mới được truy cập' })
  @ApiBadRequestResponse({ description: 'Năm không hợp lệ' })
  @SuccessMessage('Lấy doanh thu theo tháng thành công')
  getDoanhThuTheoThang(@Query() query: YearQueryDto) {
    return this.statisticsService.getDoanhThuTheoThang(query.nam);
  }
}

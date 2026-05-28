import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public.decorator';
import { SuccessMessage } from 'src/common/decorators/success-message.decorator';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { LocationsService } from './locations.service';

@ApiTags('ViTri')
@Controller('vi-tri')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'Lấy danh sách vị trí (phân trang, tìm kiếm)' })
  @ApiQuery({ name: 'pageIndex', required: false, type: Number, example: 1, description: 'Trang hiện tại' })
  @ApiQuery({ name: 'pageSize', required: false, type: Number, example: 10, description: 'Số bản ghi mỗi trang' })
  @ApiQuery({
    name: 'keyword',
    required: false,
    type: String,
    example: 'Hồ Chí Minh',
    description: 'Tìm theo ten_vi_tri, tinh_thanh hoặc quoc_gia',
  })
  @ApiOkResponse({ description: 'Lấy danh sách vị trí thành công' })
  @SuccessMessage('Lấy danh sách vị trí thành công')
  getLocations(@Req() req: Request) {
    return this.locationsService.getLocations(req);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Lấy vị trí theo id' })
  @ApiOkResponse({ description: 'Lấy thông tin vị trí thành công' })
  @ApiNotFoundResponse({ description: 'Không tìm thấy vị trí' })
  @SuccessMessage('Lấy thông tin vị trí thành công')
  getLocationById(@Param('id', ParseIntPipe) id: number) {
    return this.locationsService.getLocationById(id);
  }

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Tạo vị trí mới' })
  @ApiOkResponse({ description: 'Tạo vị trí thành công' })
  @ApiUnauthorizedResponse({ description: 'Chưa đăng nhập hoặc token không hợp lệ' })
  @SuccessMessage('Tạo vị trí thành công')
  createLocation(@Body() createLocationDto: CreateLocationDto) {
    return this.locationsService.createLocation(createLocationDto);
  }

  @Put(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cập nhật vị trí' })
  @ApiOkResponse({ description: 'Cập nhật vị trí thành công' })
  @ApiNotFoundResponse({ description: 'Không tìm thấy vị trí' })
  @ApiUnauthorizedResponse({ description: 'Chưa đăng nhập hoặc token không hợp lệ' })
  @SuccessMessage('Cập nhật vị trí thành công')
  updateLocation(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateLocationDto: UpdateLocationDto,
  ) {
    return this.locationsService.updateLocation(id, updateLocationDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Xóa vị trí' })
  @ApiOkResponse({ description: 'Xóa vị trí thành công' })
  @ApiNotFoundResponse({ description: 'Không tìm thấy vị trí' })
  @ApiUnauthorizedResponse({ description: 'Chưa đăng nhập hoặc token không hợp lệ' })
  @SuccessMessage('Xóa vị trí thành công')
  deleteLocation(@Param('id', ParseIntPipe) id: number) {
    return this.locationsService.deleteLocation(id);
  }
}

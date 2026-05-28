import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
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
  @ApiOperation({ summary: 'Lấy danh sách vị trí' })
  @ApiOkResponse({ description: 'Lấy danh sách vị trí thành công' })
  @SuccessMessage('Lấy danh sách vị trí thành công')
  getLocations() {
    return this.locationsService.getLocations();
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

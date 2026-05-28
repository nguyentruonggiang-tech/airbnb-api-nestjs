import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public.decorator';
import { SuccessMessage } from 'src/common/decorators/success-message.decorator';
import { CreateRoomDto } from './dto/create-room.dto';
import { GetRoomsQueryDto } from './dto/get-rooms-query.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { RoomsService } from './rooms.service';

@ApiTags('Phong')
@Controller('phong-thue')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'Lấy danh sách phòng' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'pageSize', required: false, type: Number, example: 10 })
  @ApiQuery({
    name: 'keyword',
    required: false,
    type: String,
    description: 'Tìm kiếm theo tên phòng hoặc mô tả',
  })
  @ApiOkResponse({ description: 'Lấy danh sách phòng thành công' })
  @SuccessMessage('Lấy danh sách phòng thành công')
  getRooms(@Query() query: GetRoomsQueryDto) {
    return this.roomsService.getRooms(query);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Lấy thông tin phòng theo id' })
  @ApiParam({ name: 'id', type: Number, example: 1, description: 'ID phòng' })
  @ApiOkResponse({ description: 'Lấy thông tin phòng thành công' })
  @ApiNotFoundResponse({ description: 'Không tìm thấy phòng' })
  @SuccessMessage('Lấy thông tin phòng thành công')
  getRoomById(@Param('id', ParseIntPipe) id: number) {
    return this.roomsService.getRoomById(id);
  }

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Tạo phòng mới' })
  @ApiOkResponse({ description: 'Tạo phòng thành công' })
  @ApiNotFoundResponse({ description: 'Không tìm thấy vị trí' })
  @ApiUnauthorizedResponse({ description: 'Chưa đăng nhập hoặc token không hợp lệ' })
  @SuccessMessage('Tạo phòng thành công')
  createRoom(@Body() createRoomDto: CreateRoomDto) {
    return this.roomsService.createRoom(createRoomDto);
  }

  @Put(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cập nhật phòng' })
  @ApiParam({ name: 'id', type: Number, example: 1, description: 'ID phòng' })
  @ApiOkResponse({ description: 'Cập nhật phòng thành công' })
  @ApiNotFoundResponse({ description: 'Không tìm thấy phòng hoặc vị trí' })
  @ApiUnauthorizedResponse({ description: 'Chưa đăng nhập hoặc token không hợp lệ' })
  @SuccessMessage('Cập nhật phòng thành công')
  updateRoom(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRoomDto: UpdateRoomDto,
  ) {
    return this.roomsService.updateRoom(id, updateRoomDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Xóa phòng' })
  @ApiParam({ name: 'id', type: Number, example: 1, description: 'ID phòng' })
  @ApiOkResponse({ description: 'Xóa phòng thành công' })
  @ApiNotFoundResponse({ description: 'Không tìm thấy phòng' })
  @ApiUnauthorizedResponse({ description: 'Chưa đăng nhập hoặc token không hợp lệ' })
  @SuccessMessage('Xóa phòng thành công')
  deleteRoom(@Param('id', ParseIntPipe) id: number) {
    return this.roomsService.deleteRoom(id);
  }
}

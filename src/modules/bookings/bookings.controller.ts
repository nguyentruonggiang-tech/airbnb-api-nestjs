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
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public.decorator';
import { SuccessMessage } from 'src/common/decorators/success-message.decorator';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';

@ApiTags('DatPhong')
@Controller('dat-phong')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'Lấy danh sách đặt phòng' })
  @ApiOkResponse({ description: 'Lấy danh sách đặt phòng thành công' })
  @SuccessMessage('Lấy danh sách đặt phòng thành công')
  getBookings() {
    return this.bookingsService.getBookings();
  }

  @Get('lay-theo-nguoi-dung/:maNguoiDung')
  @Public()
  @ApiOperation({ summary: 'Lấy danh sách đặt phòng theo người dùng' })
  @ApiParam({
    name: 'maNguoiDung',
    type: Number,
    example: 1,
    description: 'Mã người dùng',
  })
  @ApiOkResponse({ description: 'Lấy danh sách đặt phòng theo người dùng thành công' })
  @ApiNotFoundResponse({ description: 'Không tìm thấy người dùng' })
  @SuccessMessage('Lấy danh sách đặt phòng theo người dùng thành công')
  getBookingsByUser(@Param('maNguoiDung', ParseIntPipe) maNguoiDung: number) {
    return this.bookingsService.getBookingsByUser(maNguoiDung);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Lấy thông tin đặt phòng theo id' })
  @ApiParam({ name: 'id', type: Number, example: 1, description: 'ID đặt phòng' })
  @ApiOkResponse({ description: 'Lấy thông tin đặt phòng thành công' })
  @ApiNotFoundResponse({ description: 'Không tìm thấy đặt phòng' })
  @SuccessMessage('Lấy thông tin đặt phòng thành công')
  getBookingById(@Param('id', ParseIntPipe) id: number) {
    return this.bookingsService.getBookingById(id);
  }

  @Post()
  @Public()
  @ApiOperation({ summary: 'Tạo đặt phòng mới' })
  @ApiOkResponse({ description: 'Tạo đặt phòng thành công' })
  @SuccessMessage('Tạo đặt phòng thành công')
  createBooking(@Body() createBookingDto: CreateBookingDto) {
    return this.bookingsService.createBooking(createBookingDto);
  }

  @Put(':id')
  @Public()
  @ApiOperation({ summary: 'Cập nhật đặt phòng' })
  @ApiParam({ name: 'id', type: Number, example: 1, description: 'ID đặt phòng' })
  @ApiOkResponse({ description: 'Cập nhật đặt phòng thành công' })
  @ApiNotFoundResponse({ description: 'Không tìm thấy đặt phòng' })
  @SuccessMessage('Cập nhật đặt phòng thành công')
  updateBooking(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBookingDto: UpdateBookingDto,
  ) {
    return this.bookingsService.updateBooking(id, updateBookingDto);
  }

  @Delete(':id')
  @Public()
  @ApiOperation({ summary: 'Xóa đặt phòng' })
  @ApiParam({ name: 'id', type: Number, example: 1, description: 'ID đặt phòng' })
  @ApiOkResponse({ description: 'Xóa đặt phòng thành công' })
  @ApiNotFoundResponse({ description: 'Không tìm thấy đặt phòng' })
  @SuccessMessage('Xóa đặt phòng thành công')
  deleteBooking(@Param('id', ParseIntPipe) id: number) {
    return this.bookingsService.deleteBooking(id);
  }
}

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
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public.decorator';
import { SuccessMessage } from 'src/common/decorators/success-message.decorator';
import { User } from 'src/common/decorators/user.decorator';
import type { nguoi_dung } from 'src/modules-system/prisma/generated/prisma/client';
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

  @Get('cua-toi')
  @ApiOperation({ summary: 'Lấy danh sách đặt phòng của tôi' })
  @ApiOkResponse({ description: 'Lấy danh sách đặt phòng của tôi thành công' })
  @ApiUnauthorizedResponse({ description: 'Chưa đăng nhập hoặc token không hợp lệ' })
  @SuccessMessage('Lấy danh sách đặt phòng của tôi thành công')
  getMyBookings(@User() user: nguoi_dung) {
    return this.bookingsService.getBookingsByUser(user.id);
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

  @ApiOperation({ summary: 'Tạo đặt phòng mới' })
  @ApiOkResponse({ description: 'Tạo đặt phòng thành công' })
  @ApiUnauthorizedResponse({ description: 'Chưa đăng nhập hoặc token không hợp lệ' })
  @ApiForbiddenResponse({
    description: 'Không có quyền đặt phòng cho người khác',
  })
  @SuccessMessage('Tạo đặt phòng thành công')
  createBooking(
    @User() user: nguoi_dung,
    @Body() createBookingDto: CreateBookingDto,
  ) {
    return this.bookingsService.createBooking(user, createBookingDto);
  }

  @Put(':id')

  @ApiOperation({ summary: 'Cập nhật đặt phòng' })
  @ApiParam({ name: 'id', type: Number, example: 1, description: 'ID đặt phòng' })
  @ApiOkResponse({ description: 'Cập nhật đặt phòng thành công' })
  @ApiNotFoundResponse({ description: 'Không tìm thấy đặt phòng' })
  @ApiUnauthorizedResponse({ description: 'Chưa đăng nhập hoặc token không hợp lệ' })
  @ApiForbiddenResponse({
    description: 'Không có quyền cập nhật đặt phòng này',
  })
  @SuccessMessage('Cập nhật đặt phòng thành công')
  updateBooking(
    @User() user: nguoi_dung,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBookingDto: UpdateBookingDto,
  ) {
    return this.bookingsService.updateBooking(user, id, updateBookingDto);
  }

  @Delete(':id')

  @ApiOperation({ summary: 'Xóa đặt phòng' })
  @ApiParam({ name: 'id', type: Number, example: 1, description: 'ID đặt phòng' })
  @ApiOkResponse({ description: 'Xóa đặt phòng thành công' })
  @ApiNotFoundResponse({ description: 'Không tìm thấy đặt phòng' })
  @ApiUnauthorizedResponse({ description: 'Chưa đăng nhập hoặc token không hợp lệ' })
  @ApiForbiddenResponse({
    description: 'Không có quyền xóa đặt phòng này',
  })
  @SuccessMessage('Xóa đặt phòng thành công')
  deleteBooking(
    @User() user: nguoi_dung,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.bookingsService.deleteBooking(user, id);
  }
}

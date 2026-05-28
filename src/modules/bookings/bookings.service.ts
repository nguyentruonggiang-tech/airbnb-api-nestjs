import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/modules-system/prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';

@Injectable()
export class BookingsService {
  constructor(private readonly prisma: PrismaService) {}

  async getBookings() {
    const items = await this.prisma.dat_phong.findMany({
      orderBy: { id: 'desc' },
    });

    return items.map((item) => this.formatBooking(item));
  }

  async getBookingsByUser(maNguoiDung: number) {
    await this.checkUserExists(maNguoiDung);

    const items = await this.prisma.dat_phong.findMany({
      where: { ma_nguoi_dat: maNguoiDung },
      orderBy: { id: 'desc' },
    });

    return items.map((item) => this.formatBooking(item));
  }

  async getBookingById(id: number) {
    const booking = await this.prisma.dat_phong.findUnique({
      where: { id },
    });

    if (!booking) {
      throw new NotFoundException('Không tìm thấy đặt phòng');
    }

    return this.formatBooking(booking);
  }

  async createBooking(dto: CreateBookingDto) {
    const soKhach = dto.so_luong_khach ?? 1;

    await this.checkBookingData(
      dto.ma_phong,
      dto.ma_nguoi_dat,
      dto.ngay_den,
      dto.ngay_di,
    );

    const booking = await this.prisma.dat_phong.create({
      data: {
        ma_phong: dto.ma_phong,
        ngay_den: new Date(dto.ngay_den),
        ngay_di: new Date(dto.ngay_di),
        so_luong_khach: soKhach,
        ma_nguoi_dat: dto.ma_nguoi_dat,
      },
    });

    return this.formatBooking(booking);
  }

  async updateBooking(id: number, dto: UpdateBookingDto) {
    const booking = await this.prisma.dat_phong.findUnique({
      where: { id },
    });

    if (!booking) {
      throw new NotFoundException('Không tìm thấy đặt phòng');
    }

    await this.checkBookingData(
      dto.ma_phong ?? booking.ma_phong,
      dto.ma_nguoi_dat ?? booking.ma_nguoi_dat,
      dto.ngay_den ?? booking.ngay_den,
      dto.ngay_di ?? booking.ngay_di,
    );

    const updated = await this.prisma.dat_phong.update({
      where: { id },
      data: {
        ...(dto.ma_phong !== undefined && { ma_phong: dto.ma_phong }),
        ...(dto.ngay_den !== undefined && { ngay_den: new Date(dto.ngay_den) }),
        ...(dto.ngay_di !== undefined && { ngay_di: new Date(dto.ngay_di) }),
        ...(dto.so_luong_khach !== undefined && {
          so_luong_khach: dto.so_luong_khach,
        }),
        ...(dto.ma_nguoi_dat !== undefined && {
          ma_nguoi_dat: dto.ma_nguoi_dat,
        }),
      },
    });

    return this.formatBooking(updated);
  }

  async deleteBooking(id: number) {
    const booking = await this.prisma.dat_phong.findUnique({
      where: { id },
    });

    if (!booking) {
      throw new NotFoundException('Không tìm thấy đặt phòng');
    }

    await this.prisma.dat_phong.delete({
      where: { id },
    });

    return this.formatBooking(booking);
  }

  private async checkBookingData(
    ma_phong: number,
    ma_nguoi_dat: number,
    ngay_den: string | Date,
    ngay_di: string | Date,
  ) {
    await this.checkPhong(ma_phong);
    await this.checkUserExists(ma_nguoi_dat);

    if (new Date(ngay_di) <= new Date(ngay_den)) {
      throw new BadRequestException('Ngày đi phải sau ngày đến');
    }
  }

  private async checkPhong(ma_phong: number) {
    const phong = await this.prisma.phong.findUnique({
      where: { id: ma_phong },
      select: { id: true },
    });

    if (!phong) {
      throw new NotFoundException('Không tìm thấy phòng');
    }
  }

  private async checkUserExists(ma_nguoi_dat: number) {
    const user = await this.prisma.nguoi_dung.findUnique({
      where: { id: ma_nguoi_dat },
      select: { id: true },
    });

    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }
  }

  private formatBooking(booking: {
    ngay_den: Date;
    ngay_di: Date;
    [key: string]: unknown;
  }) {
    return {
      ...booking,
      ngay_den: booking.ngay_den.toISOString().slice(0, 10),
      ngay_di: booking.ngay_di.toISOString().slice(0, 10),
    };
  }
}

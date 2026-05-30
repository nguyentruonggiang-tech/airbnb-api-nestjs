import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { nguoi_dung } from 'src/modules-system/prisma/generated/prisma/client';
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
    await this.prisma.checkUserExists(maNguoiDung);

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

  async createBooking(user: nguoi_dung, dto: CreateBookingDto) {
    const soKhach = dto.so_luong_khach ?? 1;
    const maNguoiDat = this.getMaNguoiDat(user, dto.ma_nguoi_dat);

    await this.checkBookingData(
      dto.ma_phong,
      maNguoiDat,
      dto.ngay_den,
      dto.ngay_di,
    );

    const booking = await this.prisma.dat_phong.create({
      data: {
        ma_phong: dto.ma_phong,
        ngay_den: new Date(dto.ngay_den),
        ngay_di: new Date(dto.ngay_di),
        so_luong_khach: soKhach,
        ma_nguoi_dat: maNguoiDat,
      },
    });

    return this.formatBooking(booking);
  }

  async updateBooking(user: nguoi_dung, id: number, dto: UpdateBookingDto) {
    const booking = await this.prisma.dat_phong.findUnique({
      where: { id },
    });

    if (!booking) {
      throw new NotFoundException('Không tìm thấy đặt phòng');
    }

    this.checkQuyen(booking.ma_nguoi_dat, user);

    if (
      dto.ma_nguoi_dat !== undefined &&
      user.role !== 'ADMIN' &&
      dto.ma_nguoi_dat !== user.id
    ) {
      throw new ForbiddenException('Bạn không có quyền đổi người đặt');
    }

    await this.checkBookingData(
      dto.ma_phong ?? booking.ma_phong,
      dto.ma_nguoi_dat ?? booking.ma_nguoi_dat,
      dto.ngay_den ?? booking.ngay_den,
      dto.ngay_di ?? booking.ngay_di,
      id,
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

  async deleteBooking(user: nguoi_dung, id: number) {
    const booking = await this.prisma.dat_phong.findUnique({
      where: { id },
    });

    if (!booking) {
      throw new NotFoundException('Không tìm thấy đặt phòng');
    }

    this.checkQuyen(booking.ma_nguoi_dat, user);

    await this.prisma.dat_phong.delete({
      where: { id },
    });

    return this.formatBooking(booking);
  }

  private getMaNguoiDat(user: nguoi_dung, maNguoiDat?: number) {
    if (maNguoiDat === undefined) {
      return user.id;
    }

    if (user.role === 'ADMIN' || maNguoiDat === user.id) {
      return maNguoiDat;
    }

    throw new ForbiddenException('Bạn chỉ có thể đặt phòng cho chính mình');
  }

  private checkQuyen(maNguoiDat: number, user: nguoi_dung) {
    if (user.role === 'ADMIN' || maNguoiDat === user.id) {
      return;
    }

    throw new ForbiddenException('Bạn không có quyền thao tác đặt phòng này');
  }

  private async checkBookingData(
    ma_phong: number,
    ma_nguoi_dat: number,
    ngay_den: string | Date,
    ngay_di: string | Date,
    excludeId?: number,
  ) {
    await this.prisma.checkPhongExists(ma_phong);
    await this.prisma.checkUserExists(ma_nguoi_dat);

    const ngayDen = new Date(ngay_den);
    const ngayDi = new Date(ngay_di);

    if (ngayDi <= ngayDen) {
      throw new BadRequestException('Ngày đi phải sau ngày đến');
    }

    const da_dat = await this.prisma.dat_phong.findFirst({
      where: {
        ma_phong,
        ngay_den: { lt: ngayDi },
        ngay_di: { gt: ngayDen },
        ...(excludeId ? { NOT: { id: excludeId } } : {}),
      },
      select: { id: true, ngay_den: true, ngay_di: true },
    });

    if (da_dat) {
      throw new ConflictException(
        `Phòng đã được đặt từ ${da_dat.ngay_den.toISOString().slice(0, 10)} đến ${da_dat.ngay_di.toISOString().slice(0, 10)}`,
      );
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

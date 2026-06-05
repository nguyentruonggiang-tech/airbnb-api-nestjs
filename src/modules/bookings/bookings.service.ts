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
import { GetBookingsQueryDto } from './dto/get-bookings-query.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';

type BookingRecord = { ngay_den: Date; ngay_di: Date; [key: string]: unknown };

@Injectable()
export class BookingsService {
  constructor(private readonly prisma: PrismaService) {}

  async getBookings(query: GetBookingsQueryDto) {
    const { page, pageSize, skip } = this.parsePagination(query);

    const [items, totalItem] = await Promise.all([
      this.prisma.dat_phong.findMany({ skip, take: pageSize, orderBy: { id: 'desc' } }),
      this.prisma.dat_phong.count(),
    ]);

    return this.buildPage(items, { page, pageSize, totalItem });
  }

  async getBookingsByUser(maNguoiDung: number, query: GetBookingsQueryDto) {
    await this.prisma.checkUserExists(maNguoiDung);

    const { page, pageSize, skip } = this.parsePagination(query);
    const where = { ma_nguoi_dat: maNguoiDung };

    const [items, totalItem] = await Promise.all([
      this.prisma.dat_phong.findMany({ where, skip, take: pageSize, orderBy: { id: 'desc' } }),
      this.prisma.dat_phong.count({ where }),
    ]);

    return this.buildPage(items, { page, pageSize, totalItem });
  }

  async getBookingById(id: number) {
    const booking = await this.prisma.dat_phong.findUnique({ where: { id } });

    if (!booking) {
      throw new NotFoundException('Không tìm thấy đặt phòng');
    }

    return this.formatBooking(booking);
  }

  async createBooking(user: nguoi_dung, dto: CreateBookingDto) {
    const maNguoiDat = this.getBookerId(user, dto.ma_nguoi_dat);

    await this.validateBooking(dto.ma_phong, maNguoiDat, dto.ngay_den, dto.ngay_di);

    const booking = await this.prisma.dat_phong.create({
      data: {
        ma_phong: dto.ma_phong,
        ngay_den: new Date(dto.ngay_den),
        ngay_di: new Date(dto.ngay_di),
        so_luong_khach: dto.so_luong_khach ?? 1,
        ma_nguoi_dat: maNguoiDat,
      },
    });

    return this.formatBooking(booking);
  }

  async updateBooking(user: nguoi_dung, id: number, dto: UpdateBookingDto) {
    const booking = await this.prisma.dat_phong.findUnique({ where: { id } });

    if (!booking) {
      throw new NotFoundException('Không tìm thấy đặt phòng');
    }

    this.checkOwner(booking.ma_nguoi_dat, user);

    if (dto.ma_nguoi_dat !== undefined && user.role !== 'ADMIN' && dto.ma_nguoi_dat !== user.id) {
      throw new ForbiddenException('Bạn không có quyền đổi người đặt');
    }

    await this.validateBooking(
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
        ...(dto.so_luong_khach !== undefined && { so_luong_khach: dto.so_luong_khach }),
        ...(dto.ma_nguoi_dat !== undefined && { ma_nguoi_dat: dto.ma_nguoi_dat }),
      },
    });

    return this.formatBooking(updated);
  }

  async deleteBooking(user: nguoi_dung, id: number) {
    const booking = await this.prisma.dat_phong.findUnique({ where: { id } });

    if (!booking) {
      throw new NotFoundException('Không tìm thấy đặt phòng');
    }

    this.checkOwner(booking.ma_nguoi_dat, user);

    await this.prisma.dat_phong.delete({ where: { id } });

    return this.formatBooking(booking);
  }

  private getBookerId(user: nguoi_dung, maNguoiDat?: number) {
    if (maNguoiDat === undefined) return user.id;

    if (user.role === 'ADMIN' || maNguoiDat === user.id) return maNguoiDat;

    throw new ForbiddenException('Bạn chỉ có thể đặt phòng cho chính mình');
  }

  private checkOwner(maNguoiDat: number, user: nguoi_dung) {
    if (user.role === 'ADMIN' || maNguoiDat === user.id) return;

    throw new ForbiddenException('Bạn không có quyền thao tác đặt phòng này');
  }

  private async validateBooking(
    maPhong: number,
    maNguoiDat: number,
    ngayDen: string | Date,
    ngayDi: string | Date,
    excludeId?: number,
  ) {
    await this.prisma.checkPhongExists(maPhong);
    await this.prisma.checkUserExists(maNguoiDat);

    const checkIn = new Date(ngayDen);
    const checkOut = new Date(ngayDi);

    if (checkOut <= checkIn) {
      throw new BadRequestException('Ngày đi phải sau ngày đến');
    }

    const conflict = await this.prisma.dat_phong.findFirst({
      where: {
        ma_phong: maPhong,
        ngay_den: { lt: checkOut },
        ngay_di: { gt: checkIn },
        ...(excludeId ? { NOT: { id: excludeId } } : {}),
      },
      select: { id: true, ngay_den: true, ngay_di: true },
    });

    if (conflict) {
      throw new ConflictException(
        `Phòng đã được đặt từ ${conflict.ngay_den.toISOString().slice(0, 10)} đến ${conflict.ngay_di.toISOString().slice(0, 10)}`,
      );
    }
  }

  private parsePagination(query: GetBookingsQueryDto) {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 10;
    return { page, pageSize, skip: (page - 1) * pageSize };
  }

  private buildPage(items: BookingRecord[], meta: { page: number; pageSize: number; totalItem: number }) {
    return {
      page: meta.page,
      pageSize: meta.pageSize,
      totalItem: meta.totalItem,
      totalPage: Math.ceil(meta.totalItem / meta.pageSize),
      items: items.map((item) => this.formatBooking(item)),
    };
  }

  private formatBooking(booking: BookingRecord) {
    return {
      ...booking,
      ngay_den: booking.ngay_den.toISOString().slice(0, 10),
      ngay_di: booking.ngay_di.toISOString().slice(0, 10),
    };
  }
}

import { Injectable } from '@nestjs/common';
import { formatRatingStats } from 'src/common/helpers/rating-stats.helper';
import { CloudinaryService } from 'src/modules-system/cloudinary/cloudinary.service';
import { PrismaService } from 'src/modules-system/prisma/prisma.service';

const TOP_LIMIT = 5;
const RECENT_BOOKING_LIMIT = 10;

@Injectable()
export class StatisticsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async getOverview() {
    const [
      tongQuan,
      nguoiDungTheoRole,
      rating,
      doanhThuUocTinh,
      topPhongDatNhieu,
      topViTri,
      datPhongGanDay,
    ] = await Promise.all([
      this.getTongQuan(),
      this.getNguoiDungTheoRole(),
      this.getRatingTrungBinh(),
      this.getDoanhThuUocTinh(),
      this.getTopPhongDatNhieu(TOP_LIMIT),
      this.getTopViTri(TOP_LIMIT),
      this.getDatPhongGanDay(RECENT_BOOKING_LIMIT),
    ]);

    return {
      tongQuan,
      nguoiDungTheoRole,
      ratingTrungBinh: rating.diemTrungBinh,
      tongBinhLuan: rating.tongBinhLuan,
      doanhThuUocTinh,
      topPhongDatNhieu,
      topViTri,
      datPhongGanDay,
    };
  }

  private async getTongQuan() {
    const [nguoiDung, phong, viTri, datPhong, binhLuan] = await Promise.all([
      this.prisma.nguoi_dung.count(),
      this.prisma.phong.count(),
      this.prisma.vi_tri.count(),
      this.prisma.dat_phong.count(),
      this.prisma.binh_luan.count(),
    ]);

    return { nguoiDung, phong, viTri, datPhong, binhLuan };
  }

  private async getNguoiDungTheoRole() {
    const grouped = await this.prisma.nguoi_dung.groupBy({
      by: ['role'],
      _count: { id: true },
    });

    return Object.fromEntries(
      grouped.map((row) => [row.role, row._count.id]),
    ) as Record<string, number>;
  }

  private async getRatingTrungBinh() {
    const stats = await this.prisma.binh_luan.aggregate({
      _avg: { sao_binh_luan: true },
      _count: { id: true },
    });

    return formatRatingStats(stats);
  }

  private async getDoanhThuUocTinh() {
    const [row] = await this.prisma.$queryRaw<[{ total: string | null }]>`
      SELECT SUM(DATEDIFF(dp.ngay_di, dp.ngay_den) * p.gia_tien) AS total
      FROM dat_phong dp
      JOIN phong p ON p.id = dp.ma_phong
    `;

    return Number(row?.total ?? 0);
  }

  private async getTopPhongDatNhieu(limit: number) {
    const grouped = await this.prisma.dat_phong.groupBy({
      by: ['ma_phong'],
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: limit,
    });

    if (grouped.length === 0) {
      return [];
    }

    const rooms = await this.prisma.phong.findMany({
      where: { id: { in: grouped.map((row) => row.ma_phong) } },
      select: { id: true, ten_phong: true, gia_tien: true },
    });

    const roomMap = new Map(rooms.map((room) => [room.id, room]));

    return grouped
      .map((row) => {
        const room = roomMap.get(row.ma_phong);
        if (!room) return null;

        return {
          id: room.id,
          ten_phong: room.ten_phong,
          gia_tien: Number(room.gia_tien),
          soLuotDat: row._count.id,
        };
      })
      .filter((item) => item !== null);
  }

  private async getTopViTri(limit: number) {
    const groupedByRoom = await this.prisma.dat_phong.groupBy({
      by: ['ma_phong'],
      _count: { id: true },
    });

    if (groupedByRoom.length === 0) {
      return [];
    }

    const rooms = await this.prisma.phong.findMany({
      where: { id: { in: groupedByRoom.map((row) => row.ma_phong) } },
      select: { id: true, ma_vi_tri: true },
    });

    const roomToLocation = new Map(rooms.map((room) => [room.id, room.ma_vi_tri]));
    const locationBookingCount = new Map<number, number>();

    for (const row of groupedByRoom) {
      const maViTri = roomToLocation.get(row.ma_phong);
      if (maViTri === undefined) continue;

      locationBookingCount.set(
        maViTri,
        (locationBookingCount.get(maViTri) ?? 0) + row._count.id,
      );
    }

    const topLocations = [...locationBookingCount.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit);

    const locations = await this.prisma.vi_tri.findMany({
      where: { id: { in: topLocations.map(([id]) => id) } },
      select: { id: true, ten_vi_tri: true, tinh_thanh: true, quoc_gia: true },
    });

    const locationMap = new Map(locations.map((loc) => [loc.id, loc]));

    return topLocations.map(([id, soLuotDat]) => {
      const location = locationMap.get(id);

      return {
        id,
        ten_vi_tri: location?.ten_vi_tri ?? '',
        tinh_thanh: location?.tinh_thanh ?? '',
        quoc_gia: location?.quoc_gia ?? '',
        soLuotDat,
      };
    });
  }

  private async getDatPhongGanDay(limit: number) {
    const bookings = await this.prisma.dat_phong.findMany({
      take: limit,
      orderBy: { created_at: 'desc' },
      include: {
        phong: { select: { id: true, ten_phong: true, gia_tien: true, hinh_anh: true } },
        nguoi_dung: { select: { id: true, name: true, avatar: true } },
      },
    });

    return bookings.map((booking) => {
      const { nguoi_dung, phong, ma_nguoi_dat, ngay_den, ngay_di, ...rest } = booking;

      return {
        ...rest,
        ngay_den: ngay_den.toISOString().slice(0, 10),
        ngay_di: ngay_di.toISOString().slice(0, 10),
        phong: {
          ...phong,
          gia_tien: Number(phong.gia_tien),
          hinh_anh: this.cloudinaryService.getImageUrl(phong.hinh_anh),
        },
        nguoi_dat: {
          ...nguoi_dung,
          avatar: this.cloudinaryService.getImageUrl(nguoi_dung.avatar),
        },
      };
    });
  }
}

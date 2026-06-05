import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { buildPage, parsePagination } from 'src/common/helpers/pagination.helper';
import {
  addRating,
  formatRatingStats,
  ratingStatsMap,
} from 'src/common/helpers/rating-stats.helper';
import { CloudinaryService } from 'src/modules-system/cloudinary/cloudinary.service';
import { Prisma } from 'src/modules-system/prisma/generated/prisma/client';
import { PrismaService } from 'src/modules-system/prisma/prisma.service';
import { CheckAvailabilityDto } from './dto/check-availability.dto';
import { CreateRoomDto } from './dto/create-room.dto';
import { GetRoomsQueryDto } from './dto/get-rooms-query.dto';
import { UpdateRoomDto } from './dto/update-room.dto';

const roomWithLocation = {
  include: {
    vi_tri: {
      select: { id: true, ten_vi_tri: true, tinh_thanh: true, quoc_gia: true, hinh_anh: true },
    },
  },
} as const;

type RoomWithLocation = Prisma.phongGetPayload<typeof roomWithLocation>;

@Injectable()
export class RoomsService {
  private readonly includeLocation = roomWithLocation.include;

  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async getRooms(query: GetRoomsQueryDto) {
    const { page, pageSize, skip } = parsePagination(query);
    const keyword = query.keyword?.trim();

    const where: Prisma.phongWhereInput = keyword
      ? { OR: [{ ten_phong: { contains: keyword } }, { mo_ta: { contains: keyword } }] }
      : {};

    const [items, totalItem] = await Promise.all([
      this.prisma.phong.findMany({
        where,
        include: this.includeLocation,
        skip,
        take: pageSize,
        orderBy: { id: 'desc' },
      }),
      this.prisma.phong.count({ where }),
    ]);

    const formattedItems = await this.addRatingToRooms(items);

    return {
      keyword: keyword ?? null,
      ...buildPage(formattedItems, { page, pageSize, totalItem }),
    };
  }

  async checkAvailability(id: number, dto: CheckAvailabilityDto) {
    await this.ensureRoomExists(id);

    const ngayDen = new Date(dto.ngay_den);
    const ngayDi = new Date(dto.ngay_di);

    if (ngayDi <= ngayDen) {
      throw new BadRequestException('Ngày đi phải sau ngày đến');
    }

    const conflicts = await this.prisma.dat_phong.findMany({
      where: {
        ma_phong: id,
        ngay_den: { lt: ngayDi },
        ngay_di: { gt: ngayDen },
      },
      select: { id: true, ngay_den: true, ngay_di: true, so_luong_khach: true },
    });

    const con_trong = conflicts.length === 0;

    return {
      con_trong,
      ngay_den: dto.ngay_den,
      ngay_di: dto.ngay_di,
      ...(con_trong ? {} : {
        dat_phong_trung: conflicts.map((b) => ({
          ...b,
          ngay_den: b.ngay_den.toISOString().slice(0, 10),
          ngay_di: b.ngay_di.toISOString().slice(0, 10),
        })),
      }),
    };
  }

  async getRoomsByLocation(maViTri: number) {
    await this.ensureLocationExists(maViTri);

    const items = await this.prisma.phong.findMany({
      where: { ma_vi_tri: maViTri },
      include: this.includeLocation,
      orderBy: { id: 'desc' },
    });

    return this.addRatingToRooms(items);
  }

  async getRoomById(id: number) {
    const [room, ratingStats] = await Promise.all([
      this.prisma.phong.findUnique({
        where: { id },
        include: this.includeLocation,
      }),
      this.prisma.binh_luan.aggregate({
        where: { ma_phong: id },
        _avg: { sao_binh_luan: true },
        _count: { id: true },
      }),
    ]);

    if (!room) {
      throw new NotFoundException('Không tìm thấy phòng');
    }

    return {
      ...this.formatRoom(room),
      thongKeBinhLuan: formatRatingStats(ratingStats),
    };
  }

  async createRoom(dto: CreateRoomDto) {
    await this.ensureLocationExists(dto.ma_vi_tri);

    const createdRoom = await this.prisma.phong.create({
      data: {
        ten_phong: dto.ten_phong,
        khach: dto.khach,
        phong_ngu: dto.phong_ngu,
        giuong: dto.giuong,
        phong_tam: dto.phong_tam,
        mo_ta: dto.mo_ta,
        gia_tien: dto.gia_tien,
        may_giat: dto.may_giat,
        ban_la: dto.ban_la,
        tivi: dto.tivi,
        dieu_hoa: dto.dieu_hoa,
        wifi: dto.wifi,
        bep: dto.bep,
        do_xe: dto.do_xe,
        ho_boi: dto.ho_boi,
        ban_ui: dto.ban_ui,
        hinh_anh: dto.hinh_anh,
        ma_vi_tri: dto.ma_vi_tri,
      },
      include: this.includeLocation,
    });

    return this.formatRoom(createdRoom);
  }

  async updateRoom(id: number, dto: UpdateRoomDto) {
    await this.ensureRoomExists(id);

    if (dto.ma_vi_tri !== undefined) {
      await this.ensureLocationExists(dto.ma_vi_tri);
    }

    const updatedRoom = await this.prisma.phong.update({
      where: { id },
      data: { ...dto },
      include: this.includeLocation,
    });

    return this.formatRoom(updatedRoom);
  }

  async deleteRoom(id: number) {
    await this.ensureRoomExists(id);

    try {
      const deleted = await this.prisma.phong.delete({ where: { id } });
      return this.formatRoom(deleted);
    } catch (error) {
      if (this.prisma.isForeignKeyConstraintError(error)) {
        throw new ConflictException(
          'Không thể xóa phòng vì đang có dữ liệu đặt phòng hoặc bình luận liên quan',
        );
      }
      throw error;
    }
  }

  async uploadRoomImage(id: number, file?: Express.Multer.File) {
    this.cloudinaryService.validateImageFile(file);

    await this.ensureRoomExists(id);

    const { publicId } = await this.cloudinaryService.uploadImage(file!, 'rooms');

    const updatedRoom = await this.prisma.phong.update({
      where: { id },
      data: { hinh_anh: publicId },
      include: this.includeLocation,
    });

    return this.formatRoom(updatedRoom);
  }

  private async addRatingToRooms(rooms: RoomWithLocation[]) {
    const statsMap = await this.getRatingStatsMap(rooms.map((room) => room.id));
    return rooms.map((room) => addRating(this.formatRoom(room), statsMap));
  }

  private async getRatingStatsMap(roomIds: number[]) {
    if (roomIds.length === 0) return ratingStatsMap([]);

    const grouped = await this.prisma.binh_luan.groupBy({
      by: ['ma_phong'],
      where: { ma_phong: { in: roomIds } },
      _avg: { sao_binh_luan: true },
      _count: { id: true },
    });

    return ratingStatsMap(grouped);
  }

  private async ensureRoomExists(id: number) {
    const room = await this.prisma.phong.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!room) {
      throw new NotFoundException('Không tìm thấy phòng');
    }
  }

  private async ensureLocationExists(locationId: number) {
    const location = await this.prisma.vi_tri.findUnique({
      where: { id: locationId },
      select: { id: true },
    });

    if (!location) {
      throw new NotFoundException('Không tìm thấy vị trí');
    }
  }

  private formatRoom<T extends { hinh_anh: string | null; vi_tri?: { hinh_anh: string | null } | null }>(room: T): T {
    return {
      ...room,
      hinh_anh: this.cloudinaryService.getImageUrl(room.hinh_anh),
      ...(room.vi_tri && {
        vi_tri: {
          ...room.vi_tri,
          hinh_anh: this.cloudinaryService.getImageUrl(room.vi_tri.hinh_anh),
        },
      }),
    };
  }
}

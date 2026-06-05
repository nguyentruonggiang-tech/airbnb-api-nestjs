import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { buildPage, parsePagination } from 'src/common/helpers/pagination.helper';
import { CloudinaryService } from 'src/modules-system/cloudinary/cloudinary.service';
import { Prisma } from 'src/modules-system/prisma/generated/prisma/client';
import { PrismaService } from 'src/modules-system/prisma/prisma.service';
import { CheckAvailabilityDto } from './dto/check-availability.dto';
import { CreateRoomDto } from './dto/create-room.dto';
import { GetRoomsQueryDto } from './dto/get-rooms-query.dto';
import { UpdateRoomDto } from './dto/update-room.dto';

@Injectable()
export class RoomsService {
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
      this.prisma.phong.findMany({ where, skip, take: pageSize, orderBy: { id: 'desc' } }),
      this.prisma.phong.count({ where }),
    ]);

    return {
      keyword: keyword ?? null,
      ...buildPage(items.map((item) => this.formatRoom(item)), { page, pageSize, totalItem }),
    };
  }

  async checkAvailability(id: number, dto: CheckAvailabilityDto) {
    await this.getRoomById(id);

    const ngayDen = new Date(dto.ngay_den);
    const ngayDi = new Date(dto.ngay_di);

    if (ngayDi <= ngayDen) {
      throw new BadRequestException('Ngày đi phải sau ngày đến');
    }

    const dat_phong_trung = await this.prisma.dat_phong.findMany({
      where: {
        ma_phong: id,
        ngay_den: { lt: ngayDi },
        ngay_di: { gt: ngayDen },
      },
      select: {
        id: true,
        ngay_den: true,
        ngay_di: true,
        so_luong_khach: true,
      },
    });

    const con_trong = dat_phong_trung.length === 0;

    return {
      con_trong,
      ngay_den: dto.ngay_den,
      ngay_di: dto.ngay_di,
      ...(con_trong
        ? {}
        : {
            dat_phong_trung: dat_phong_trung.map((b) => ({
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
      orderBy: { id: 'desc' },
    });

    return items.map((item) => this.formatRoom(item));
  }

  async getRoomById(id: number) {
    const room = await this.prisma.phong.findUnique({
      where: { id },
    });

    if (!room) {
      throw new NotFoundException('Không tìm thấy phòng');
    }

    return this.formatRoom(room);
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
    });

    return this.formatRoom(createdRoom);
  }

  async updateRoom(id: number, dto: UpdateRoomDto) {
    await this.getRoomById(id);

    if (dto.ma_vi_tri !== undefined) {
      await this.ensureLocationExists(dto.ma_vi_tri);
    }

    const updatedRoom = await this.prisma.phong.update({
      where: { id },
      data: {
        ...dto,
      },
    });

    return this.formatRoom(updatedRoom);
  }

  async deleteRoom(id: number) {
    const room = await this.getRoomById(id);

    try {
      await this.prisma.phong.delete({
        where: { id },
      });
    } catch (error) {
      if (this.prisma.isForeignKeyConstraintError(error)) {
        throw new ConflictException(
          'Không thể xóa phòng vì đang có dữ liệu đặt phòng hoặc bình luận liên quan',
        );
      }

      throw error;
    }

    return this.formatRoom(room);
  }

  async uploadRoomImage(id: number, file?: Express.Multer.File) {
    this.cloudinaryService.validateImageFile(file);

    await this.getRoomById(id);

    const { publicId } = await this.cloudinaryService.uploadImage(file!, 'rooms');

    const updatedRoom = await this.prisma.phong.update({
      where: { id },
      data: { hinh_anh: publicId },
    });

    return this.formatRoom(updatedRoom);
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

  private formatRoom<T extends { hinh_anh: string | null }>(room: T): T {
    return {
      ...room,
      hinh_anh: this.cloudinaryService.getImageUrl(room.hinh_anh),
    };
  }
}

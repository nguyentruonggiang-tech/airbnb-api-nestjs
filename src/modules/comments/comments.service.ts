import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { nguoi_dung } from 'src/modules-system/prisma/generated/prisma/client';
import { buildPage, parsePagination } from 'src/common/helpers/pagination.helper';
import { CloudinaryService } from 'src/modules-system/cloudinary/cloudinary.service';
import { PrismaService } from 'src/modules-system/prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentsService {
  private readonly includeUser = {
    nguoi_dung: { select: { id: true, name: true, avatar: true } },
  } as const;

  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async getComments() {
    const items = await this.prisma.binh_luan.findMany({
      include: this.includeUser,
      orderBy: { id: 'desc' },
    });
    return items.map((item) => this.formatComment(item));
  }

  async getCommentsByPage(page: number, pageSize: number) {
    const { skip } = parsePagination({ page, pageSize });

    const [items, totalItem] = await Promise.all([
      this.prisma.binh_luan.findMany({
        include: this.includeUser,
        skip,
        take: pageSize,
        orderBy: { id: 'desc' },
      }),
      this.prisma.binh_luan.count(),
    ]);

    return buildPage(items.map((item) => this.formatComment(item)), { page, pageSize, totalItem });
  }

  async getCommentById(id: number) {
    const comment = await this.prisma.binh_luan.findUnique({
      where: { id },
      include: this.includeUser,
    });

    if (!comment) {
      throw new NotFoundException('Không tìm thấy bình luận');
    }

    return this.formatComment(comment);
  }

  async createComment(user: nguoi_dung, dto: CreateCommentDto) {
    const maNguoiBinhLuan = this.getCommenterId(user, dto.ma_nguoi_binh_luan);

    await this.prisma.checkPhongExists(dto.ma_phong);
    await this.prisma.checkUserExists(maNguoiBinhLuan);

    const comment = await this.prisma.binh_luan.create({
      data: {
        ma_phong: dto.ma_phong,
        ma_nguoi_binh_luan: maNguoiBinhLuan,
        noi_dung: dto.noi_dung,
        sao_binh_luan: dto.sao_binh_luan,
      },
      include: this.includeUser,
    });

    return this.formatComment(comment);
  }

  async updateComment(user: nguoi_dung, id: number, dto: UpdateCommentDto) {
    const comment = await this.prisma.binh_luan.findUnique({ where: { id } });

    if (!comment) throw new NotFoundException('Không tìm thấy bình luận');

    this.checkOwner(comment.ma_nguoi_binh_luan, user);

    const updated = await this.prisma.binh_luan.update({
      where: { id },
      data: {
        ...(dto.noi_dung !== undefined && { noi_dung: dto.noi_dung }),
        ...(dto.sao_binh_luan !== undefined && { sao_binh_luan: dto.sao_binh_luan }),
      },
      include: this.includeUser,
    });

    return this.formatComment(updated);
  }

  async deleteComment(user: nguoi_dung, id: number) {
    const comment = await this.prisma.binh_luan.findUnique({ where: { id } });

    if (!comment) throw new NotFoundException('Không tìm thấy bình luận');

    this.checkOwner(comment.ma_nguoi_binh_luan, user);

    await this.prisma.binh_luan.delete({ where: { id } });

    return comment;
  }

  async getCommentsByRoom(maPhong: number) {
    await this.prisma.checkPhongExists(maPhong);

    const items = await this.prisma.binh_luan.findMany({
      where: { ma_phong: maPhong },
      include: this.includeUser,
      orderBy: { id: 'desc' },
    });

    return items.map((item) => this.formatComment(item));
  }

  private getCommenterId(user: nguoi_dung, maNguoiBinhLuan?: number) {
    if (maNguoiBinhLuan === undefined) return user.id;

    if (user.role === 'ADMIN' || maNguoiBinhLuan === user.id) return maNguoiBinhLuan;

    throw new ForbiddenException('Bạn chỉ có thể bình luận bằng tài khoản của mình');
  }

  private checkOwner(maNguoiBinhLuan: number, user: nguoi_dung) {
    if (user.role === 'ADMIN' || maNguoiBinhLuan === user.id) return;

    throw new ForbiddenException('Bạn không có quyền thao tác bình luận này');
  }

  private formatComment<T extends { nguoi_dung: { avatar: string | null } }>(comment: T): T {
    return {
      ...comment,
      nguoi_dung: {
        ...comment.nguoi_dung,
        avatar: this.cloudinaryService.getImageUrl(comment.nguoi_dung.avatar),
      },
    };
  }
}

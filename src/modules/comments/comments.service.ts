import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { nguoi_dung } from 'src/modules-system/prisma/generated/prisma/client';
import { buildPage, parsePagination } from 'src/common/helpers/pagination.helper';
import { PrismaService } from 'src/modules-system/prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentsService {
  constructor(private readonly prisma: PrismaService) {}

  getComments() {
    return this.prisma.binh_luan.findMany({
      orderBy: { id: 'desc' },
    });
  }

  async getCommentsByPage(page: number, pageSize: number) {
    const { skip } = parsePagination({ page, pageSize });

    const [items, totalItem] = await Promise.all([
      this.prisma.binh_luan.findMany({ skip, take: pageSize, orderBy: { id: 'desc' } }),
      this.prisma.binh_luan.count(),
    ]);

    return buildPage(items, { page, pageSize, totalItem });
  }

  async getCommentById(id: number) {
    const comment = await this.prisma.binh_luan.findUnique({
      where: { id },
    });

    if (!comment) {
      throw new NotFoundException('Không tìm thấy bình luận');
    }

    return comment;
  }

  async createComment(user: nguoi_dung, dto: CreateCommentDto) {
    const maNguoiBinhLuan = this.getMaNguoiBinhLuan(
      user,
      dto.ma_nguoi_binh_luan,
    );

    await this.prisma.checkPhongExists(dto.ma_phong);
    await this.prisma.checkUserExists(maNguoiBinhLuan);

    return this.prisma.binh_luan.create({
      data: {
        ma_phong: dto.ma_phong,
        ma_nguoi_binh_luan: maNguoiBinhLuan,
        noi_dung: dto.noi_dung,
        sao_binh_luan: dto.sao_binh_luan,
      },
    });
  }

  async updateComment(user: nguoi_dung, id: number, dto: UpdateCommentDto) {
    const comment = await this.getCommentById(id);

    this.checkQuyen(comment.ma_nguoi_binh_luan, user);

    return this.prisma.binh_luan.update({
      where: { id },
      data: {
        ...(dto.noi_dung !== undefined && { noi_dung: dto.noi_dung }),
        ...(dto.sao_binh_luan !== undefined && {
          sao_binh_luan: dto.sao_binh_luan,
        }),
      },
    });
  }

  async deleteComment(user: nguoi_dung, id: number) {
    const comment = await this.getCommentById(id);

    this.checkQuyen(comment.ma_nguoi_binh_luan, user);

    await this.prisma.binh_luan.delete({
      where: { id },
    });

    return comment;
  }

  async getCommentsByRoom(maPhong: number) {
    await this.prisma.checkPhongExists(maPhong);

    return this.prisma.binh_luan.findMany({
      where: { ma_phong: maPhong },
      orderBy: { id: 'desc' },
    });
  }

  private getMaNguoiBinhLuan(user: nguoi_dung, maNguoiBinhLuan?: number) {
    if (maNguoiBinhLuan === undefined) {
      return user.id;
    }

    if (user.role === 'ADMIN' || maNguoiBinhLuan === user.id) {
      return maNguoiBinhLuan;
    }

    throw new ForbiddenException(
      'Bạn chỉ có thể bình luận bằng tài khoản của mình',
    );
  }

  private checkQuyen(maNguoiBinhLuan: number, user: nguoi_dung) {
    if (user.role === 'ADMIN' || maNguoiBinhLuan === user.id) {
      return;
    }

    throw new ForbiddenException('Bạn không có quyền thao tác bình luận này');
  }

}

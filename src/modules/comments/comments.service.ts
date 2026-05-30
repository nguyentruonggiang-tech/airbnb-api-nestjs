import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { nguoi_dung } from 'src/modules-system/prisma/generated/prisma/client';
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
    const skip = (page - 1) * pageSize;

    const [items, totalItem] = await Promise.all([
      this.prisma.binh_luan.findMany({
        skip,
        take: pageSize,
        orderBy: { id: 'desc' },
      }),
      this.prisma.binh_luan.count(),
    ]);

    return {
      page,
      pageSize,
      totalItem,
      totalPage: Math.ceil(totalItem / pageSize),
      items,
    };
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

    await this.checkPhong(dto.ma_phong);
    await this.checkUserExists(maNguoiBinhLuan);

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
    await this.checkPhong(maPhong);

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

  private async checkPhong(ma_phong: number) {
    const phong = await this.prisma.phong.findUnique({
      where: { id: ma_phong },
      select: { id: true },
    });

    if (!phong) {
      throw new NotFoundException('Không tìm thấy phòng');
    }
  }

  private async checkUserExists(ma_nguoi_binh_luan: number) {
    const user = await this.prisma.nguoi_dung.findUnique({
      where: { id: ma_nguoi_binh_luan },
      select: { id: true },
    });

    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }
  }
}

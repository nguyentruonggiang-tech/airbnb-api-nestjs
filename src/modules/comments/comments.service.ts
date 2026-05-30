import { Injectable, NotFoundException } from '@nestjs/common';
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

  createComment(dto: CreateCommentDto) {
    return this.prisma.binh_luan.create({
      data: {
        ma_phong: dto.ma_phong,
        ma_nguoi_binh_luan: dto.ma_nguoi_binh_luan,
        noi_dung: dto.noi_dung,
        sao_binh_luan: dto.sao_binh_luan,
      },
    });
  }

  async updateComment(id: number, dto: UpdateCommentDto) {
    await this.getCommentById(id);

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

  async deleteComment(id: number) {
    const comment = await this.getCommentById(id);

    await this.prisma.binh_luan.delete({
      where: { id },
    });

    return comment;
  }
}

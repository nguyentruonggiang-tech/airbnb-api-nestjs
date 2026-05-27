import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { Request } from 'express';
import * as bcrypt from 'bcrypt';
import { buildQueryPrisma } from 'src/common/helpers/build-query-prisma.helper';
import { Prisma } from 'src/modules-system/prisma/generated/prisma/client';
import { PrismaService } from 'src/modules-system/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  private readonly userOmit = { pass_word: true } as const;

  constructor(private readonly prisma: PrismaService) {}

  async getUsers(req: Request) {
    const { index, page, pageSize, where } = buildQueryPrisma(req, {
      keywordFields: ['name', 'email', 'phone'],
    });

    const whereInput = where as Prisma.nguoi_dungWhereInput;

    const [items, totalItem] = await Promise.all([
      this.prisma.nguoi_dung.findMany({
        where: whereInput,
        skip: index,
        take: pageSize,
        omit: this.userOmit,
      }),
      this.prisma.nguoi_dung.count({
        where: whereInput,
      }),
    ]);

    return {
      keyword: req.query.keyword,
      page,
      pageSize,
      totalItem,
      totalPage: Math.ceil(totalItem / pageSize),
      items,
    };
  }

  async getUserById(id: number) {
    const user = await this.prisma.nguoi_dung.findUnique({
      where: { id },
      omit: this.userOmit,
    });

    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }

    return user;
  }

  async createUser(dto: CreateUserDto) {
    const { name, email, pass_word, phone, birth_day, gender, role } = dto;

    await this.ensureEmailUnique(email);

    const hashedPassword = await bcrypt.hash(pass_word, 10);

    return this.prisma.nguoi_dung.create({
      data: {
        name,
        email,
        pass_word: hashedPassword,
        phone,
        birth_day: birth_day ? new Date(birth_day) : null,
        gender,
        role: role ?? 'USER',
      },
      omit: this.userOmit,
    });
  }

  async updateUser(id: number, dto: UpdateUserDto) {
    const existingUser = await this.prisma.nguoi_dung.findUnique({
      where: { id },
    });

    if (!existingUser) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }

    if (dto.email && dto.email !== existingUser.email) {
      await this.ensureEmailUnique(dto.email, id);
    }

    const data = await this.buildUpdateData(dto);

    return this.prisma.nguoi_dung.update({
      where: { id },
      data,
      omit: this.userOmit,
    });
  }

  async deleteUser(id: number) {
    const existingUser = await this.prisma.nguoi_dung.findUnique({
      where: { id },
      omit: this.userOmit,
    });

    if (!existingUser) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }

    const [bookingCount, commentCount] = await Promise.all([
      this.prisma.dat_phong.count({
        where: { ma_nguoi_dat: id },
      }),
      this.prisma.binh_luan.count({
        where: { ma_nguoi_binh_luan: id },
      }),
    ]);

    if (bookingCount > 0 || commentCount > 0) {
      throw new ConflictException(
        'Không thể xóa người dùng vì đang có dữ liệu đặt phòng hoặc bình luận liên quan',
      );
    }

    await this.prisma.nguoi_dung.delete({
      where: { id },
    });

    return existingUser;
  }

  private async buildUpdateData(
    dto: UpdateUserDto,
  ): Promise<Prisma.nguoi_dungUpdateInput> {
    const { pass_word, birth_day, ...rest } = dto;
    const data: Prisma.nguoi_dungUpdateInput = { ...rest };

    if (pass_word) {
      data.pass_word = await bcrypt.hash(pass_word, 10);
    }

    if (birth_day !== undefined) {
      data.birth_day = birth_day ? new Date(birth_day) : null;
    }

    return data;
  }

  private async ensureEmailUnique(email: string, excludeId?: number) {
    const emailExists = await this.prisma.nguoi_dung.findUnique({
      where: { email },
    });

    if (emailExists && emailExists.id !== excludeId) {
      throw new ConflictException('Email đã được sử dụng');
    }
  }
}

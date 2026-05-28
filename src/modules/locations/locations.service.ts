import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/modules-system/prisma/prisma.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';

@Injectable()
export class LocationsService {
  constructor(private readonly prisma: PrismaService) {}

  async getLocations() {
    return this.prisma.vi_tri.findMany({
      orderBy: { id: 'desc' },
    });
  }

  async getLocationById(id: number) {
    const location = await this.prisma.vi_tri.findUnique({
      where: { id },
    });

    if (!location) {
      throw new NotFoundException('Không tìm thấy vị trí');
    }

    return location;
  }

  async createLocation(dto: CreateLocationDto) {
    return this.prisma.vi_tri.create({
      data: {
        ten_vi_tri: dto.ten_vi_tri,
        tinh_thanh: dto.tinh_thanh,
        quoc_gia: dto.quoc_gia,
        hinh_anh: dto.hinh_anh ?? null,
      },
    });
  }

  async updateLocation(id: number, dto: UpdateLocationDto) {
    await this.getLocationById(id);

    return this.prisma.vi_tri.update({
      where: { id },
      data: {
        ...dto,
      },
    });
  }

  async deleteLocation(id: number) {
    const location = await this.getLocationById(id);

    await this.prisma.vi_tri.delete({
      where: { id },
    });

    return location;
  }
}

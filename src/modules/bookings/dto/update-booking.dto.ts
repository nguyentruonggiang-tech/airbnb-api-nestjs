import { ApiPropertyOptional, ApiSchema } from '@nestjs/swagger';
import { IsDateString, IsInt, IsOptional, Min } from 'class-validator';

@ApiSchema({ name: 'CapNhatDatPhong' })
export class UpdateBookingDto {
  @ApiPropertyOptional({ example: 1, description: 'Mã phòng' })
  @IsOptional()
  @IsInt({ message: 'Mã phòng phải là số nguyên' })
  @Min(1, { message: 'Mã phòng phải lớn hơn 0' })
  ma_phong?: number;

  @ApiPropertyOptional({ example: '2026-06-01', description: 'Ngày đến (YYYY-MM-DD)' })
  @IsOptional()
  @IsDateString({}, { message: 'Ngày đến phải theo định dạng YYYY-MM-DD' })
  ngay_den?: string;

  @ApiPropertyOptional({ example: '2026-06-05', description: 'Ngày đi (YYYY-MM-DD)' })
  @IsOptional()
  @IsDateString({}, { message: 'Ngày đi phải theo định dạng YYYY-MM-DD' })
  ngay_di?: string;

  @ApiPropertyOptional({ example: 2 })
  @IsOptional()
  @IsInt({ message: 'Số lượng khách phải là số nguyên' })
  @Min(1, { message: 'Số lượng khách phải lớn hơn 0' })
  so_luong_khach?: number;

  @ApiPropertyOptional({ example: 1, description: 'Mã người đặt' })
  @IsOptional()
  @IsInt({ message: 'Mã người đặt phải là số nguyên' })
  @Min(1, { message: 'Mã người đặt phải lớn hơn 0' })
  ma_nguoi_dat?: number;
}

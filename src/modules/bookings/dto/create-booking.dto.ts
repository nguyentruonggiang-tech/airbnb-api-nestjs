import { ApiProperty, ApiPropertyOptional, ApiSchema } from '@nestjs/swagger';
import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  Min,
} from 'class-validator';

@ApiSchema({ name: 'TaoDatPhong' })
export class CreateBookingDto {
  @ApiProperty({ example: 1, description: 'Mã phòng' })
  @IsNotEmpty({ message: 'Mã phòng không được để trống' })
  @IsInt({ message: 'Mã phòng phải là số nguyên' })
  @Min(1, { message: 'Mã phòng phải lớn hơn 0' })
  ma_phong: number;

  @ApiProperty({ example: '2026-06-01', description: 'Ngày đến (YYYY-MM-DD)' })
  @IsNotEmpty({ message: 'Ngày đến không được để trống' })
  @IsDateString({}, { message: 'Ngày đến phải theo định dạng YYYY-MM-DD' })
  ngay_den: string;

  @ApiProperty({ example: '2026-06-05', description: 'Ngày đi (YYYY-MM-DD)' })
  @IsNotEmpty({ message: 'Ngày đi không được để trống' })
  @IsDateString({}, { message: 'Ngày đi phải theo định dạng YYYY-MM-DD' })
  ngay_di: string;

  @ApiPropertyOptional({ example: 2, default: 1 })
  @IsOptional()
  @IsInt({ message: 'Số lượng khách phải là số nguyên' })
  @Min(1, { message: 'Số lượng khách phải lớn hơn 0' })
  so_luong_khach?: number;

  @ApiPropertyOptional({
    example: 1,
    description: 'Mã người đặt. Bỏ qua sẽ lấy từ tài khoản đang đăng nhập',
  })
  @IsOptional()
  @IsInt({ message: 'Mã người đặt phải là số nguyên' })
  @Min(1, { message: 'Mã người đặt phải lớn hơn 0' })
  ma_nguoi_dat?: number;
}

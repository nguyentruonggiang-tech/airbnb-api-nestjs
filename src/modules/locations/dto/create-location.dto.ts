import { ApiProperty, ApiPropertyOptional, ApiSchema } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

@ApiSchema({ name: 'TaoViTri' })
export class CreateLocationDto {
  @ApiProperty({ example: 'Vinhomes Central Park' })
  @IsNotEmpty({ message: 'Tên vị trí không được để trống' })
  @IsString({ message: 'Tên vị trí phải là chuỗi ký tự' })
  ten_vi_tri: string;

  @ApiProperty({ example: 'TP. Hồ Chí Minh' })
  @IsNotEmpty({ message: 'Tỉnh thành không được để trống' })
  @IsString({ message: 'Tỉnh thành phải là chuỗi ký tự' })
  tinh_thanh: string;

  @ApiProperty({ example: 'Việt Nam' })
  @IsNotEmpty({ message: 'Quốc gia không được để trống' })
  @IsString({ message: 'Quốc gia phải là chuỗi ký tự' })
  quoc_gia: string;

  @ApiPropertyOptional({ example: 'location-123' })
  @IsOptional()
  @IsString({ message: 'Hình ảnh phải là chuỗi ký tự' })
  hinh_anh?: string;
}

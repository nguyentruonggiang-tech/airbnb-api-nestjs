import { ApiPropertyOptional, ApiSchema } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

@ApiSchema({ name: 'CapNhatViTri' })
export class UpdateLocationDto {
  @ApiPropertyOptional({ example: 'Vinhomes Central Park' })
  @IsOptional()
  @IsString({ message: 'Tên vị trí phải là chuỗi ký tự' })
  ten_vi_tri?: string;

  @ApiPropertyOptional({ example: 'TP. Hồ Chí Minh' })
  @IsOptional()
  @IsString({ message: 'Tỉnh thành phải là chuỗi ký tự' })
  tinh_thanh?: string;

  @ApiPropertyOptional({ example: 'Việt Nam' })
  @IsOptional()
  @IsString({ message: 'Quốc gia phải là chuỗi ký tự' })
  quoc_gia?: string;

  @ApiPropertyOptional({ example: 'location-123' })
  @IsOptional()
  @IsString({ message: 'Hình ảnh phải là chuỗi ký tự' })
  hinh_anh?: string;
}

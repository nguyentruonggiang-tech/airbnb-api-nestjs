import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional, ApiSchema } from '@nestjs/swagger';

const toBoolean = ({ value }: { value: unknown }) => {
  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (normalized === 'true') return true;
    if (normalized === 'false') return false;
  }

  return value;
};

@ApiSchema({ name: 'TaoPhong' })
export class CreateRoomDto {
  @ApiProperty({ example: 'Căn hộ Landmark 81 view sông' })
  @IsNotEmpty({ message: 'Tên phòng không được để trống' })
  @IsString({ message: 'Tên phòng phải là chuỗi ký tự' })
  ten_phong: string;

  @ApiPropertyOptional({ example: 2, default: 0 })
  @IsOptional()
  @IsInt({ message: 'Số khách phải là số nguyên' })
  @Min(0, { message: 'Số khách không được nhỏ hơn 0' })
  khach?: number;

  @ApiPropertyOptional({ example: 1, default: 0 })
  @IsOptional()
  @IsInt({ message: 'Số phòng ngủ phải là số nguyên' })
  @Min(0, { message: 'Số phòng ngủ không được nhỏ hơn 0' })
  phong_ngu?: number;

  @ApiPropertyOptional({ example: 1, default: 0 })
  @IsOptional()
  @IsInt({ message: 'Số giường phải là số nguyên' })
  @Min(0, { message: 'Số giường không được nhỏ hơn 0' })
  giuong?: number;

  @ApiPropertyOptional({ example: 1, default: 0 })
  @IsOptional()
  @IsInt({ message: 'Số phòng tắm phải là số nguyên' })
  @Min(0, { message: 'Số phòng tắm không được nhỏ hơn 0' })
  phong_tam?: number;

  @ApiPropertyOptional({ example: 'Phòng mới, gần trung tâm, đầy đủ tiện nghi' })
  @IsOptional()
  @IsString({ message: 'Mô tả phải là chuỗi ký tự' })
  mo_ta?: string;

  @ApiPropertyOptional({ example: 1200000, default: 0 })
  @IsOptional()
  @IsNumber({}, { message: 'Giá tiền phải là số' })
  @Min(0, { message: 'Giá tiền không được nhỏ hơn 0' })
  gia_tien?: number;

  @ApiPropertyOptional({ example: true, default: false })
  @IsOptional()
  @Transform(toBoolean)
  @IsBoolean({ message: 'may_giat phải là true hoặc false' })
  may_giat?: boolean;

  @ApiPropertyOptional({ example: true, default: false })
  @IsOptional()
  @Transform(toBoolean)
  @IsBoolean({ message: 'ban_la phải là true hoặc false' })
  ban_la?: boolean;

  @ApiPropertyOptional({ example: true, default: false })
  @IsOptional()
  @Transform(toBoolean)
  @IsBoolean({ message: 'tivi phải là true hoặc false' })
  tivi?: boolean;

  @ApiPropertyOptional({ example: true, default: false })
  @IsOptional()
  @Transform(toBoolean)
  @IsBoolean({ message: 'dieu_hoa phải là true hoặc false' })
  dieu_hoa?: boolean;

  @ApiPropertyOptional({ example: true, default: false })
  @IsOptional()
  @Transform(toBoolean)
  @IsBoolean({ message: 'wifi phải là true hoặc false' })
  wifi?: boolean;

  @ApiPropertyOptional({ example: true, default: false })
  @IsOptional()
  @Transform(toBoolean)
  @IsBoolean({ message: 'bep phải là true hoặc false' })
  bep?: boolean;

  @ApiPropertyOptional({ example: false, default: false })
  @IsOptional()
  @Transform(toBoolean)
  @IsBoolean({ message: 'do_xe phải là true hoặc false' })
  do_xe?: boolean;

  @ApiPropertyOptional({ example: false, default: false })
  @IsOptional()
  @Transform(toBoolean)
  @IsBoolean({ message: 'ho_boi phải là true hoặc false' })
  ho_boi?: boolean;

  @ApiPropertyOptional({ example: false, default: false })
  @IsOptional()
  @Transform(toBoolean)
  @IsBoolean({ message: 'ban_ui phải là true hoặc false' })
  ban_ui?: boolean;

  @ApiPropertyOptional({ example: 'room-123' })
  @IsOptional()
  @IsString({ message: 'Hình ảnh phải là chuỗi ký tự' })
  hinh_anh?: string;

  @ApiProperty({ example: 1, description: 'Mã vị trí của phòng' })
  @IsNotEmpty({ message: 'Mã vị trí không được để trống' })
  @IsInt({ message: 'Mã vị trí phải là số nguyên' })
  @Min(1, { message: 'Mã vị trí phải lớn hơn 0' })
  ma_vi_tri: number;
}

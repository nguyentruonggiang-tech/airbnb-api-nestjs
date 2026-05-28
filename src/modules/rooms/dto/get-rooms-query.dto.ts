import { Transform } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { ApiPropertyOptional, ApiSchema } from '@nestjs/swagger';

const toNumber = ({ value }: { value: unknown }) => {
  if (typeof value === 'number') {
    return value;
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed.length === 0) {
      return undefined;
    }

    const parsed = Number(trimmed);
    return Number.isFinite(parsed) ? parsed : value;
  }

  return value;
};

@ApiSchema({ name: 'LayDanhSachPhongQuery' })
export class GetRoomsQueryDto {
  @ApiPropertyOptional({
    example: 1,
    default: 1,
    description: 'Trang hiện tại',
  })
  @IsOptional()
  @Transform(toNumber)
  @IsInt({ message: 'page phải là số nguyên' })
  @Min(1, { message: 'page phải lớn hơn hoặc bằng 1' })
  page?: number = 1;

  @ApiPropertyOptional({
    example: 10,
    default: 10,
    description: 'Số lượng phòng mỗi trang',
  })
  @IsOptional()
  @Transform(toNumber)
  @IsInt({ message: 'pageSize phải là số nguyên' })
  @Min(1, { message: 'pageSize phải lớn hơn hoặc bằng 1' })
  @Max(100, { message: 'pageSize không được vượt quá 100' })
  pageSize?: number = 10;

  @ApiPropertyOptional({
    description: 'Từ khóa tìm kiếm theo tên phòng hoặc mô tả',
  })
  @IsOptional()
  @IsString({ message: 'keyword phải là chuỗi ký tự' })
  keyword?: string;
}

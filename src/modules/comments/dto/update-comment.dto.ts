import { ApiPropertyOptional, ApiSchema } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

@ApiSchema({ name: 'CapNhatBinhLuan' })
export class UpdateCommentDto {
  @ApiPropertyOptional({ example: 'Phòng ổn, sẽ quay lại', description: 'Nội dung bình luận' })
  @IsOptional()
  @IsString({ message: 'Nội dung phải là chuỗi' })
  noi_dung?: string;

  @ApiPropertyOptional({ example: 4, description: 'Số sao bình luận (1-5)' })
  @IsOptional()
  @IsInt({ message: 'Số sao phải là số nguyên' })
  @Min(1, { message: 'Số sao phải từ 1 đến 5' })
  @Max(5, { message: 'Số sao phải từ 1 đến 5' })
  sao_binh_luan?: number;
}

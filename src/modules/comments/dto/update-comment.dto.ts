import { ApiPropertyOptional, ApiSchema } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString } from 'class-validator';

@ApiSchema({ name: 'CapNhatBinhLuan' })
export class UpdateCommentDto {
  @ApiPropertyOptional({ example: 'Phòng ổn, sẽ quay lại', description: 'Nội dung bình luận' })
  @IsOptional()
  @IsString({ message: 'Nội dung phải là chuỗi' })
  noi_dung?: string;

  @ApiPropertyOptional({ example: 4, description: 'Số sao bình luận' })
  @IsOptional()
  @IsInt({ message: 'Số sao phải là số nguyên' })
  sao_binh_luan?: number;
}

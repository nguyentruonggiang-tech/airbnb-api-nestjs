import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

@ApiSchema({ name: 'TaoBinhLuan' })
export class CreateCommentDto {
  @ApiProperty({ example: 1, description: 'Mã phòng' })
  @IsNotEmpty({ message: 'Mã phòng không được để trống' })
  @IsInt({ message: 'Mã phòng phải là số nguyên' })
  @Min(1, { message: 'Mã phòng phải lớn hơn 0' })
  ma_phong: number;

  @ApiProperty({ example: 1, description: 'Mã người bình luận' })
  @IsNotEmpty({ message: 'Mã người bình luận không được để trống' })
  @IsInt({ message: 'Mã người bình luận phải là số nguyên' })
  @Min(1, { message: 'Mã người bình luận phải lớn hơn 0' })
  ma_nguoi_binh_luan: number;

  @ApiProperty({ example: 'Phòng rất đẹp và sạch sẽ', description: 'Nội dung bình luận' })
  @IsNotEmpty({ message: 'Nội dung không được để trống' })
  @IsString({ message: 'Nội dung phải là chuỗi' })
  noi_dung: string;

  @ApiProperty({ example: 5, description: 'Số sao bình luận' })
  @IsNotEmpty({ message: 'Số sao không được để trống' })
  @IsInt({ message: 'Số sao phải là số nguyên' })
  sao_binh_luan: number;
}

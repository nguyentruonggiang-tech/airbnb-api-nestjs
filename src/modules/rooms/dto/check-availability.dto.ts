import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty } from 'class-validator';

export class CheckAvailabilityDto {
  @ApiProperty({ example: '2026-06-01', description: 'Ngày đến (YYYY-MM-DD)' })
  @IsNotEmpty({ message: 'Ngày đến không được để trống' })
  @IsDateString({}, { message: 'Ngày đến phải theo định dạng YYYY-MM-DD' })
  ngay_den: string;

  @ApiProperty({ example: '2026-06-05', description: 'Ngày đi (YYYY-MM-DD)' })
  @IsNotEmpty({ message: 'Ngày đi không được để trống' })
  @IsDateString({}, { message: 'Ngày đi phải theo định dạng YYYY-MM-DD' })
  ngay_di: string;
}

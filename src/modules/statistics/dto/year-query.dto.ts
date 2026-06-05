import { ApiProperty } from '@nestjs/swagger';
import { ApiSchema } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, Max, Min } from 'class-validator';

@ApiSchema({ name: 'ThongKeNamQuery' })
export class YearQueryDto {
  @ApiProperty({ example: 2024, description: 'Năm cần thống kê' })
  @Transform(({ value }: { value: unknown }) => Number(value))
  @IsInt({ message: 'nam phải là số nguyên' })
  @Min(2000, { message: 'nam không được nhỏ hơn 2000' })
  @Max(2100, { message: 'nam không được lớn hơn 2100' })
  nam: number;
}

import { ApiPropertyOptional, ApiSchema } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsIn,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import {
  GENDER_VALUES,
  type Gender,
} from 'src/common/constant/gender.constant';

@ApiSchema({ name: 'CapNhatProfile' })
export class UpdateProfileDto {
  @ApiPropertyOptional({ example: 'Nguyen Van A' })
  @IsOptional()
  @IsString({ message: 'Họ tên phải là chuỗi ký tự' })
  name?: string;

  @ApiPropertyOptional({ example: 'user@gmail.com' })
  @IsOptional()
  @IsEmail({}, { message: 'Email không đúng định dạng' })
  email?: string;

  @ApiPropertyOptional({ example: 'Password@123', minLength: 6 })
  @IsOptional()
  @IsString({ message: 'Mật khẩu phải là chuỗi ký tự' })
  @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
  pass_word?: string;

  @ApiPropertyOptional({ example: '0901234567' })
  @IsOptional()
  @IsString({ message: 'Số điện thoại phải là chuỗi ký tự' })
  phone?: string;

  @ApiPropertyOptional({ example: '1990-01-15' })
  @IsOptional()
  @IsDateString({}, { message: 'Ngày sinh phải theo định dạng YYYY-MM-DD' })
  birth_day?: string;

  @ApiPropertyOptional({
    example: 'Nam',
    enum: ['Nam', 'Nữ'],
    description: 'Giới tính: Nam hoặc Nữ',
  })
  @IsOptional()
  @IsIn(GENDER_VALUES, { message: 'Giới tính chỉ được là Nam hoặc Nữ' })
  gender?: Gender;
}

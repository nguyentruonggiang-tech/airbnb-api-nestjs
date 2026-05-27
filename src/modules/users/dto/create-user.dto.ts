import { ApiProperty, ApiPropertyOptional, ApiSchema } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import {
  GENDER_VALUES,
  type Gender,
} from 'src/common/constant/gender.constant';

@ApiSchema({ name: 'ThongTinNguoiDung' })
export class CreateUserDto {
  @ApiProperty({ example: 'Nguyen Van A' })
  @IsNotEmpty({ message: 'Họ tên không được để trống' })
  @IsString({ message: 'Họ tên phải là chuỗi ký tự' })
  name: string;
  @ApiProperty({ example: 'user@gmail.com' })
  @IsNotEmpty({ message: 'Email không được để trống' })
  @IsEmail({}, { message: 'Email không đúng định dạng' })
  email: string;
  @ApiProperty({ example: 'Password@123', minLength: 6 })
  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  @IsString({ message: 'Mật khẩu phải là chuỗi ký tự' })
  @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
  pass_word: string;
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
  @ApiPropertyOptional({ example: 'USER' })
  @IsOptional()
  @IsString({ message: 'Vai trò phải là chuỗi ký tự' })
  role?: string;
}

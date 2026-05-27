import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Post,
    Put,
    Req,
} from '@nestjs/common';
import type { Request } from 'express';
import {
    ApiBearerAuth,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiQuery,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public.decorator';
import { SuccessMessage } from 'src/common/decorators/success-message.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@ApiTags('NguoiDung')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get()
    @Public()
    @ApiOperation({ summary: 'Lấy danh sách người dùng (phân trang)' })
    @ApiQuery({ name: 'pageIndex', required: false, type: Number, example: 1, description: 'Trang hiện tại' })
    @ApiQuery({ name: 'pageSize', required: false, type: Number, example: 10, description: 'Số bản ghi mỗi trang' })
    @ApiQuery({
        name: 'keyword',
        required: false,
        type: String,
        example: 'Nguyen',
        description: 'Tìm theo name, email hoặc phone',
    })
    @ApiOkResponse({ description: 'Danh sách người dùng phân trang (không có pass_word)' })
    @SuccessMessage('Lấy danh sách người dùng thành công')
    getUsers(@Req() req: Request) {
        return this.usersService.getUsers(req);
    }

    @Get(':id')
    @Public()
    @ApiOperation({ summary: 'Lấy thông tin người dùng theo id' })
    @ApiOkResponse({ description: 'Thông tin người dùng' })
    @ApiNotFoundResponse({ description: 'Không tìm thấy người dùng' })
    @SuccessMessage('Lấy thông tin người dùng thành công')
    getUserById(@Param('id', ParseIntPipe) id: number) {
        return this.usersService.getUserById(id);
    }

    @Post()
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Tạo người dùng' })
    @ApiOkResponse({
        description: 'Tạo người dùng thành công',
    })
    @ApiUnauthorizedResponse({
        description: 'Chưa đăng nhập hoặc token không hợp lệ',
    })
    @SuccessMessage('Tạo người dùng thành công')
    createUser(@Body() createUserDto: CreateUserDto) {
        return this.usersService.createUser(createUserDto);
    }

    @Put(':id')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Cập nhật người dùng' })
    @ApiOkResponse({
        description: 'Cập nhật người dùng thành công',
    })
    @ApiNotFoundResponse({ description: 'Không tìm thấy người dùng' })
    @ApiUnauthorizedResponse({
        description: 'Chưa đăng nhập hoặc token không hợp lệ',
    })
    @SuccessMessage('Cập nhật người dùng thành công')
    updateUser(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateUserDto: UpdateUserDto,
    ) {
        return this.usersService.updateUser(id, updateUserDto);
    }

    @Delete(':id')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Xóa người dùng' })
    @ApiOkResponse({ description: 'Xóa người dùng thành công' })
    @ApiNotFoundResponse({ description: 'Không tìm thấy người dùng' })
    @ApiUnauthorizedResponse({
        description: 'Chưa đăng nhập hoặc token không hợp lệ',
    })
    @SuccessMessage('Xóa người dùng thành công')
    deleteUser(@Param('id', ParseIntPipe) id: number) {
        return this.usersService.deleteUser(id);
    }
}

import {
    Body,
    Controller,
    DefaultValuePipe,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Post,
    Put,
    Query,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiForbiddenResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiParam,
    ApiQuery,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public.decorator';
import { SuccessMessage } from 'src/common/decorators/success-message.decorator';
import { User } from 'src/common/decorators/user.decorator';
import type { nguoi_dung } from 'src/modules-system/prisma/generated/prisma/client';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@ApiTags('BinhLuan')
@Controller('binh-luan')
export class CommentsController {
    constructor(private readonly commentsService: CommentsService) { }

    @Get()
    @Public()
    @ApiOperation({ summary: 'Lấy tất cả bình luận' })
    @ApiOkResponse({ description: 'Lấy danh sách bình luận thành công' })
    @SuccessMessage('Lấy danh sách bình luận thành công')
    getComments() {
        return this.commentsService.getComments();
    }

    @Get('phan-trang')
    @Public()
    @ApiOperation({ summary: 'Lấy danh sách bình luận phân trang' })
    @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
    @ApiQuery({ name: 'pageSize', required: false, type: Number, example: 10 })
    @ApiOkResponse({ description: 'Lấy danh sách bình luận phân trang thành công' })
    @SuccessMessage('Lấy danh sách bình luận phân trang thành công')
    getCommentsByPage(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
        @Query('pageSize', new DefaultValuePipe(10), ParseIntPipe) pageSize: number,
    ) {
        return this.commentsService.getCommentsByPage(page, pageSize);
    }

    @Get(':id')
    @Public()
    @ApiOperation({ summary: 'Lấy thông tin bình luận theo id' })
    @ApiParam({ name: 'id', type: Number, example: 1, description: 'ID bình luận' })
    @ApiOkResponse({ description: 'Lấy thông tin bình luận thành công' })
    @ApiNotFoundResponse({ description: 'Không tìm thấy bình luận' })
    @SuccessMessage('Lấy thông tin bình luận thành công')
    getCommentById(@Param('id', ParseIntPipe) id: number) {
        return this.commentsService.getCommentById(id);
    }

    @Post()
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Tạo bình luận mới' })
    @ApiOkResponse({ description: 'Tạo bình luận thành công' })
    @ApiNotFoundResponse({ description: 'Không tìm thấy phòng hoặc người dùng' })
    @ApiUnauthorizedResponse({ description: 'Chưa đăng nhập hoặc token không hợp lệ' })
    @ApiForbiddenResponse({
        description: 'Không có quyền bình luận bằng tài khoản người khác',
    })
    @SuccessMessage('Tạo bình luận thành công')
    createComment(
        @User() user: nguoi_dung,
        @Body() createCommentDto: CreateCommentDto,
    ) {
        return this.commentsService.createComment(user, createCommentDto);
    }

    @Put(':id')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Cập nhật bình luận' })
    @ApiParam({ name: 'id', type: Number, example: 1, description: 'ID bình luận' })
    @ApiOkResponse({ description: 'Cập nhật bình luận thành công' })
    @ApiNotFoundResponse({ description: 'Không tìm thấy bình luận' })
    @ApiUnauthorizedResponse({ description: 'Chưa đăng nhập hoặc token không hợp lệ' })
    @ApiForbiddenResponse({ description: 'Không có quyền cập nhật bình luận này' })
    @SuccessMessage('Cập nhật bình luận thành công')
    updateComment(
        @User() user: nguoi_dung,
        @Param('id', ParseIntPipe) id: number,
        @Body() updateCommentDto: UpdateCommentDto,
    ) {
        return this.commentsService.updateComment(user, id, updateCommentDto);
    }

    @Delete(':id')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Xóa bình luận' })
    @ApiParam({ name: 'id', type: Number, example: 1, description: 'ID bình luận' })
    @ApiOkResponse({ description: 'Xóa bình luận thành công' })
    @ApiNotFoundResponse({ description: 'Không tìm thấy bình luận' })
    @ApiUnauthorizedResponse({ description: 'Chưa đăng nhập hoặc token không hợp lệ' })
    @ApiForbiddenResponse({ description: 'Không có quyền xóa bình luận này' })
    @SuccessMessage('Xóa bình luận thành công')
    deleteComment(
        @User() user: nguoi_dung,
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.commentsService.deleteComment(user, id);
    }

    @Get('lay-binh-luan-theo-phong/:maPhong')
    @Public()
    @ApiOperation({ summary: 'Lấy danh sách bình luận theo phòng' })
    @ApiParam({
        name: 'maPhong',
        type: Number,
        example: 1,
        description: 'Mã phòng',
    })
    @ApiOkResponse({ description: 'Lấy danh sách bình luận theo phòng thành công' })
    @ApiNotFoundResponse({ description: 'Không tìm thấy phòng' })
    @SuccessMessage('Lấy danh sách bình luận theo phòng thành công')
    getCommentsByRoom(@Param('maPhong', ParseIntPipe) maPhong: number) {
        return this.commentsService.getCommentsByRoom(maPhong);
    }
}

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
    ApiOkResponse,
    ApiOperation,
    ApiParam,
    ApiQuery,
    ApiTags,
} from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public.decorator';
import { SuccessMessage } from 'src/common/decorators/success-message.decorator';
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
    @SuccessMessage('Lấy thông tin bình luận thành công')
    getCommentById(@Param('id', ParseIntPipe) id: number) {
        return this.commentsService.getCommentById(id);
    }

    @Post()
    @Public()
    @ApiOperation({ summary: 'Tạo bình luận mới' })
    @ApiOkResponse({ description: 'Tạo bình luận thành công' })
    @SuccessMessage('Tạo bình luận thành công')
    createComment(@Body() createCommentDto: CreateCommentDto) {
        return this.commentsService.createComment(createCommentDto);
    }

    @Put(':id')
    @Public()
    @ApiOperation({ summary: 'Cập nhật bình luận' })
    @ApiParam({ name: 'id', type: Number, example: 1, description: 'ID bình luận' })
    @ApiOkResponse({ description: 'Cập nhật bình luận thành công' })
    @SuccessMessage('Cập nhật bình luận thành công')
    updateComment(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateCommentDto: UpdateCommentDto,
    ) {
        return this.commentsService.updateComment(id, updateCommentDto);
    }

    @Delete(':id')
    @Public()
    @ApiOperation({ summary: 'Xóa bình luận' })
    @ApiParam({ name: 'id', type: Number, example: 1, description: 'ID bình luận' })
    @ApiOkResponse({ description: 'Xóa bình luận thành công' })
    @SuccessMessage('Xóa bình luận thành công')
    deleteComment(@Param('id', ParseIntPipe) id: number) {
        return this.commentsService.deleteComment(id);
    }
}

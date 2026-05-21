import { Controller, Body, Post, Res, Req, Get } from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import {
    ApiCreatedResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { SigninDto } from './dto/signin.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { User } from 'src/common/decorators/user.decorator';
import type { nguoi_dung } from 'src/modules-system/prisma/generated/prisma/client';
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('signup')
    @Public()
    @ApiOperation({ summary: 'Đăng ký tài khoản' })
    @ApiCreatedResponse({ description: 'Đăng ký tài khoản thành công' })
    async signup(@Body() signupDto: SignupDto) {
        return this.authService.signup(signupDto);
    }

    @Post('signin')
    @Public()
    @ApiOperation({ summary: 'Đăng nhập' })
    @ApiOkResponse({ description: 'Set cookie accessToken, refreshToken. Body trả true.' })
    async signin(
        @Body() signinDto: SigninDto, 
        @Res({ passthrough: true })
        res: Response
    ) {
        const result = await this.authService.signin(signinDto);
        res.cookie('accessToken', result.accessToken);
        res.cookie('refreshToken', result.refreshToken);
        return true;
    }

    @Post('refresh-token')
    @Public()
    @ApiOperation({ summary: 'Làm mới accessToken' })
    @ApiOkResponse({ description: 'Đọc cookie cũ, set cookie mới. Body trả true.' })
    @ApiUnauthorizedResponse({ description: 'Thiếu hoặc token không hợp lệ' })
    async refreshToken(
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response,
    ) {
        const result = await this.authService.refreshToken(req);
        res.cookie('accessToken', result.accessToken);
        res.cookie('refreshToken', result.refreshToken);
        return true;
    }

    @Get('get-info')
    @ApiOperation({ summary: 'Lấy thông tin user đang đăng nhập' })
    @ApiOkResponse({ description: 'Trả user hiện tại (không có pass_word)' })
    @ApiUnauthorizedResponse({ description: 'Chưa đăng nhập hoặc token không hợp lệ' })
    getInfo(@User() user: nguoi_dung) {
        return user;
    }
}

import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/modules-system/prisma/prisma.service';
import { SignupDto } from './dto/signup.dto';
import { TokenService } from 'src/modules-system/token/token.service';
import * as bcrypt from 'bcrypt';
import { SigninDto } from './dto/signin.dto';
import { Request } from 'express';

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly tokenService: TokenService
    ) {}

    async signup(signupDto: SignupDto) {
        const { name, email, pass_word, phone, birth_day, gender } = signupDto;

        const emailExists = await this.prisma.nguoi_dung.findUnique({
            where: {
                email,
            },
        });

        if (emailExists) {
            throw new ConflictException('Email đã được sử dụng');
        }

        const hashedPassword = await bcrypt.hash(pass_word, 10);
        const user = await this.prisma.nguoi_dung.create({
            data: {
                name,
                email,
                pass_word: hashedPassword,
                phone,
                birth_day: birth_day ? new Date(birth_day) : null,
                gender,
                role: 'USER',
            },
            omit: {
                pass_word: true,
            },
        });

        return user;
    }

    async signin(signinDto: SigninDto) {
        const { email, pass_word } = signinDto;
        const userExists = await this.prisma.nguoi_dung.findUnique({
            where: { email },
            omit: {
                pass_word: false,
            },
        });

        if (!userExists) {
            throw new BadRequestException('Người dùng không tồn tại, vui lòng đăng ký');
        }
        const isPasswordValid = await bcrypt.compare(pass_word, userExists.pass_word);
        if (!isPasswordValid) {
            throw new BadRequestException('Email hoặc mật khẩu chưa đúng');
        }
        const accessToken = this.tokenService.createAccessToken(userExists.id);
        const refreshToken = this.tokenService.createRefreshToken(userExists.id);
        return { accessToken, refreshToken };
    }

    async refreshToken(req: Request) {
        const { accessToken, refreshToken } = req.cookies;

        if (!accessToken) {
            throw new UnauthorizedException('Không có accessToken để kiểm tra');
        }

        if (!refreshToken) {
            throw new UnauthorizedException('Không có refreshToken để kiểm tra');
        }

        const decodeAccessToken = this.tokenService.verifyAccessToken(
            accessToken,
            { ignoreExpiration: true },
        ) as { userId: number };

        const decodeRefreshToken = this.tokenService.verifyRefreshToken(
            refreshToken,
        ) as { userId: number };

        if (decodeAccessToken.userId !== decodeRefreshToken.userId) {
            throw new UnauthorizedException('Token không hợp lệ');
        }

        const userExists = await this.prisma.nguoi_dung.findUnique({
            where: { id: decodeAccessToken.userId },
        });

        if (!userExists) {
            throw new UnauthorizedException('Không tìm thấy user trong db');
        }

        const accessTokenNew = this.tokenService.createAccessToken(userExists.id);
        const refreshTokenNew = this.tokenService.createRefreshToken(userExists.id);

        return {
            accessToken: accessTokenNew,
            refreshToken: refreshTokenNew,
        };
    }
}

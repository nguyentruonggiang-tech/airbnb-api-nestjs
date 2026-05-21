import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { TokenExpiredError } from 'jsonwebtoken';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { PrismaService } from 'src/modules-system/prisma/prisma.service';
import { TokenService } from 'src/modules-system/token/token.service';

@Injectable()
export class ProtectGuard implements CanActivate {
    constructor(
        private readonly tokenService: TokenService,
        private readonly prisma: PrismaService,
        private readonly reflector: Reflector,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (isPublic) {
            return true;
        }

        try {
            const req = context.switchToHttp().getRequest();
            const { accessToken } = req.cookies;

            if (!accessToken) {
                throw new UnauthorizedException('Không có token');
            }

            const decode = this.tokenService.verifyAccessToken(accessToken) as {
                userId: number;
            };

            const userExists = await this.prisma.nguoi_dung.findUnique({
                where: { id: decode.userId },
                omit: {
                    pass_word: true,
                },
            });

            if (!userExists) {
                throw new UnauthorizedException('Người dùng không tồn tại');
            }

            req.user = userExists;
            return true;
        } catch (error) {
            if (error instanceof TokenExpiredError) {
                throw new ForbiddenException(error.message);
            }

            if (
                error instanceof UnauthorizedException ||
                error instanceof ForbiddenException
            ) {
                throw error;
            }

            throw new UnauthorizedException('Token không hợp lệ');
        }
    }
}
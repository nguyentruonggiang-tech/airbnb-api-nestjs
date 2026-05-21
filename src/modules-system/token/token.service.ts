import { BadRequestException, Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import {
    ACCESS_EXPIRES_IN,
    ACCESS_TOKEN_SECRET,
    REFRESH_EXPIRES_IN,
    REFRESH_TOKEN_SECRET,
} from 'src/common/constant/app.constant';

@Injectable()
export class TokenService {
    createAccessToken(userId: number): string {
        if (!userId) {
            throw new BadRequestException('Không có userId để tạo token');
        }

        
        const accessToken = jwt.sign(
            { userId: userId },
            ACCESS_TOKEN_SECRET as string, 
            {
                expiresIn: ACCESS_EXPIRES_IN as jwt.SignOptions['expiresIn'],
            },
        );

        return accessToken  ;
    }

    createRefreshToken(userId: number): string {
        if (!userId) {
            throw new BadRequestException('Không có userId để tạo token');
        }

        const refreshToken = jwt.sign(
            { userId: userId },
            REFRESH_TOKEN_SECRET as string,
            {
                expiresIn: REFRESH_EXPIRES_IN as jwt.SignOptions['expiresIn'],
            },
        );

        return refreshToken;
    }

    verifyAccessToken(accessToken: string, option?: jwt.VerifyOptions){
        const decode = jwt.verify(
            accessToken,
            ACCESS_TOKEN_SECRET as string,
            option,
        );
        return decode;
    }

    verifyRefreshToken(refreshToken: string, option?: jwt.VerifyOptions){
        const decode = jwt.verify(
            refreshToken,
            REFRESH_TOKEN_SECRET as string,
            option,
        );
        return decode;
    }
}
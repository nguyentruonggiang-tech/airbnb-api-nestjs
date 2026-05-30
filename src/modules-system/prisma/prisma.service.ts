import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { DATABASE_URL } from '../../common/constant/app.constant';
import { PrismaClient } from './generated/prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
    constructor() {
        const url = new URL(DATABASE_URL as string);
        console.log(url);
        const params = new URLSearchParams(url.search);
        const sslAccept = params.get('sslaccept');
        const adapter = new PrismaMariaDb({
            user: url.username,
            password: url.password,
            host: url.hostname,
            port: Number(url.port),
            database: url.pathname.substring(1),
            ...(sslAccept ? { ssl: { rejectUnauthorized: sslAccept === 'strict' } } : {}),
            ...(params.get('connection_limit') ? { connectionLimit: Number(params.get('connection_limit')) } : {}),
            connectTimeout: 30000,
        });

        super({ adapter });
    }

    async checkPhongExists(maPhong: number): Promise<void> {
        const phong = await this.phong.findUnique({
            where: { id: maPhong },
            select: { id: true },
        });

        if (!phong) throw new NotFoundException('Không tìm thấy phòng');
    }

    async checkUserExists(maNguoiDung: number): Promise<void> {
        const user = await this.nguoi_dung.findUnique({
            where: { id: maNguoiDung },
            select: { id: true },
        });

        if (!user) throw new NotFoundException('Không tìm thấy người dùng');
    }

    isForeignKeyConstraintError(error: unknown): boolean {
        if (!error || typeof error !== 'object') return false;
        return (error as { code?: string }).code === 'P2003';
    }

    async onModuleInit() {
        try {
            await this.$queryRaw`SELECT 1+1 AS result`;
            console.log('✅ [PRISMA] Connection has been established successfully.');
        } catch (error) {
            console.error('❌ [PRISMA] Unable to connect to the database:', error);
        }
    }
}

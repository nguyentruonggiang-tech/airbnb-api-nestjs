import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './modules-system/prisma/prisma.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ProtectGuard } from './common/guards/protect.guard';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { TokenModule } from './modules-system/token/token.module';
import { CloudinaryModule } from './modules-system/cloudinary/cloudinary.module';
import { AuthModule } from './modules/auth/auth.module';
import { BookingsModule } from './modules/bookings/bookings.module';
import { CommentsModule } from './modules/comments/comments.module';
import { LocationsModule } from './modules/locations/locations.module';
import { RoomsModule } from './modules/rooms/rooms.module';
import { UsersModule } from './modules/users/users.module';
import { StatisticsModule } from './modules/statistics/statistics.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        PrismaModule,
        AuthModule,
        UsersModule,
        LocationsModule,
        RoomsModule,
        BookingsModule,
        CommentsModule,
        StatisticsModule,
        TokenModule,
        CloudinaryModule,
    ],
    providers: [
        {
            provide: APP_GUARD,
            useClass: ProtectGuard,
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: ResponseInterceptor,
        },
    ],
})
export class AppModule { }

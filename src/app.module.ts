import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { BookingsModule } from './modules/bookings/bookings.module';
import { CommentsModule } from './modules/comments/comments.module';
import { LocationsModule } from './modules/locations/locations.module';
import { RoomsModule } from './modules/rooms/rooms.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UsersModule,
    LocationsModule,
    RoomsModule,
    BookingsModule,
    CommentsModule,
  ],
})
export class AppModule {}

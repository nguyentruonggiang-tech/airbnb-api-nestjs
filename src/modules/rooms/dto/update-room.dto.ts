import { PartialType } from '@nestjs/swagger';
import { ApiSchema } from '@nestjs/swagger';
import { CreateRoomDto } from './create-room.dto';

@ApiSchema({ name: 'CapNhatPhong' })
export class UpdateRoomDto extends PartialType(CreateRoomDto) {}

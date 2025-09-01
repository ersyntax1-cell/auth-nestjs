import { forwardRef, Module } from '@nestjs/common';
import { DeviceService } from './device.service';
import { DeviceController } from './device.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Device, DeviceSchema } from './schema/device.schema';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    imports: [
        MongooseModule.forFeature([{
            name: Device.name,
            schema: DeviceSchema
        }]),
        forwardRef(() => AuthModule),
    ],
    providers: [DeviceService],
    controllers: [DeviceController],
    exports: [DeviceService]
})
export class DeviceModule {}

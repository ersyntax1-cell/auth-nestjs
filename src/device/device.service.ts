import {
    BadRequestException,
    forwardRef,
    Inject,
    Injectable,
    NotFoundException
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Device, DeviceDocument } from './schema/device.schema';
import { Model } from 'mongoose';
import { generateRandomCode } from 'src/utils/random.utils';
import { AuthService } from 'src/auth/auth.service';
import { DeviceDto } from './dto/device.dto';
import { WsGetaway } from 'src/ws/ws-gateway/ws.gateway';

@Injectable()
export class DeviceService {
    constructor(
        @InjectModel(Device.name) private readonly deviceModel: Model<DeviceDocument>,
        private readonly authService: AuthService,

        @Inject(forwardRef(() => WsGetaway))
        private readonly wsGateway: WsGetaway,
    ) { }

    async createDevice(
        deviceId: string,
        code: string
    ) {
        const newDevice = new this.deviceModel({
            deviceId: deviceId,
            deviceModel: 'deviceModel',
            isActive: false,
            code,
        });

        return await newDevice.save();
    }

    async checkDevice(deviceId: string) {
        const device = await this.deviceModel.findOne({ deviceId });

        if (!device) {
            const code = generateRandomCode(8);

            await this.createDevice(deviceId, code)

            return { status: 'new', code };
        }

        if (!device.isActive) {
            return { status: 'inactive', code: device.code };
        }

        const deviceLogin = await this.authService.deviceLogin();
        const access_token = deviceLogin.access_token;
        
        return { status: 'active', token: access_token };
    }

    async approveDeviceByCode(code: string) {
        const device = await this.deviceModel.findOne({ code });

        if (!device) {
            throw new NotFoundException(`Device with code ${code} not found`);
        }

        if (device.isActive) {
            throw new BadRequestException('Device is already approved');
        }

        device.isActive = true;
        await device.save();

        const socket = this.wsGateway.getSocketByDeviceId(device.deviceId);

        if (socket) {
            socket.emit('checkDevice', {
                message: 'Your device is now active!',
                isActive: true,
            });
        }

        const deviceLogin = await this.authService.deviceLogin();
        const access_token = deviceLogin.access_token;

        return {
            token: access_token
        };
    }

}

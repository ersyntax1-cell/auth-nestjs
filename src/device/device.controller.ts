import {
    Controller,
    Get,
    Param,
    Post,
    UseGuards
} from '@nestjs/common';
import { DeviceService } from './device.service';
import { RoleDecorator } from 'src/auth/decorators/roles.decorator';
import { Roles } from 'src/auth/dto/roles.enum';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from 'src/auth/guards/roles.guard';

@Controller('device')
export class DeviceController {
    constructor(
        private readonly deviceService: DeviceService,
    ) { }
    
    @Get('check-device/:deviceId')
    async checkDevice(@Param('deviceId') deviceId: string) {
        return this.deviceService.checkDevice(deviceId);
    }
    
    @UseGuards(AuthGuard('jwt'), RoleGuard)
    @RoleDecorator(Roles.Admin)
    @Post('approve-device/:code')
    async approveDevice (@Param('code') code: string) {
        return this.deviceService.approveDeviceByCode(code);
    }

    @UseGuards(AuthGuard('jwt'), RoleGuard)
    @RoleDecorator(Roles.Admin)
    @Get('get-devices')
    async getDevices () {
        return this.deviceService.getAllDevices();
    }
}

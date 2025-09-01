import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    UseGuards
} from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterDto } from 'src/auth/dto/register.dto';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from 'src/auth/guards/roles.guard';
import { RoleDecorator } from 'src/auth/decorators/roles.decorator';
import { Roles } from 'src/auth/dto/roles.enum';
import { UpdateUserDto } from './dto/update-user.dto';
import { DeviceService } from 'src/device/device.service';

@Controller('user')
@UseGuards(AuthGuard('jwt'), RoleGuard)
@RoleDecorator(Roles.Admin)
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly deviceService: DeviceService
    ) { }

    @Post('create-basic')
    async createUser (@Body() body: RegisterDto) {
        const user = await this.userService.createBasic(body);
        return user;
    }

    @Get('get-users')
    async findAllUsers () {
        return await this.userService.findAllUsers();
    }

    @Post('update-user/:id')
    async updateUser (
        @Param('id') id: string,
        @Body() body: UpdateUserDto
    ) {
        return await this.userService.updateUser(id, body)
    }

    @Post("delete-user/:id")
    async deleteUser (@Param('id') id: string) {
        return await this.userService.deleteUser(id);
    }

    @Post('approve-device')
    async approveDevice (@Body() body: {code: string}) {
        return this.deviceService.approveDeviceByCode(body.code);
    }
}

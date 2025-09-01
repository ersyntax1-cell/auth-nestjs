import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserDocument } from 'src/user/schemas/user.schema';
import { UserService } from 'src/user/user.service';
import { Roles } from './dto/roles.enum';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService
    ){}

    async validateUser (email: string, password: string): Promise<UserDocument | null> {
        return this.userService.validateUser(email, password)
    }

    async login (user: UserDocument) {
        const payload = { email: user.email, sub: user._id, role: user.role };
        return {
            access_token: this.jwtService.sign(payload),
        }
    }

    async deviceLogin () {
        const payload = { deviceModel: 'samsung', role: [Roles.User] };
        return {
            access_token: this.jwtService.sign(payload)
        }
    }
}

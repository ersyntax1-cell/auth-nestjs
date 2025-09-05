import {
    Body,
    Controller,
    Get,
    Post,
    Req,
    Request,
    Res,
    UnauthorizedException,
    UseGuards
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import {
    ApiOperation,
    ApiResponse,
    ApiTags
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import type { Response } from 'express';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private usersService: UserService
    ) { }

    @Post('register')

    @ApiOperation({ summary: "Register user function" })
    @ApiResponse({
        status: 201, description: "User is registered", schema: {
            example: {
                email: "*your email*",
                password: "*your password*"
            }
        }
    })
    async register(@Body() body: RegisterDto) {
        const user = await this.usersService.create(body);

        return {
            id: user._id,
            email: user.email,
            role: user.role,
        }
    }

    @Post('login')

    @ApiOperation({ summary: "Login user function" })
    @ApiResponse({
        status: 201, description: "User is logined", schema: {
            example: {
                email: "*your email*",
                password: "*your password*"
            }
        }
    })
    async login(@Body() body: LoginDto) {
        const user = await this.authService.validateUser(body.email, body.password);

        if (!user) {
            throw new UnauthorizedException('The email or password is incorrect.');
        }

        return this.authService.login(user);
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')

    @ApiOperation({ summary: "Get user's profile" })
    @ApiResponse({ status: 200, description: "User profile received" })
    getProfile(@Request() req: any) {
        return req.user;
    }

    @Get('google')
    @UseGuards(AuthGuard('google'))
    async googleAuth() { }

    @Get('google/redirect')
    @UseGuards(AuthGuard('google'))
    async googleAuthRedirect(@Req() req, @Res() res: Response) {
        const token = await this.authService.loginWithGoogle(req.user);

        res.redirect(`http://localhost:5173/auth/redirect?token=${token}`);
    }
}

import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PostModule } from './post/post.module';
import { UserService } from './user/user.service';
import { UserModule } from './user/user.module';
import { Roles } from './auth/dto/roles.enum';
import { WsModule } from './ws/ws.module';
import { DeviceModule } from './device/device.module';
import { WsGetaway } from './ws/ws-gateway/ws.gateway';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot('mongodb://localhost:27017/database'),
    AuthModule,
    PostModule,
    UserModule,
    WsModule,
    DeviceModule,
    MailModule,
  ],
  controllers: [AppController],
  providers: [AppService, ConfigService, WsGetaway],
})

export class AppModule implements OnModuleInit {
  constructor(
    private readonly usersService: UserService,
    private readonly configService: ConfigService
  ) { }

  async onModuleInit() {
    const adminEmail = this.configService.get<string>('ADMIN_EMAIL') ?? 'admin@mail.ru';
    const adminPassword = this.configService.get<string>('ADMIN_PASSWORD') ?? 'admin1';

    const admin = await this.usersService.findByEmail(adminEmail);
    
    if (admin) {
      return;
    }
    
    await this.usersService.create({
      email: adminEmail,
      password: adminPassword,
      role: [Roles.Admin]
    });
  }
}

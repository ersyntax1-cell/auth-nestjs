import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MongooseModule } from '@nestjs/mongoose';
import { VerificationCode, VerificationCodeSchema } from './schema/verification-code.schema';
import { MailController } from './mail.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{
      name: VerificationCode.name,
      schema: VerificationCodeSchema
    }])
  ],
  providers: [MailService],
  exports: [MailService],
  controllers: [MailController]
})
export class MailModule {}

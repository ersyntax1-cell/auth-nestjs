import { Body, Controller, Post } from '@nestjs/common';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
    constructor(private readonly mailService: MailService){}

    @Post('send-code')
    async sendCode (@Body() body: { email: string }) {
        return this.mailService.createVerificationCode(body.email);
    }
}

import { BadRequestException, Injectable } from '@nestjs/common';
import * as nodemailer from "nodemailer";
import { Transporter } from 'nodemailer';
import { SendEmailDto } from './dto/send-email.dto';
import { InjectModel } from '@nestjs/mongoose';
import { VerificationCode, VerificationCodeDocument } from './schema/verification-code.schema';
import { Model } from 'mongoose';

@Injectable()
export class MailService {
    private transporter: Transporter;

    constructor(
        @InjectModel(VerificationCode.name) private readonly verificationCodeModel: Model<VerificationCodeDocument>
    ) {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.USER_MAIL,
                pass: process.env.USER_PASS,
            }
        })
    }

    private async sendMail(options: SendEmailDto) {
        return await this.transporter.sendMail({
            from: process.env.USER_MAIL,
            ...options,
        });
    }

    async createVerificationCode(
        email: string
    ) {
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

        const newCode = new this.verificationCodeModel({
            email: email,
            code: code,
            expiresAt,
        });

        await newCode.save();

        await this.sendMail({
            to: email,
            subject: 'Registration confirmation',
            text: `Your confirmation code: ${code}`,
            html: `<p>Your confirmation code: <b>${code}</b></p>`,
        });

        return { message: 'Verification code sent' };
    }

    async verifyCode(
        email: string,
        code: string
    ) {
        const checkCode = await this.verificationCodeModel.findOne({ email, code });

        if (!checkCode) {
            throw new BadRequestException('Invalid verification code');
        }

        if (checkCode.expiresAt < new Date()) {
            throw new BadRequestException('Verification code expired');
        }

        await this.verificationCodeModel.deleteMany({ code })

        return { message: 'Correct code.' };
    }
}

import {
    IsEmail,
    IsOptional,
    IsString
} from "class-validator";


export class SendEmailDto {
    @IsString()
    @IsEmail()
    @IsOptional()
    from?: string;

    @IsString()
    @IsEmail()
    to: string;

    @IsString()
    subject: string;

    @IsString()
    text: string;

    @IsString()
    @IsOptional()
    html?: string;
}
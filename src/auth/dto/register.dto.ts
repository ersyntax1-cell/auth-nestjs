import { 
    IsEmail, 
    IsEnum, 
    IsOptional, 
    IsString,
    Length,
    MinLength
} from "class-validator";
import { Roles } from "./roles.enum";
import { ApiProperty } from "@nestjs/swagger";

export class RegisterDto {
    @IsEmail({}, { message: 'Incorrect email address' })
    @ApiProperty({ example: "test@example.com", description: "The user's email" })
    email: string;

    @IsString()
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    @ApiProperty({ example: "User1996@_Ai", description: "The user's password" })
    password: string;

    @IsEnum(Roles, { each: true })
    @ApiProperty({ example: Roles, description: "The user's role" })
    @IsOptional()
    role?: Roles[];

    @IsString()
    @IsOptional()
    @Length(6, 6, { message: 'The code length cannot be more than 6.' })
    @ApiProperty({ example: '333666', description: "The verification code" })
    code?: string;
}
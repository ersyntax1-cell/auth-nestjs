import { 
    IsArray,
    IsEmail, 
    IsEnum, 
    IsOptional, 
    IsString,
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

    @IsArray()
    @IsEnum(Roles, { each: true })
    @ApiProperty({ example: Roles, description: "The user's role" })
    @IsOptional()
    role?: Roles[]
}
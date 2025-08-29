import { ApiProperty } from "@nestjs/swagger";
import { 
    IsEmail, 
    IsString,
    MinLength
} from "class-validator";

export class LoginDto {
    @IsEmail({}, { message: 'Incorrect email address' })
    @ApiProperty({ example: "test@example.com", description: "The user's email" })
    email: string;

    @IsString()
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    @ApiProperty({ example: "test@2016_UU", description: "The user's password" })
    password: string;
}
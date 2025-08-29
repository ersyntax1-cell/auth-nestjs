import { 
    ApiProperty 
} from "@nestjs/swagger";
import {
    IsOptional,
    IsString,
    MaxLength
} from "class-validator";

export class CreatePostDto {
    @IsString()
    @MaxLength(15)
    @ApiProperty({ example: "My Day", description: "The title of post" })
    title: string;

    @IsString()
    @MaxLength(130)
    @ApiProperty({ example: "Today I'll learn NestJS!", description: "The description of post" })
    description: string;

    @IsOptional()
    @ApiProperty({ example: "randomPic.png", description: "The image of post" })
    image?: string;
}
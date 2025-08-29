import { ApiProperty } from "@nestjs/swagger";
import {
    IsMongoId,
    IsNotEmpty,
    IsString,
    MaxLength
} from "class-validator";

export class PostDto {
    @IsString()
    @MaxLength(15)
    @ApiProperty({ example: "My Day", description: "The title of post" })
    title: string;

    @IsString()
    @MaxLength(130)
    @ApiProperty({ example: "My Day", description: "The title of post" })
    description: string;

    @IsString()
    @ApiProperty({ example: "randomPic.png", description: "The image of post" })
    image: string;
}
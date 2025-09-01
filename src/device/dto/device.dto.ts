import {
    IsBoolean,
    IsString
} from "class-validator";

export class DeviceDto {
    @IsString()
    deviceId: string;

    @IsString()
    deviceModel: string;

    @IsBoolean()
    isActive: boolean;

    @IsString()
    code: string;
}
import { IsString } from "class-validator";


export class GatewayDto {
    @IsString()
    deviceId: string;

    @IsString()
    deviceModel: string;
}
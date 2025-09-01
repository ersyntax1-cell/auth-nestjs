import {
    Prop,
    Schema,
    SchemaFactory
} from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

@Schema()
export class Device {
    @Prop({ required: true })
    deviceId: string;

    @Prop({ required: true })
    deviceModel: string;

    @Prop({ required: true })
    isActive: boolean;

    @Prop({ required: true })
    code: string;
}

export const DeviceSchema = SchemaFactory.createForClass(Device);

export type DeviceDocument = HydratedDocument<Device>
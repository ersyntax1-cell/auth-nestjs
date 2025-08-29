import {
    Prop,
    Schema,
    SchemaFactory
} from '@nestjs/mongoose';
import { IsArray } from 'class-validator';
import { HydratedDocument } from 'mongoose';
import { Roles } from 'src/auth/dto/roles.enum';

export type UserDocument = HydratedDocument<User>

@Schema()
export class User {
    @Prop({ unique: true, required: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @IsArray()
    @Prop({ enum: Object.values(Roles), default: [Roles.User], type: [String] })
    role: Roles[]
}

export const UserSchema = SchemaFactory.createForClass(User);

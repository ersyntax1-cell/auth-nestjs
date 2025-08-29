import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

@Schema({
  timestamps: true,
})
export class Post {

    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    description: string;

    @Prop()
    image?: string;

    @Prop({ type: Types.ObjectId, ref: "User" })
    author: Types.ObjectId;
}

export type PostDocument = HydratedDocument<Post>;

export const PostSchema = SchemaFactory.createForClass(Post);
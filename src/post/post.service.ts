import { ForbiddenException, Injectable, NotFoundException, UploadedFile } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument } from './schema/post.schema';
import { Model, Types } from 'mongoose';
import { PostDto } from './dto/post.dto';
import type { CreatePostInput } from './types/post-create-input';
import { Message } from 'src/shared/types/message/message';
import { isOwner } from 'src/utils/is-owner.utils';
import { hasAnyRole } from 'src/utils/roles.utils';

@Injectable()
export class PostService {
    constructor(
        @InjectModel(Post.name) private postModel: Model<PostDocument>,
    ) { }

    async create(
        body: CreatePostInput,
    ): Promise<Post | null> {
        const newPost = new this.postModel({
            title: body.title,
            description: body.description,
            image: body.image,
            author: new Types.ObjectId(body.author)
        });

        return await newPost.save();
    }

    async findById(id: string): Promise<Post | null> {
        const post = await this.postModel.findById(id).populate('Image')
            .exec();

        if (!post) {
            throw new NotFoundException(`Post with ${id} not found.`);
        }

        return post
    }

    async delete(
        postId: string,
        userId: string,
        roles: string[]
    ): Promise<Message | null> {
        const post = await this.postModel.findById(postId)
            .exec();
        if (!post) {
            throw new NotFoundException(`Post with id ${postId} not found and could not be deleted.`);
        }

        const isPostOwner = isOwner(post.author.toString(), userId);
        const isAdmin = hasAnyRole(roles, ['admin']);

        if (!isAdmin && !isPostOwner) {
            throw new ForbiddenException("You are not allowed to delete this post.");
        }

        await this.postModel.findByIdAndDelete(postId);

        return {
            message: 'Post successfuly deleted.'
        };
    }

    async edit(
        postId: string,
        userId: string,
        roles: string[],
        obj: PostDto
    ): Promise<Message | null> {
        const post = await this.postModel.findById(postId);

        if (!post) {
            throw new NotFoundException(`Post with id ${postId} not found and could not be updated.`);
        }

        const isPostOwner = isOwner(post.author.toString(), userId);
        const isAdmin = hasAnyRole(roles, ['admin']);

        if (!isAdmin && !isPostOwner) {
            throw new ForbiddenException("You are not allowed to update this post.");
        }

        await this.postModel.findByIdAndUpdate(postId, obj, { new: true })

        return {
            message: 'Post successfuly updated.'
        };
    }

    async getUserPosts(userId: string): Promise<Post[] | null> {
        const posts = await this.postModel.find({ author: new Types.ObjectId(userId) })
            .exec();

        if (!posts) {
            throw new NotFoundException(`Posts not found.`);
        }

        return posts;
    }
}

import { CreatePostDto } from "../dto/create-post.dto";

export interface CreatePostInput extends CreatePostDto {
    author: string;
}

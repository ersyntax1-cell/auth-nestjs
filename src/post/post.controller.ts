import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Req,
    Request,
    UploadedFile,
    UseGuards,
    UseInterceptors
} from '@nestjs/common';
import { PostService } from './post.service';
import { PostDto } from './dto/post.dto';
import { ObjectIdValidationPipe } from 'src/pipes/object-id-validation.pipe';
import { AuthGuard } from '@nestjs/passport';
import { CreatePostDto } from './dto/create-post.dto';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';

@Controller('post')
@ApiTags('posts')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))

export class PostController {
    constructor(
        private readonly postService: PostService,
    ) { }

    @Post('create')

    @ApiOperation({ summary: "Create post function" })
    @ApiResponse({ status: 200, description: "Post created." })

    @UseInterceptors(
        FileInterceptor('image', {
            storage: diskStorage({
                destination: "./uploads",
                filename: (req, file, cb) => {
                    const uniqueName = `${uuidv4()}${extname(file.mimetype)}`;
                    cb(null, uniqueName);
                }
            }),
            fileFilter: (req, file, cb) => {
                const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
                if (allowedMimeTypes.includes(file.mimetype)) {
                    cb(null, true)
                } else {
                    cb(new Error('Invalid file type'), false)
                }
            },
            limits: { fileSize: 5 * 1024 * 1024 }
        })
    )
    create(
        @UploadedFile() file: Express.Multer.File,
        @Body() body: CreatePostDto,
        @Req() req: any,
    ) {
        const userId = req.user.userId;
        const imagePath = file ? `/uploads/${file.filename}` : undefined;

        return this.postService.create(
            {
                ...body,
                image: imagePath,
                author: userId,
            }
        );
    }


    @Get('info/:id')

    @ApiOperation({ summary: "Find post by unique id function" })
    @ApiResponse({ status: 200, description: "Post finded." })

    findById(@Param('id', ObjectIdValidationPipe) id: string) {
        return this.postService.findById(id);
    }

    @Post('delete/:id')

    @ApiOperation({ summary: "Delete post by unique id function" })
    @ApiResponse({ status: 200, description: "Post deleted." })

    delete(
        @Param('id', ObjectIdValidationPipe) id: string,
        @Request() req: any
    ) {
        const userId = req.user.userId;
        const roles = req.user.role;
        return this.postService.delete(id, userId, roles);
    }

    @Post('edit/:id')

    @ApiOperation({ summary: "Edit post by unique id function" })
    @ApiResponse({ status: 201, description: "Post edited." })

    edit(
        @Param('id', ObjectIdValidationPipe) id: string,
        @Body() body: PostDto,
        @Request() req: any
    ) {
        const userId = req.user.userId
        const roles = req.user.role
        return this.postService.edit(id, userId, roles, body);
    }

    @Get('posts/:id')

    @ApiOperation({ summary: "Get user's posts by unique id function" })
    @ApiResponse({ status: 200, description: "Posts received" })

    getUsersPosts(@Param('id', ObjectIdValidationPipe) id: string) {
        return this.postService.getUserPosts(id);
    }
}

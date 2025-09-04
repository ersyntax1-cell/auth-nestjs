import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { RegisterDto } from 'src/auth/dto/register.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { MailService } from 'src/mail/mail.service';
import { Roles } from 'src/auth/dto/roles.enum';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        private readonly mailService: MailService,
    ) { }

    async create(user: RegisterDto): Promise<UserDocument> {
        const isExists = await this.findByEmail(user.email);
        if (isExists) {
            throw new BadRequestException('A user with this email already exists.');
        }

        if (!user.role?.includes(Roles.Admin)) {
            if (!user.code) {
                throw new BadRequestException('Verification code is required');
            }

            await this.mailService.verifyCode(user.email, user.code);
        }

        const hashedPassword = await bcrypt.hash(user.password, 10);
        const newUser = new this.userModel({
            email: user.email,
            password: hashedPassword,
            role: user.role,
        });

        return await newUser.save();
    }


    async findByEmail(email: string): Promise<UserDocument | null> {
        return await this.userModel.findOne({ email }).exec();
    }

    async validateUser(email: string, password: string): Promise<UserDocument | null> {
        const user = await this.findByEmail(email);
        if (!user) {
            return null;
        }

        const isMatch = await bcrypt.compare(password, user.password);
        return isMatch ? user : null;
    }

    // admin capabilities

    async createBasic(user: RegisterDto): Promise<UserDocument> {
        return await this.create(user);
    }

    async findAllUsers(): Promise<User[] | null> {
        const users = await this.userModel.find().select("-password").exec();

        if (!users || users.length === 0) {
            return []
        }

        return users;
    }

    async updateUser(id: string, user: UpdateUserDto): Promise<{} | null> {
        const updatedUser = await this.userModel.findByIdAndUpdate(
            id,
            { $set: user },
            { new: true }
        );

        if (!updatedUser) {
            throw new NotFoundException('User not found.');
        }

        return {
            message: 'Post successfuly edited.'
        };;
    }

    async deleteUser(id: string) {
        const deletedUser = await this.userModel.findByIdAndDelete(id).select("-password");

        if (!deletedUser) {
            throw new NotFoundException('User not found.')
        }
        return {
            message: "User successfully deleted."
        };
    }
}

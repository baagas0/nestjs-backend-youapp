import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUser } from '../interface/user.interface';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private userModel: Model<IUser>) {}

  async searchUsers(query: string): Promise<IUser[]> {
    const users = await this.userModel
      .find({
        $or: [
          { username: { $regex: query, $options: 'i' } },
          { email: { $regex: query, $options: 'i' } },
        ],
      })
      .select('-password'); // Exclude password from results

    if (!users || users.length === 0) {
      throw new NotFoundException(
        'No users found matching the search criteria',
      );
    }

    return users;
  }

  async createUser(createUserDto: CreateUserDto): Promise<IUser> {
    // Check if email exists
    const emailExists = await this.userModel.findOne({
      email: createUserDto.email,
    });
    if (emailExists) {
      throw new ConflictException('Email already exists');
    }

    // Check if username exists
    const usernameExists = await this.userModel.findOne({
      username: createUserDto.username,
    });
    if (usernameExists) {
      throw new ConflictException('Username already exists');
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

    const newUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    });
    return newUser.save();
  }

  async updateUser(
    userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<IUser> {
    const data = { ...updateUserDto };
    if (updateUserDto.password) {
      const salt = await bcrypt.genSalt();
      data.password = await bcrypt.hash(updateUserDto.password, salt);
    }

    const existingUser = await this.userModel.findByIdAndUpdate(userId, data, {
      new: true,
    });
    if (!existingUser) {
      throw new NotFoundException(`User #${userId} not found`);
    }
    return existingUser;
  }

  async getAllUsers(): Promise<IUser[]> {
    const userData = await this.userModel.find();
    if (!userData || userData.length == 0) {
      throw new NotFoundException('Users data not found!');
    }
    return userData;
  }

  async getUser(userId: string): Promise<IUser> {
    const existingUser = await this.userModel.findById(userId).exec();
    if (!existingUser) {
      throw new NotFoundException(`User #${userId} not found`);
    }
    return existingUser;
  }

  async deleteUser(userId: string): Promise<IUser> {
    const deletedUser = await this.userModel.findByIdAndDelete(userId);
    if (!deletedUser) {
      throw new NotFoundException(`User #${userId} not found`);
    }
    return deletedUser;
  }
}

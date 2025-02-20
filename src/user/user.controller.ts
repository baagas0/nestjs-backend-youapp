/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  UseGuards,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CreateUserDto } from 'src/dto/create-user.dto';
import { UpdateUserDto } from 'src/dto/update-user.dto';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('search/:query')
  async searchUsers(@Res() response, @Param('query') query: string) {
    try {
      console.log('query', query);
      const users = await this.userService.searchUsers(query);
      console.log('users', users);
      const user = users.length > 0 ? users[0] : undefined;
      return response.status(HttpStatus.OK).json({
        message: 'User found successfully',
        user,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: err?.message || 'Error: Users not found!',
        error: 'Bad Request',
      });
    }
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  async createUser(@Res() response, @Body() createUserDto: CreateUserDto) {
    try {
      const newUser = await this.userService.createUser(createUserDto);
      return response.status(HttpStatus.CREATED).json({
        message: 'User has been created successfully',
        newUser,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: err?.message || 'Error: User not created!',
        error: 'Bad Request',
      });
    }
  }

  @Put('/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  async updateUser(
    @Res() response,
    @Param('id') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    try {
      const existingUser = await this.userService.updateUser(
        userId,
        updateUserDto,
      );
      return response.status(HttpStatus.OK).json({
        message: 'User has been successfully updated',
        existingUser,
      });
    } catch (err) {
      console.log(err.message);
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: err?.message || 'Error: User not updated!',
        error: 'Bad Request',
      });
    }
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  async getUsers(@Res() response) {
    try {
      const userData = await this.userService.getAllUsers();
      return response.status(HttpStatus.OK).json({
        message: 'All users data found successfully',
        userData,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: err?.message || 'Error: Users not found!',
        error: 'Bad Request',
      });
    }
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  async getUser(@Res() response, @Param('id') userId: string) {
    try {
      const existingUser = await this.userService.getUser(userId);
      return response.status(HttpStatus.OK).json({
        message: 'User found successfully',
        existingUser,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: err?.message || 'Error: User not found!',
        error: 'Bad Request',
      });
    }
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  async deleteUser(@Res() response, @Param('id') userId: string) {
    try {
      const deletedUser = await this.userService.deleteUser(userId);
      return response.status(HttpStatus.OK).json({
        message: 'User deleted successfully',
        deletedUser,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: err?.message || 'Error: User not deleted!',
        error: 'Bad Request',
      });
    }
  }
}

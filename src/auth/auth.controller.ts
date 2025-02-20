/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Get,
  Request,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBody,
  ApiProperty,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

class LoginDto {
  @ApiProperty({ example: 'johndoe', description: 'Username or email' })
  username: string;

  @ApiProperty({ example: 'password123', description: 'User password' })
  password: string;
}

class UserResponseDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011', description: 'User ID' })
  id: string;

  @ApiProperty({ example: 'johndoe', description: 'Username' })
  username: string;

  @ApiProperty({ example: 'john@example.com', description: 'Email address' })
  email: string;

  @ApiProperty({ example: 'John Doe', description: 'Full name' })
  name: string;
}

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'User login',
    description: 'Login with username/email and password',
  })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'User successfully logged in',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials',
  })
  async login(@Body() credentials: LoginDto) {
    const user = await this.authService.validateUser(
      credentials.username,
      credentials.password,
    );

    const token = this.authService.login(user);

    return {
      token,
    };
  }

  @Get('profile')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: 200,
    description: 'Profile retrieved successfully',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get user profile' })
  getProfile(@Request() req) {
    return req.user;
  }
}

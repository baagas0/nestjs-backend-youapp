/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsNumber,
  IsArray,
  IsEmail,
  IsOptional,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Gender } from '../interface/user.interface';

export class UpdateUserDto {
  @ApiProperty({ example: 'John Doe', description: 'The name of the user' })
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({ example: 'johndoe', description: 'Unique username' })
  @IsString()
  @IsNotEmpty()
  readonly username: string;

  @ApiProperty({ example: 'john@example.com', description: 'Email address' })
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty({
    enum: Gender,
    example: Gender.MAN,
    description: 'Gender of the user',
  })
  @IsEnum(Gender)
  @IsNotEmpty()
  readonly gender: Gender;

  @ApiProperty({ example: '1990-01-01', description: 'Date of birth' })
  @IsNotEmpty()
  readonly birthday: string;

  @ApiProperty({ example: 175, description: 'Height in cm', required: false })
  @IsNumber()
  @IsOptional()
  readonly height: number;

  @ApiProperty({ example: 70, description: 'Weight in kg', required: false })
  @IsNumber()
  @IsOptional()
  readonly weight: number;

  @ApiProperty({
    example: ['reading', 'traveling'],
    description: 'User interests',
    required: false,
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  readonly interests: string[];

  @ApiProperty({
    example: 'profile.jpg',
    description: 'Profile picture URL',
    required: false,
  })
  @IsString()
  @IsOptional()
  readonly picture: string;

  @ApiProperty({ example: 'password123', description: 'User password' })
  @IsString()
  @MinLength(8)
  @IsNotEmpty()
  readonly password: string;
}

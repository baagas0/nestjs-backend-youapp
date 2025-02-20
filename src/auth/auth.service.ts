import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { IUser } from '../interface/user.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private userModel: Model<IUser>,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<IUser> {
    const user = await this.userModel.findOne({
      $or: [{ username }, { email: username }],
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  login(user: IUser) {
    const payload = {
      sub: user._id,
      username: user.username,
      email: user.email,
    };

    return {
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        name: user.name,
      },
      access_token: this.jwtService.sign(payload, {
        // Optional: override default options from module registration
        secret: process.env.JWT_SECRET || 'secret',
        expiresIn: '24h',
      }),
    };
  }
}

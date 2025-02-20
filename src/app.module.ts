import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UserService } from './user/user.service';
import { UserController } from './user/user.controller';
import { UserSchema } from './schema/user.schema';
import { ChatModule } from './chat/chat.module';
import { MessageSchema } from './chat/schemas/message.schema';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';

import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './auth/strategies/jwt.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secret',
      signOptions: { expiresIn: '1d' },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRoot(
      process.env.MONGODB_URL || 'mongodb://localhost:27017/youapp',
      {
        dbName: process.env.MONGODB_DATABASE || 'youapp-test',
      },
    ),
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'Message', schema: MessageSchema },
    ]),
    ChatModule,
  ],
  controllers: [AppController, UserController, AuthController],
  providers: [AppService, UserService, AuthService, JwtStrategy],
})
export class AppModule {}

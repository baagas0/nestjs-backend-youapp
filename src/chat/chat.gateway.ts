/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { MessageDocument } from './schemas/message.schema';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private connectedUsers = new Map<string, string>();

  constructor(
    @InjectModel('Message') private messageModel: Model<MessageDocument>,
  ) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    this.connectedUsers.delete(client.id);
  }

  @SubscribeMessage('register')
  handleRegister(client: Socket, userId: string) {
    this.connectedUsers.set(client.id, userId);

    const receiverSocketId = Array.from(this.connectedUsers.entries()).find(
      ([_, userId]) => userId === client.id,
    )?.[0];

    if (receiverSocketId) {
      this.server.to(receiverSocketId).emit('registered', {
        status: 'oke',
      });
    }

    return { event: 'registered', data: userId };
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    client: Socket,
    payload: { receiverId: string; content: string },
  ) {
    const senderId = this.connectedUsers.get(client.id);

    if (!senderId) {
      return { error: 'User not registered' };
    }

    const message = new this.messageModel({
      sender: senderId,
      receiver: payload.receiverId,
      content: payload.content,
    });

    await message.save();

    // Emit to specific user if online
    const receiverSocketId = Array.from(this.connectedUsers.entries()).find(
      ([_, userId]) => userId === payload.receiverId,
    )?.[0];

    if (receiverSocketId) {
      this.server.to(receiverSocketId).emit('newMessage', {
        senderId,
        content: payload.content,
      });
    }

    return { event: 'messageSent', data: message };
  }

  @SubscribeMessage('getMessages')
  async handleGetMessages(client: Socket, otherUserId: string) {
    const userId = this.connectedUsers.get(client.id);

    if (!userId) {
      return { error: 'User not registered' };
    }

    const messages = await this.messageModel
      .find({
        $or: [
          { sender: userId, receiver: otherUserId },
          { sender: otherUserId, receiver: userId },
        ],
      })
      .sort({ createdAt: 1 });

    return { event: 'messages', data: messages };
  }

  @SubscribeMessage('getRooms')
  async handleGetRooms(client: Socket) {
    const userId = this.connectedUsers.get(client.id);
    console.log('userId', userId);
    if (!userId) {
      return { error: 'User not registered' };
    }

    const rooms = await this.messageModel.aggregate([
      {
        $match: {
          $or: [
            { sender: new Types.ObjectId(userId) },
            { receiver: new Types.ObjectId(userId) },
          ],
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ['$sender', new Types.ObjectId(userId)] },
              '$receiver',
              '$sender',
            ],
          },
          lastMessage: { $first: '$$ROOT' },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'otherUser',
        },
      },
      {
        $unwind: '$otherUser',
      },
      {
        $lookup: {
          from: 'users',
          localField: 'lastMessage.sender',
          foreignField: '_id',
          as: 'lastMessage.senderInfo',
        },
      },
      {
        $unwind: '$lastMessage.senderInfo',
      },
      {
        $lookup: {
          from: 'users',
          localField: 'lastMessage.receiver',
          foreignField: '_id',
          as: 'lastMessage.receiverInfo',
        },
      },
      {
        $unwind: '$lastMessage.receiverInfo',
      },
      {
        $project: {
          _id: 1,
          otherUser: {
            _id: '$otherUser._id',
            name: '$otherUser.name',
            username: '$otherUser.username',
            picture: '$otherUser.picture',
          },
          lastMessage: {
            content: '$lastMessage.content',
            createdAt: '$lastMessage.createdAt',
            sender: {
              _id: '$lastMessage.senderInfo._id',
              name: '$lastMessage.senderInfo.name',
              username: '$lastMessage.senderInfo.username',
            },
            receiver: {
              _id: '$lastMessage.receiverInfo._id',
              name: '$lastMessage.receiverInfo.name',
              username: '$lastMessage.receiverInfo.username',
            },
          },
        },
      },
      {
        $sort: { 'lastMessage.createdAt': -1 },
      },
    ]);

    return { event: 'rooms', data: rooms };
  }
}

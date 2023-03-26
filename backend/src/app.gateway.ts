import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

import { AppService } from './app.service';
import { ChatMessageDTO, GameRoundDTO } from './entities';
import { randomInt } from './utils';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private appService: AppService) {}

  @WebSocketServer() server: Server;

  @SubscribeMessage('chat:sendMessage')
  async handleSendMessage(
    client: Socket,
    payload: ChatMessageDTO,
  ): Promise<void> {
    // TODO: save messages to DB in real multi-player game
    this.server.emit('chat:receiveMessage', payload);
  }

  @SubscribeMessage('game:playRound')
  async handlePlayRound(
    client: Socket,
    payload: Pick<GameRoundDTO, 'id'>,
  ): Promise<void> {
    // TODO: move all scoring logic to backend in real multi-player game
    this.server.emit('game:roundFinished', {
      ...payload,
      resultNumber: randomInt(1, 10),
    });
  }

  afterInit(server: Server) {
    // console.log(server);
  }

  handleDisconnect(client: Socket) {
    console.log(`Disconnected: ${client.id}`);
  }

  handleConnection(client: Socket) {
    console.log(`Connected ${client.id}`);
  }
}

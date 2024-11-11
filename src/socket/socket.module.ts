import { Module } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { LoggerModule } from 'src/logger/logger.module';

@Module({
  imports:[
    LoggerModule.register("WebSocket")
  ],
  providers: [SocketGateway],
  exports:[SocketGateway]
})
export class SocketModule {}

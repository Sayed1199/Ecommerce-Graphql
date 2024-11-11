import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { LoggerService } from '../logger/logger.service';

import { Server, Socket } from "socket.io";
import { eventNames } from 'process';

export enum Events{
  CreateCategoryEvent = "createdCategory",
  UpdateCategoryEvent = "updateCategory",
  DeleteCategoryEvent = "deleteCategory",
  CreateProductEvent = "createdProduct",
}

@WebSocketGateway({
  pingInterval: 30000,
  pingTimeout: 5000,
  cors: {
    origin: '*',
  }, 
  // transports: ['websocket']
})
export class SocketGateway implements OnGatewayInit,OnGatewayConnection,OnGatewayDisconnect{
  constructor(
    private readonly loggerService : LoggerService,
  ) {}

 
  handleConnection(socket: Socket, ...args: any[]) {
    const {sockets} = this.io.sockets;
    var clientId = socket.id;
    this.connectedClients.set(clientId, socket);
    console.log(`Client with id: ${clientId} has connected`)
    console.log(`Number of connected Clients now is: ${sockets.size}`);

    // socket.on('createdCategory',(data)=>{
    //   console.log("Recieved created Category notification")
    //   console.log(data)
    // })
 
    socket.on('disconnect',()=>{
      this.connectedClients.delete(clientId)
    })

  }

  @WebSocketServer() io: Server;
  private readonly connectedClients: Map<string, Socket> = new Map()


  afterInit(server: Server) {
    console.log("Initialized Socket")
    server.sockets.disconnectSockets;
  }
  
  handleDisconnect(client: Socket) {
    const {sockets} = this.io.sockets;

    console.log(`Client with id: ${client.id} has disconnected`)
    console.log(`Number of connected Clients now is: ${sockets.size}`);
  }

  // @SubscribeMessage('createdCategory')
  // handleRecievedCreateCategoryEvent(@ConnectedSocket() client: Socket,@MessageBody() data: any): any {
  //   console.log(`Message received from client id: ${client.id}`)
  //   console.log(`CraetedCategoryData: ${data}`)
  //   // this.io.emit('createdCategory',data);
  // } 

  handleSendCreateCategoryEvent(data:any){
    this.io.emit(Events.CreateCategoryEvent,data)
  }

  handleSendUpdateCategoryEvent(data:any){
    this.io.emit(Events.UpdateCategoryEvent,data)
  }

  handleDeleteCategoryEvent(data:any){
    this.io.emit(Events.DeleteCategoryEvent,data)
  }

  handleCreateProductEvent(data:any){
    this.io.emit(Events.CreateProductEvent,data)
  }

}

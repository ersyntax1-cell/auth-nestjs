import { Logger } from "@nestjs/common";
import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway
} from "@nestjs/websockets";
import { Socket } from "socket.io";
import { GatewayDto } from "../dto/gateway.dto";

@WebSocketGateway({
    cors: {
        origin: "http://localhost:5173",
    },
})

export class WsGetaway implements OnGatewayConnection, OnGatewayDisconnect {
    constructor(
    ) { }

    private readonly logger = new Logger(WsGetaway.name)

    private clients = new Map<string, Socket>();

    async handleConnection(@ConnectedSocket() socket: Socket) {
        this.logger.log(`Device connected: ${socket.id}`)
    }

    @SubscribeMessage('register')
    async handleRegister(
        @MessageBody() data: GatewayDto,
        @ConnectedSocket() socket: Socket,
    ) {
        const { deviceId, deviceModel } = data;

        if (deviceId && deviceModel) {
            const oldSocket = this.clients.get(deviceId);

            if (oldSocket && oldSocket.id !== socket.id) {
                oldSocket.disconnect();
            }

            this.clients.set(deviceId, socket);
            this.logger.log(`Device with deviceId ${deviceId} registered`);
        } else {
            socket.emit('error', 'device id not found.')
        }
    }

    async handleCheckDevice(
        @MessageBody() deviceId: string,
        @ConnectedSocket() socket: Socket,
    ) {
        const msg = {
            message: 'Your deivce is active now!',
            isActive: true,
        }
        socket.emit('checkDevice', msg);
    }

    getSocketByDeviceId(deviceId: string): Socket | undefined {
        return this.clients.get(deviceId);
    }

    async handleDisconnect(@ConnectedSocket() socket: Socket) {
        this.clients.forEach((value, key) => {
            if (value.id === socket.id) {
                this.clients.delete(key);
                this.logger.log(`Device with deviceId ${key} disconnected`);
            }
        })
    }
}
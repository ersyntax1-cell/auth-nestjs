import { Logger } from "@nestjs/common";
import {
    ConnectedSocket,
    OnGatewayConnection,
    OnGatewayDisconnect,
    WebSocketGateway
} from "@nestjs/websockets";
import { Socket } from "socket.io";
import { DeviceService } from "src/device/device.service";

@WebSocketGateway({
    cors: {
        origin: "http://localhost:5173",
    },
})

export class WsGetaway implements OnGatewayConnection, OnGatewayDisconnect {
    constructor(
        private readonly deviceService: DeviceService
    ) { }

    private readonly logger = new Logger(WsGetaway.name)

    private clients = new Map<string, Socket>();

    async handleConnection(@ConnectedSocket() socket: Socket) {
        this.logger.log(`Device connected: ${socket.id}`)

        socket.on('register', ({ deviceId, deviceModel }: { deviceId: string, deviceModel: string }) => {
            if (deviceId && deviceModel) {

                const oldSocket = this.clients.get(deviceId);
                if (oldSocket && oldSocket.id !== socket.id) {
                    oldSocket.disconnect();
                }

                this.clients.set(deviceId, socket);
                this.logger.log(`Device with deviceId ${deviceId} connected`)
            } else {
                socket.emit('error', 'device id not found.')
            }
        })

        socket.on('checkDevice', async (deviceId: string) => {
            const response = await this.deviceService.checkDevice(deviceId);
            
            socket.emit('checkDeviceResponse', response);
        });
    }

    async handleDisconnect(@ConnectedSocket() socket: Socket) {
        this.clients.forEach((value, key) => {
            if (value.id === socket.id) {
                this.clients.delete(key);
                this.logger.log(`Device with deviceId ${key} disconnected`);
            }
        })
    }

    sendMessageToDevice(deviceId: string, message: string) {
        const clientSocket = this.clients.get(deviceId);
        if (clientSocket) {
            clientSocket.emit('receiveMessage', message);
        }
    }
}
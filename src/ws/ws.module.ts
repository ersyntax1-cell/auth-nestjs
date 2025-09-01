import { forwardRef, Module } from '@nestjs/common';
import { WsService } from './ws.service';
import { DeviceModule } from 'src/device/device.module';
import { WsGetaway } from './ws-gateway/ws.gateway';

@Module({
  imports: [forwardRef(() => DeviceModule)],
  providers: [WsService, WsGetaway],
  exports: [WsService, WsGetaway]
})
export class WsModule {}

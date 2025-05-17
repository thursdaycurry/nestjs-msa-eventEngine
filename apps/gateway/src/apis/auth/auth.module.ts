import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ClientsModule } from 'src/common/clients/clients.module';

@Module({
  imports: [ClientsModule],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}

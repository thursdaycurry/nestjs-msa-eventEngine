import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { ClientsModule } from 'src/common/clients/clients.module';

@Module({
  imports: [ClientsModule],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}

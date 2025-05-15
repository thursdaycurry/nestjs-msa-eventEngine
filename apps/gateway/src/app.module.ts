import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './apis/user/user.module';
import { ClientsModule } from './common/clients/clients.module';

@Module({
  imports: [
    // for importing microservices
    ClientsModule,

    // for importing modules
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

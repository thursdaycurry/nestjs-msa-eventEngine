import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  async healthCheck() {
    return this.appService.healthCheck();
  }

  @ApiOperation({
    summary: 'seed 데이터 생성',
    description:
      'seed 데이터를 생성하는 api입니다. 테스트의 편의성을 위해 미리 생성된 데이터를 추가합니다. 지난 7일간 로그인한 유저의 로그인 이력을 추가하여 이벤트에 대한 보상 요청 검증 api를 테스트할 수 있습니다.',
  })
  @Get('seed')
  async seed() {
    return this.appService.seed();
  }
}

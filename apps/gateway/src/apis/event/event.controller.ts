import { Body, Controller, Get, Param, Post, Query, Request, UseGuards } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { EventService } from './event.service';
import { CreateRewardItemDto } from './dto/create-reward-item.dto';
import { CreateRewardDto } from './dto/create-reward.dto';
import { UserRole } from 'src/common/constants/constants';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @ApiOperation({
    summary: 'Event 보상 아이템 생성',
    description:
      'ADMIN, OPERATOR가 event reward item을 생성하는 api입니다. reward Item은 reward에 연결된 item을 의미합니다. RewardItem은 이벤트 관련 최하위 엔티티(Event > Reward > RewardItem)입니다.',
  })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  @Post('reward/item')
  async createRewardItem(@Body() createRewardItemDto: CreateRewardItemDto) {
    return await this.eventService.createRewardItem(createRewardItemDto);
  }

  @ApiOperation({
    summary: 'Event 보상 생성',
    description:
      'ADMIN, OPERATOR가 event reward를 생성하는 api입니다. 생성 시 rewardItemIds는 reward item의 _id 배열을 입력해야 합니다.',
  })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  @Post('reward')
  async createReward(@Body() createRewardDto: CreateRewardDto) {
    return await this.eventService.createReward(createRewardDto);
  }

  @ApiOperation({
    summary: 'Event 생성',
    description:
      'ADMIN, OPERATOR가 event를 생성하는 api입니다. 이벤트 이름, 설명, 타입, 트리거 타입, 목표값을 입력하여 event를 생성해야 합니다. rewardIds 배열에 event reward의 _id를 넣어야 합니다.',
  })
  @ApiBearerAuth('access-token')
  @ApiBody({ type: CreateEventDto })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  @Post()
  async createEvent(@Body() createEventDto: CreateEventDto) {
    return await this.eventService.createEvent(createEventDto);
  }

  @ApiOperation({
    summary: 'User 보상 요청',
    description: 'USER가 특정 이벤트에 대한 보상(reward)를 요청하는 api입니다.',
  })
  @ApiParam({
    name: 'eventId',
    type: String,
    description: '보상을 요청할 eventId',
    example: '665a9f7eea43b80cbdf2e129',
  })
  @ApiBearerAuth('access-token')
  @Post(':eventId/claim-reward')
  @UseGuards(JwtAuthGuard)
  async claimReward(@Param('eventId') eventId: string, @Request() req) {
    const userId = req.user.userId;
    return await this.eventService.claimReward(eventId, userId);
  }

  // ADMIN, OPERATOR
  @ApiOperation({
    summary: 'Event 목록 조회',
    description: 'ADMIN, OPERATOR가 전체 event 목록을 조회하는 api입니다.',
  })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  @Get()
  async getEventList() {
    return await this.eventService.getEventList();
  }

  @ApiOperation({
    summary: 'Event 상세 조회',
    description:
      'ADMIN, OPERATOR가 event 상세 정보를 조회하는 api입니다. event에 연결된 reward, rewardItem 정보도 함께 반환합니다.',
  })
  @ApiParam({
    name: 'eventId',
    type: String,
    description: '보상을 조회할 eventId',
    example: '665a9f7eea43b80cbdf2e129',
  })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  @Get(':eventId')
  async getEventDetail(@Param('eventId') eventId: string) {
    return await this.eventService.getEventDetail(eventId);
  }

  @ApiOperation({
    summary: '전체 User 요청 기록 조회',
    description:
      'ADMIN, OPERATOR, AUDITOR가 전체 유저의 보상 이력을 조회하는 api입니다. 필터링은 eventType, eventId, finalClaimStatus, userId로 가능합니다.',
  })
  @ApiQuery({
    name: 'eventType',
    required: false,
    type: String,
    example: 'LOGIN',
  })
  @ApiQuery({
    name: 'eventId',
    required: false,
    type: String,
    example: '665a9f7eea43b80cbdf2e129',
  })
  @ApiQuery({
    name: 'finalClaimStatus',
    required: false,
    type: String,
    example: 'CLAIMED',
  })
  @ApiQuery({
    name: 'userId',
    required: false,
    type: String,
    example: '665a9f7eea43b80cbdf2e129',
  })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.OPERATOR, UserRole.AUDITOR)
  @Get('reward/claim-history')
  async searchEventRewardClaimHistory(
    @Query('eventType') eventType,
    @Query('eventId') eventId,
    @Query('finalClaimStatus') finalClaimStatus,
    @Query('userId') userId,
  ) {
    const claimHistoryDto = {
      eventType,
      eventId,
      userId,
      finalClaimStatus,
    };
    return await this.eventService.searchEventRewardClaimHistory(claimHistoryDto);
  }

  @ApiOperation({
    summary: '보상 정보 조회',
    description: 'ADMIN, OPERATOR가 event reward를 조회하는 api입니다.',
  })
  @ApiParam({
    name: 'rewardId',
    type: String,
    description: '보상을 조회할 rewardId',
    example: '665a9f7eea43b80cbdf2e127',
  })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  @Get('reward/:rewardId')
  async getReward(@Param('rewardId') rewardId: string) {
    return await this.eventService.getReward(rewardId);
  }

  @ApiOperation({
    summary: 'Event에 보상 추가',
    description:
      'ADMIN, OPERATOR가 event에 reward를 추가하는 api입니다. 기존 event에 연결된 reward가 없거나 추가하고 싶을 때 사용합니다.',
  })
  @ApiParam({
    name: 'eventId',
    type: String,
    description: '보상을 추가할 eventId',
    example: '665a9f7eea43b80cbdf2e129',
  })
  @ApiParam({
    name: 'rewardId',
    type: String,
    description: '보상을 추가할 rewardId',
    example: '665a9f7eea43b80cbdf2e128',
  })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  @Post(':eventId/reward/:rewardId')
  async addRewardToEvent(@Param('eventId') eventId: string, @Param('rewardId') rewardId: string) {
    return await this.eventService.addRewardToEvent(eventId, rewardId);
  }

  @ApiOperation({
    summary: '보상 아이템을 보상에 추가',
    description: 'ADMIN, OPERATOR가 reward에 reward item을 추가적으로 등록하는 api입니다.',
  })
  @ApiParam({
    name: 'rewardId',
    type: String,
    description: '수정할 rewardId',
    example: '665a9f7eea43b80cbdf2e127',
  })
  @ApiParam({
    name: 'rewardItemId',
    type: String,
    description: '추가할 rewardItemId',
    example: '665a9f7eea43b80cbdf2e126',
  })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  @Post('reward/:rewardId/item/:rewardItemId')
  async addRewardItemToReward(
    @Param('rewardId') rewardId: string,
    @Param('rewardItemId') rewardItemId: string,
  ) {
    return await this.eventService.addRewardItemToReward(rewardId, rewardItemId);
  }

  @ApiOperation({
    summary: 'User의 자기 보상 요청 이력 조회',
    description: 'USER가 특정 이벤트에 대한 자신의 보상(reward) 요청 이력을 조회하는 api입니다.',
  })
  @ApiParam({
    name: 'eventId',
    type: String,
    description: '보상을 조회할 eventId',
    example: '665a9f7eea43b80cbdf2e129',
  })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Get(':eventId/reward/claim-history')
  async getEventRewardClaimHistory(@Param('eventId') eventId: string, @Request() req) {
    const userId = req.user.userId;
    return await this.eventService.getEventRewardClaimHistory(eventId, userId);
  }
}

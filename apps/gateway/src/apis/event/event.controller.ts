import { Body, Controller, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { EventService } from './event.service';
import { CreateRewardItemDto } from './dto/create-reward-item.dto';
import { CreateRewardDto } from './dto/create-reward.dto';
import { UserRole } from 'src/common/constants/constants';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  // USER
  @Post(':eventId/claim-reward')
  @UseGuards(JwtAuthGuard)
  async claimReward(@Param('eventId') eventId: string, @Request() req) {
    const userId = req.user.userId;
    return await this.eventService.claimReward(eventId, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':eventId/reward/claim-history')
  async getEventRewardClaimHistory(@Param('eventId') eventId: string, @Request() req) {
    const userId = req.user.userId;
    return await this.eventService.getEventRewardClaimHistory(eventId, userId);
  }

  // ADMIN, OPERATOR
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  @Get()
  async getEventList() {
    return await this.eventService.getEventList();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  @Get(':eventId')
  async getEventDetail(@Param('eventId') eventId: string) {
    return await this.eventService.getEventDetail(eventId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  @Post()
  async createEvent(@Body() createEventDto: CreateEventDto) {
    return await this.eventService.createEvent(createEventDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  @Post(':eventId/reward/:rewardId')
  async addRewardToEvent(@Param('eventId') eventId: string, @Param('rewardId') rewardId: string) {
    return await this.eventService.addRewardToEvent(eventId, rewardId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  @Get('reward/:rewardId')
  async getReward(@Param('rewardId') rewardId: string) {
    return await this.eventService.getReward(rewardId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  @Post('reward')
  async createReward(@Body() createRewardDto: CreateRewardDto) {
    return await this.eventService.createReward(createRewardDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  @Post('reward/item')
  async createRewardItem(@Body() createRewardItemDto: CreateRewardItemDto) {
    return await this.eventService.createRewardItem(createRewardItemDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  @Post('reward/:rewardId/item/:rewardItemId')
  async addRewardItemToReward(
    @Param('rewardId') rewardId: string,
    @Param('rewardItemId') rewardItemId: string,
  ) {
    return await this.eventService.addRewardItemToReward(rewardId, rewardItemId);
  }
}

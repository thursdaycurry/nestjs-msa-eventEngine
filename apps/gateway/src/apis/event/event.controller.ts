import { Body, Controller, Post } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { EventService } from './event.service';
import { CreateRewardItemDto } from './dto/create-reward-item.dto';
import { CreateRewardDto } from './dto/create-reward.dto';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  //TODO: add gards ROLES
  @Post()
  async createEvent(@Body() createEventDto: CreateEventDto) {
    return await this.eventService.createEvent(createEventDto);
  }

  //TODO: add gards ROLES
  @Post('reward')
  async createReward(@Body() createRewardDto: CreateRewardDto) {
    return await this.eventService.createReward(createRewardDto);
  }

  //TODO: add gards ROLES
  @Post('reward/item')
  async createRewardItem(@Body() createRewardItemDto: CreateRewardItemDto) {
    return await this.eventService.createRewardItem(createRewardItemDto);
  }
}

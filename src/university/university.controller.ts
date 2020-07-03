import { Controller, Get, Param, Inject, UseGuards, UseFilters, Body, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

import { v4 as uuid } from 'uuid';

import { University } from './university.schema';
import { UniversityService } from './university.service';
import { MongoIdPipe } from '../pipe/mongoId.pipe';
import { Cmd, Evt, KafkaTopic, ExceptionFilter } from '../kafka';
import { Roles, RoleGuard } from '../auth';
import { Command } from './commands/command';
import { CreateUniversityDto } from './dto/createUniversity.dto';
import { Config } from 'src/config';
import { CommandHandler } from './commands/command.handler';
import { Event } from './events/event';
import { EventHandler } from './events/event.handler';

@Controller('university')
@UseGuards(RoleGuard)
@UseFilters(ExceptionFilter)
export class UniversityController {
  constructor(
    @Inject('CONFIG') private config: Config,
    @Inject('KAFKA_SERVICE') private kafkaClient: ClientKafka,
    private commandHandler: CommandHandler,
    private eventHandler: EventHandler,
    private universityService: UniversityService,
  ) {}

  // ------------ REST ------------
  @Post('')
  @Roles('create')
  @UsePipes(ValidationPipe)
  async createOne(@Body() dto:CreateUniversityDto): Promise<University> {
    const university: University = await this.universityService.createOne(dto);

    const event = {
      id: uuid(),
      type: 'event',
      action: 'UniversityCreated',
      timestamp: Date.now(),
      data: university,
    };
    this.kafkaClient.emit(`${this.config.kafka.prefix}-university-event`, event);

    return university;
  }

  @Get('')
  @Roles('read')
  async getAll(): Promise<University[]> {
    return this.universityService.findAll();
  }

  @Get('/:id')
  async getOne(
    @Param('id', new MongoIdPipe()) id: string,
  ): Promise<University> {
    return this.universityService.findOne(id);
  }

  // ------------ CQRS ------------
  @KafkaTopic('university-command')
  async onCommand(@Cmd() command: Command): Promise<void> {
    const university: University = await this.commandHandler.handler(command);

    const event = {
      id: uuid(),
      type: 'event',
      action: 'UniversityCreated',
      timestamp: Date.now(),
      data: university,
    };
    this.kafkaClient.emit(`${this.config.kafka.prefix}-university-event`, event);

    return;
  }

  @KafkaTopic('student-event')
  async onStudentEvent(@Evt() event: Event): Promise<void> {
    await this.eventHandler.handleEvent(event);
    return;
  }
}

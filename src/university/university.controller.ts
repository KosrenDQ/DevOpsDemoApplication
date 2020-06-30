import { Controller, Get, Param, Inject, UseGuards } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

import { University } from './university.schema';
import { UniversityService } from './university.service';
import { MongoIdPipe } from '../util/mongoId.pipe';
import { KafkaTopic } from '../util/kafkaTopic.decorator';
import { CreateUniversityCommand } from './commands/CreateUniversity.command';
import { Command } from '../util/command.decorator';
import { Roles } from '../auth/auth.decorator';
import { RoleGuard } from '../auth/auth.guard';

@Controller('university')
@UseGuards(RoleGuard)
export class UniversityController {
  constructor(
    @Inject('KAFKA_SERVICE') private kafkaClient: ClientKafka,
    private universityService: UniversityService,
  ) {}

  // ------------ REST ------------
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
  @KafkaTopic('university')
  async onCreateUniversityCommand(
    @Command() command: CreateUniversityCommand,
  ): Promise<void> {
    console.log(command);
  }
}

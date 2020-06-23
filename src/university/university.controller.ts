import { Controller, Get, Param, Inject, UseGuards } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

import { University } from './university.schema';
import { UniversityService } from './university.service';
import { MongoIdPipe } from 'src/util/mongoId.pipe';
import { KafkaTopic } from 'src/util/kafkaTopic.decorator';
import { CreateUniversityCommand } from './commands/CreateUniversity.command';
import { Command } from 'src/util/command.decorator';
import { Roles } from 'src/auth/auth.decorator';
import { RoleGuard } from 'src/auth/auth.guard';

@Controller('university')
@UseGuards(RoleGuard)
export class UniversityController {
  constructor(
    @Inject('KAFKA_SERVICE') private kafkaClient: ClientKafka,
    private universityService: UniversityService,
  ) { }

  // ------------ REST ------------
  @Get('')
  @Roles('read')
  async getAll(): Promise<University[]> {
    return this.universityService.findAll();
  }

  @Get('/:id')
  async getOne(@Param('id', new MongoIdPipe()) id: string): Promise<University> {
    return this.universityService.findOne(id);
  }

  // ------------ CQRS ------------
  @KafkaTopic('university')
  async onCreateUniversityCommand(@Command() command: CreateUniversityCommand): Promise<void> {
    console.log(command);
  }

}

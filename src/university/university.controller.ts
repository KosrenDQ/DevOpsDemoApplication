import { Controller, Get, Param, OnModuleInit, Inject } from '@nestjs/common';
import { University } from './university.schema';
import { UniversityService } from './university.service';
import { MongoIdPipe } from 'src/util/mongoId.pipe';
import { ClientKafka } from '@nestjs/microservices';
import { KafkaTopic } from 'src/util/kafkaTopic.decorator';
import { CreateUniversityCommand } from './commands/CreateUniversity.command';
import { Command } from 'src/util/command.decorator';

@Controller('university')
export class UniversityController implements OnModuleInit {
  constructor(
    @Inject('KAFKA_SERVICE') private kafkaClient: ClientKafka,
    private universityService: UniversityService,
  ) { }

  async onModuleInit() {
    await this.kafkaClient.connect();
    this.kafkaClient.emit('local-university', {
      id: '1',
      type: 'CreateUniversity',
      timestamp: Date.now(),
      address: 'Wilhelmshöher Alle 73',
    });
  }

  // ------------ REST ------------
  @Get('')
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

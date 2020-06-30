import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';

import { UniversityController } from './university.controller';
import { UniversityService } from './university.service';
import { LoggingModule } from '../logging';
import { ConfigModule } from '../config';
import { CommandHandler } from './commands/command.handler';
import { EventHandler } from './dto/event.handler';

describe('University Controller', () => {
  function mockUniversityModel(dto: any) {
    this.data = dto;
    this.save  = () => {
      return this.data;
    };
  }

  function kafkaMock() {
    this.emit = () => {
      return 'Event sendet';
    }
  }

  let controller: UniversityController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        LoggingModule,
      ],
      controllers: [UniversityController],
      providers: [
        CommandHandler,
        EventHandler,
        UniversityService,
        {
          provide: 'KAFKA_SERVICE',
          useValue: kafkaMock,
        },
        {
          provide: getModelToken('Universities'),
          useValue: mockUniversityModel,
        }
      ]
    }).compile();

    controller = module.get<UniversityController>(UniversityController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

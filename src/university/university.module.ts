import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UniversityController } from './university.controller';
import { UniversitySchema } from './university.schema';
import { LoggingModule } from '../logging';
import { UniversityService } from './university.service';
import { CommandHandler } from './commands/command.handler';
import { EventHandler } from './dto/event.handler';

@Module({
  imports: [
    LoggingModule,
    MongooseModule.forFeature([{ name: 'Universities', schema: UniversitySchema }]),
  ],
  controllers: [UniversityController],
  providers: [
    CommandHandler,
    EventHandler,
    UniversityService,
  ]
})
export class UniversityModule {}

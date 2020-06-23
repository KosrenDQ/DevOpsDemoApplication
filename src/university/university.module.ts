import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UniversityController } from './university.controller';
import { UniversitySchema } from './university.schema';
import { LoggingModule } from './../logging/logging.module';
import { UniversityService } from './university.service';



@Module({
  imports: [
    LoggingModule,
    MongooseModule.forFeature([{ name: 'Universities', schema: UniversitySchema }]),
  ],
  controllers: [UniversityController],
  providers: [
    UniversityService,
  ]
})
export class UniversityModule {}

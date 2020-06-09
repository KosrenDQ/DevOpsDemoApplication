import { Module } from '@nestjs/common';

import { UniversityModule } from './university/university.module';
import { ConfigModule } from './config/config.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    UniversityModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

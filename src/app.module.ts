import { Module } from '@nestjs/common';
import { MongooseModule } from "@nestjs/mongoose";

import { UniversityModule } from './university/university.module';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.getConfig().mongo.uri,
      }),
      inject: [ConfigService],
    }),
    UniversityModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

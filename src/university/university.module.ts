import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Transport, ClientProxyFactory } from '@nestjs/microservices';

import { UniversityController } from './university.controller';
import { UniversityService } from './university.service';
import { UniversitySchema } from './university.schema';
import { ConfigService } from 'src/config/config.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Universities', schema: UniversitySchema }]),
  ],
  controllers: [UniversityController],
  providers: [
    UniversityService,
    {
      provide: 'KAFKA_SERVICE',
      useFactory: (configService: ConfigService) => {
        const kafka = configService.getConfig().kafka;
        return ClientProxyFactory.create({
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: kafka.clientId,
              brokers: kafka.brokerUris,
            },
            consumer: {
              groupId: `${kafka.clientId}-consumer`,
            },
          }
        })
      },
      inject: [ConfigService],
    }
  ]
})
export class UniversityModule {}

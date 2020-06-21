import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { AppModule } from './app.module';
import { ConfigService } from './config/config.service';

async function bootstrap() {
  const configService: ConfigService = new ConfigService();
  const config = configService.getConfig();

  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix(config.prefix);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: config.kafka.clientId,
        brokers: config.kafka.brokerUris,
      },
      consumer: {
        groupId: `${config.kafka.clientId}-consumer`
      }
    }
  });

  await app.startAllMicroservicesAsync();
  await app.listen(config.port);
}
bootstrap();

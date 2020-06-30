import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { AppModule } from './app.module';
import { ConfigService } from './config';
import { LoggingService } from './logging';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: false });

  const configService: ConfigService = app.get(ConfigService);
  const config = configService.getConfig();
  const logger: LoggingService = app.get(LoggingService);

  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  app.useLogger(logger);
  app.setGlobalPrefix(config.prefix);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: config.kafka.clientId,
        brokers: config.kafka.brokerUris,
      },
      consumer: {
        groupId: `${config.kafka.prefix}-${config.kafka.clientId}-consumer`
      }
    }
  });

  await app.startAllMicroservicesAsync();
  await app.listen(config.port);

  logger.log(`University service running on port ${config.port}`);
}
bootstrap();

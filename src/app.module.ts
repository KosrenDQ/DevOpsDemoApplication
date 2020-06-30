import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';

import { UniversityModule } from './university/university.module';
import { ConfigModule, ConfigService } from './config';
import { AuthMiddleware } from './auth';
import { KafkaModule } from './kafka';

@Module({
  imports: [
    ConfigModule.forRoot(),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        publicKey: configService.getConfig().auth.publicKey,
      }),
    }),
    KafkaModule.forRootAsync(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.getConfig().mongo.uri,
      }),
      inject: [ConfigService],
    }),
    UniversityModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AuthMiddleware).forRoutes('api/(.*)?');
  }
}

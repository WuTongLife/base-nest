import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WinstonModule } from 'nest-winston';
import { createConnection } from 'typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import appConfig from '@config';
import { loggerOptions } from '@utils/log.util';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '@common/guards';
import { AuthModule } from '@common/auth/auth.module';
import { UserModule } from '@modules/system/user/user.module';
import { RedisService } from '@cache';
import { OSSModule } from '@modules/oss/oss.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    OSSModule,
    WinstonModule.forRoot(loggerOptions),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'root',
        dateStrings: true,
        charset: 'utf8mb4',
        timezone: 'local',
        password: 'WuTong123***',
        database: 'base_nest',
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
        logging: ['query', 'error', 'warn', 'info', 'log'],
        logger: 'file',
      }),
      connectionFactory: async (options) => await createConnection(options),
    }),
    // config
    ConfigModule.forRoot({
      load: appConfig,
      isGlobal: true,
      envFilePath: ['.env.development.local'],
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    RedisService,
    // {
    //   provide: APP_GUARD,
    //   useClass: RolesGuard,
    // },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}

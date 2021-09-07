import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { CryptoUtil } from 'src/common/utils/crypto.util';
import { AuthStrategy } from '@common/strategies/auth.strategy';
import { AuthService } from './auth.service';
import { UserEntity } from '@entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { CacheService } from '@cache';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        secret: config.get('JWT.secretKey'),
        signOptions: {
          expiresIn: config.get('JWT.expiresIn'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, CryptoUtil, AuthStrategy, CacheService], // 注入器实例化
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}

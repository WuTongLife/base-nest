import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { AuthService } from './auth.service';
import { UserEntity } from '@entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { CacheService } from '@cache';
import { LocalStrategy, AuthStrategy } from '@common/strategies';
import { UserService } from '@modules/system/user/user.service';

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
  providers: [AuthService, AuthStrategy, LocalStrategy, CacheService, ConfigService, UserService], // 注入器实例化
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}

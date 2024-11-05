import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { JwtModule } from '@nestjs/jwt';

import { postgresDatabaseProvider } from './common/infraestructure/providers/postgres-provider';
import { UserModule } from './user/infraestructure/user.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),

    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get('JWT_SECRET_KEY'),
          signOptions: {
            expiresIn: '24h'
          }
        }
      }
    }),
      
    UserModule
  ],
  providers: [
    postgresDatabaseProvider
  ],
})
export class AppModule {}

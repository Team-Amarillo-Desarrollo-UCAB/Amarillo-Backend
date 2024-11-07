import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { JwtModule } from '@nestjs/jwt';

import { postgresDatabaseProvider } from './common/infraestructure/providers/postgres-provider';
import { UserController } from './user/infraestructure/controller/user.controller';
import { ProductController } from './product/infraestructure/controller/product.controller';

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
      
  ],
  controllers: [
    UserController,
    ProductController
  ],
  providers: [
    postgresDatabaseProvider
  ],
})
export class AppModule {}

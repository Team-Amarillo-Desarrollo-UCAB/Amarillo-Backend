import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { JwtModule } from '@nestjs/jwt';

import { postgresDatabaseProvider } from './common/infraestructure/providers/postgres-provider';
import { UserController } from './user/infraestructure/controller/user.controller';
import { ProductController } from './product/infraestructure/controller/product.controller';
import { AuthController } from './auth/infraestructure/controller/auth.controller';
import { CategoryController } from './category/infraestructure/controller/category.controller';
import { OrderController } from './order/infraestructure/controller/order.controller';
import { CuponController } from './cupon/infraestructure/controller/cupon.controller';
import { BundleController } from './bundle/infraestructure/controller/bundle.controller';
import { CategoriesExistenceService } from './bundle/application/services/queries/categories-existence-check.service';
import { ProductsExistenceService } from './bundle/application/services/queries/product-existence-check.service';
import { DiscountController } from './discount/infraestructure/controller/discount.controller';
import { DiscountExistenceService } from './bundle/application/services/queries/discount-existence-check.service';

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
  controllers: [//con
    UserController,
    ProductController,
    AuthController,
    CategoryController,
    OrderController,
    CuponController,
    BundleController,
    DiscountController
  ],
  providers: [
    Logger,
    Logger,
    postgresDatabaseProvider,
    CategoriesExistenceService,
    ProductsExistenceService,
    DiscountExistenceService
  ],
  exports: [CategoriesExistenceService,ProductsExistenceService,DiscountExistenceService],

})
export class AppModule { }

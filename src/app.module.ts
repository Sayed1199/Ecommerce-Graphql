import { ApolloDriver } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { join } from 'path';
import {CarriersDashboardDBConfiguration } from './common/config/typeorm.config';
import { UsersModule } from './users/users.module';
import { PassportModule } from '@nestjs/passport';
import { MailerModule } from '@nestjs-modules/mailer';
import { LoggerModule } from './logger/logger.module';
import { OtpsModule } from './otps/otps.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './common/strategies/jwt-strategy';
import { OrdersModule } from './orders/orders.module';
import { ProductModule } from './product/product.module';
import { PaymentModule } from './payment/payment.module';
import { CategoriesModule } from './categories/categories.module';
import { SocketModule } from './socket/socket.module';

dotenv.config()
@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),
    
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 10,
    }]), 
 
    TypeOrmModule.forRootAsync({
      // name: process.env.DASHBOARD_DB_CONNECTION_NAME,
      useClass: CarriersDashboardDBConfiguration
    }),

    GraphQLModule.forRoot({
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      debug: true,
      playground: true,
      driver: ApolloDriver,
      context: ({ req }) => ({ req }), 
    }),

    MailerModule.forRoot({
      transport: {
        service: "gmail",
        host: process.env.EMAIL_HOST,
        secure: false, 
        port: parseInt(process.env.EMAIL_PORT),
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      },
    }),
 
    PassportModule.register({ defaultStrategy: 'jwt' }),

    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET_KEY,
      signOptions: { expiresIn: '1d' },
    }),

    UsersModule,

    LoggerModule,

    OtpsModule,

    OrdersModule,

    ProductModule,

    PaymentModule,

    CategoriesModule,

    SocketModule,

  ], 
  controllers: [],
  providers: [JwtStrategy],
})
export class AppModule {}
 
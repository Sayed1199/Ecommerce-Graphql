import {TypeOrmModuleOptions, TypeOrmOptionsFactory} from "@nestjs/typeorm";

export class CarriersDashboardDBConfiguration implements TypeOrmOptionsFactory {
    createTypeOrmOptions(): TypeOrmModuleOptions | Promise<TypeOrmModuleOptions> {
   
      return {
          name: process.env.DASHBOARD_DB_CONNECTION_NAME,
          type: 'postgres', 
          host: `${process.env.DASHBOARD_DB_HOST}`, 
          port: parseInt(process.env.DASHBOARD_DB_PORT),  
          username: `${process.env.DASHBOARD_DB_USERNAME}`,
          password: `${process.env.DASHBOARD_DB_PASSWORD}`,
          database: `${process.env.DASHBOARD_DB_NAME}`, 
          entities: ["dist/**/*.entity{.ts,.js}"], 
          migrations: ["dist/migrations/*{.ts,.js}"], 
          autoLoadEntities: true,
          synchronize: true,
          logging: false,
          //process.env.ENVIRONMENT == "production"? false : true,
          ssl: true, 
      };
    }
  } 
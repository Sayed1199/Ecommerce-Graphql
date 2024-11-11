import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { ValidationPipe } from '@nestjs/common';
import { ExceptionsFilter } from './common/exceptions-filters/exceptions.filter';
import { useContainer } from 'class-validator';
import * as compression from 'compression';
import helmet from 'helmet';

dotenv.config();

async function bootstrap() {
  const port = process.env.APP_PORT;  
  const env = process.env.ENVIRONMENT;
  const clientUrl = process.env.CLIENT_URL;
 

  const app = await NestFactory.create(AppModule,{
    logger: env === 'development'? ['log','debug', 'error', 'verbose', 'warn'] : ['error','warn']
  });

  // Validation Pipes
  app.useGlobalPipes(new ValidationPipe());

  // Exceptions Filter
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new ExceptionsFilter(httpAdapter)); 


  // Allow dependency injection in validators
  // useContainer(app.select(AppModule), { fallbackOnErrors: true });
  
  // // cors
  // app.enableCors(
  //   {
  //     origin: clientUrl,
  //     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  //     credentials: true,
  //   }
  // );

  if(env === "production"){
    app.use(compression()).use(helmet());
  }

  process.on('uncaughtException', function (err) {
    console.log(err);
  }); 

  // Serve on the env port and listen
  await app.listen(port); 
} 
bootstrap();
  
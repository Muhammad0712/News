import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from "cookie-parser";
import { InternalServerErrorException } from '@nestjs/common';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function start() {
  try {
    const PORT = process.env.PORT || 3001;
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    app.setGlobalPrefix("api");
    app.use(cookieParser());

    app.useStaticAssets(join(__dirname, '..', 'uploads'), {
      prefix: '/uploads/', // Global prefix bilan birga
    });

    app.enableCors({
      origin: ["http://localhost:3000", "http://45.92.173.112:3003", "http://127.0.0.1:3000"],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      credentials: true,
    });
    
    await app.listen(PORT, () => {
      console.log(`Server started at ${PORT} - port!`);
    });
  } catch (error) {
    console.log(error);
    throw new InternalServerErrorException("Something went wrong");
  }
}
start();

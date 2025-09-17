import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from "cookie-parser";
import { InternalServerErrorException } from '@nestjs/common';

async function start() {
  try {
    const PORT = process.env.PORT || 3001;
    const app = await NestFactory.create(AppModule);

    app.setGlobalPrefix("api");
    app.use(cookieParser());

    app.enableCors({
      origin: "http://localhost:5173",
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

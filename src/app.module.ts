import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { User } from './users/model/user.model';
import { NewsModule } from './news/news.module';
import { AuthModule } from './auth/auth.module';
import { News } from './news/model/news.model';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true, envFilePath: '.env'}),
    SequelizeModule.forRoot({
      dialect: "postgres",
      host: process.env.PG_HOST,
      port: Number(process.env.PG_PORT),
      username: process.env.PG_USER,
      password: process.env.PG_PASSWORD,
      database: process.env.PG_DB,
      models: [
        User,
        News
      ],
      autoLoadModels: true,
      logging: false,
      sync: { alter: true }
    }),
    UsersModule,
    NewsModule,
    AuthModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

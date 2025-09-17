import { Module } from '@nestjs/common';
import { NewsService } from './news.service';
import { NewsController } from './news.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { News } from './model/news.model';
import { User } from '../users/model/user.model';

@Module({
  imports: [SequelizeModule.forFeature([News, User])],
  controllers: [NewsController],
  providers: [NewsService],
})
export class NewsModule {}

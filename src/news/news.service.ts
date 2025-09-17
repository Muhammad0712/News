import { Injectable } from '@nestjs/common';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { News } from './model/news.model';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class NewsService {
  constructor(@InjectModel(News) private readonly newsModel: typeof News) {}
  async create(createNewsDto: CreateNewsDto) {
    const news = await this.newsModel.create(createNewsDto);
    return news;
  }

  async findAll() {
    const news = await this.newsModel.findAll({ include: { all: true } });
    return news;
  }

  async findOne(id: number) {
    const news = await this.newsModel.findOne({ where: { id }, include: { all: true } });
    return news;
  }

  async update(id: number, updateNewsDto: UpdateNewsDto) {
    const news = await this.newsModel.update(updateNewsDto, { where: { id } });
    return news;
  }

  async remove(id: number) {
    const news = await this.newsModel.destroy({ where: { id } });
    return news;
  }
}

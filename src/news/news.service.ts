import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { News } from './model/news.model';
import { InjectModel } from '@nestjs/sequelize';
import { unlink } from 'fs/promises';
import { join } from 'path';
import { existsSync} from 'fs';

@Injectable()
export class NewsService {
  constructor(@InjectModel(News) private readonly newsModel: typeof News) { }

  async create(createNewsDto: CreateNewsDto, file?: Express.Multer.File) {
    const newsData = {
      ...createNewsDto,
      image: file ? `uploads/innovations/${file.filename}` : null,
    };

    const news = await this.newsModel.create(newsData);
    return {
      news: news,
      message: 'News created successfully',
    };
  }

  async findAll() {
    const news = await this.newsModel.findAll({
      include: { all: true },
      order: [['createdAt', 'DESC']]
    });
    return news;
  }

  async findOne(id: number) {
    const news = await this.newsModel.findOne({
      where: { id },
      include: { all: true }
    });

    if (!news) {
      throw new NotFoundException(`News with ID ${id} not found`);
    }

    return news;
  }

  async update(id: number, updateNewsDto: UpdateNewsDto, file?: Express.Multer.File) {
    const news = await this.findOne(id);

    if (file && news.image) {
      try {
        await unlink(join(process.cwd(), news.image));
      } catch (error) {
        console.warn('Could not delete old file:', error.message);
      }
    }

    const updateData = {
      ...updateNewsDto,
      image: file ? `uploads/innovations/${file.filename}` : news.image,
    };

    await this.newsModel.update(updateData, { where: { id } });
    return {
      news: await this.findOne(id),
      message: 'Innovation informations updated successfully',
    };
  }

  async remove(id: number) {
    const news = await this.findOne(id);

    if (news.image) {
      try {
        await unlink(join(process.cwd(), news.image));
      } catch (error) {
        console.warn('Could not delete file:', error.message);
      }
    }

    const result = await this.newsModel.destroy({ where: { id } });
    return { message: `Innovation deleted successfully`, affected: result };
  }

  async getNewsByUserId(userId: number) {
    const news = await this.newsModel.findAll({ where: { userId: userId } });
    return news
  }

  async getPublishedNews() {
    const news = await this.newsModel.findAll({ where: { isPublished: true } });
    return news
  }
}
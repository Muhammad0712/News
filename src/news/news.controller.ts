import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,  // qo'shildi
  UploadedFile      // qo'shildi
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';  // qo'shildi
import { NewsService } from './news.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { multerConfig } from '../helpers/multer.config';  // qo'shildi (multer config)

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) { }

  @Post()
  @UseInterceptors(FileInterceptor('image', multerConfig))  // qo'shildi
  create(
    @Body() createNewsDto: CreateNewsDto,
    @UploadedFile() file?: Express.Multer.File  // qo'shildi
  ) {
    return this.newsService.create(createNewsDto, file);  // file parametri qo'shildi
  }

  @Get()
  findAll() {
    return this.newsService.findAll();
  }

  @Get('published')
  getPublishedNews() {
    return this.newsService.getPublishedNews();
  }

  @Get('user/:userId')
  getNewsByUserId(@Param('userId') userId: number) {
    return this.newsService.getNewsByUserId(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.newsService.findOne(+id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('image', multerConfig))  // qo'shildi
  update(
    @Param('id') id: string,
    @Body() updateNewsDto: UpdateNewsDto,
    @UploadedFile() file?: Express.Multer.File  // qo'shildi
  ) {
    return this.newsService.update(+id, updateNewsDto, file);  // file parametri qo'shildi
  }
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.newsService.remove(+id);
  }

}
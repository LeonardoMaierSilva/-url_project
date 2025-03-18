import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Delete,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { UrlsService } from './urls.service';
import { CreateUrlDto } from './dto/create-url.dto';
import { UpdateUrlDto } from './dto/update-url.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('urls')
export class UrlsController {
  constructor(private readonly urlsService: UrlsService) {}

  @Post()
  create(@Body() createUrlDto: CreateUrlDto) {
    return this.urlsService.create(createUrlDto);
  }

  @Get(':shortUrl')
  redirect(@Param('shortUrl') shortUrl: string) {
    return this.urlsService.redirect(shortUrl);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.urlsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateUrlDto: UpdateUrlDto) {
    return this.urlsService.update(id, updateUrlDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.urlsService.remove(id);
  }
}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UrlsService } from './urls.service';
import { UrlsController } from './urls.controller';
import { UrlsRepository } from './urls.repository';
import { Url } from './entities/urls.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Url])],
  controllers: [UrlsController],
  providers: [UrlsService, UrlsRepository],
  exports: [UrlsService],
})
export class UrlsModule {}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Url } from './entities/urls.entity';
import { CreateUrlDto } from './dto/create-url.dto';
import { UpdateUrlDto } from './dto/update-url.dto';
import * as crypto from 'crypto';

@Injectable()
export class UrlsService {
  constructor(
    @InjectRepository(Url)
    private readonly urlsRepository: Repository<Url>,
  ) {}

  async create(createUrlDto: CreateUrlDto): Promise<Url> {
    const shortUrl = crypto.randomBytes(3).toString('hex');
    const newUrl = this.urlsRepository.create({
      ...createUrlDto,
      shortUrl,
    });
    return await this.urlsRepository.save(newUrl);
  }

  async redirect(shortUrl: string): Promise<string> {
    const url = await this.urlsRepository.findOne({
      where: { shortUrl, deletedAt: IsNull() },
    });
    if (url) {
      url.clicks += 1;
      await this.urlsRepository.save(url);
      return url.originalUrl;
    }
    throw new Error('URL não encontrada.');
  }

  async findAll(): Promise<Url[]> {
    return this.urlsRepository.find({ where: { deletedAt: IsNull() } });
  }

  async update(id: number, updateUrlDto: UpdateUrlDto): Promise<Url> {
    await this.urlsRepository.update({ id, deletedAt: IsNull() }, updateUrlDto);

    const updatedUrl = await this.urlsRepository.findOne({
      where: { id, deletedAt: IsNull() },
    });
    if (!updatedUrl) {
      throw new Error('URL não encontrada.');
    }
    return updatedUrl;
  }

  async remove(id: number): Promise<boolean> {
    const result = await this.urlsRepository.update(id, {
      deletedAt: new Date(),
    });
    return result.affected ? true : false;
  }
}

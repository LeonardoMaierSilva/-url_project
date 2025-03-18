import { EntityRepository, Repository } from 'typeorm';
import { Url } from './entities/urls.entity';
import { Injectable } from '@nestjs/common';
import { IsNull } from 'typeorm';

@Injectable()
@EntityRepository(Url)
export class UrlsRepository extends Repository<Url> {
  async findUrlById(id: number): Promise<Url | null> {
    return await this.findOne({ where: { id, deletedAt: IsNull() } });
  }

  async createUrl(urlData: Partial<Url>): Promise<Url> {
    const url = this.create(urlData);
    return await this.save(url);
  }

  async updateUrl(id: number, urlData: Partial<Url>): Promise<Url | null> {
    await this.update({ id, deletedAt: IsNull() }, urlData);
    return this.findUrlById(id);
  }

  async deleteUrl(id: number): Promise<boolean> {
    const result = await this.update(id, { deletedAt: new Date() });
    return result.affected ? true : false;
  }
}

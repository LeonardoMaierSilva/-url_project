import { Test, TestingModule } from '@nestjs/testing';
import { UrlsService } from './urls.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Url } from './entities/urls.entity';
import { Repository } from 'typeorm';

describe('UrlsService', () => {
  let service: UrlsService;
  let repository: Repository<Url>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UrlsService,
        {
          provide: getRepositoryToken(Url),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<UrlsService>(UrlsService);
    repository = module.get<Repository<Url>>(getRepositoryToken(Url));
  });

  it('should create a short URL', async () => {
    const url = new Url();
    url.originalUrl = 'https://example.com';
    url.shortUrl = 'abc123';

    jest.spyOn(repository, 'save').mockResolvedValue(url);
    jest.spyOn(repository, 'create').mockReturnValue(url);

    const result = await service.create({ originalUrl: url.originalUrl });
    expect(result.shortUrl).toBe('abc123');
  });

  it('should redirect to the original URL', async () => {
    const url = new Url();
    url.originalUrl = 'https://example.com';
    url.shortUrl = 'abc123';
    url.clicks = 0;

    jest.spyOn(repository, 'findOne').mockResolvedValue(url);
    jest.spyOn(repository, 'save').mockResolvedValue(url);

    const result = await service.redirect('abc123');
    expect(result).toBe('https://example.com');
    expect(url.clicks).toBe(1);
  });

  it('should throw error if short URL not found', async () => {
    jest.spyOn(repository, 'findOne').mockResolvedValue(null);

    await expect(service.redirect('notfound')).rejects.toThrow(
      'URL não encontrada.',
    );
  });
});

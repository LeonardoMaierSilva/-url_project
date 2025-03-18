import { Test, TestingModule } from '@nestjs/testing';
import { UrlsController } from './urls.controller';
import { UrlsService } from './urls.service';
import { CreateUrlDto } from './dto/create-url.dto';
import { UpdateUrlDto } from './dto/update-url.dto';
import { Url } from './entities/urls.entity';

describe('UrlsController', () => {
  let urlsController: UrlsController;
  let urlsService: UrlsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UrlsController],
      providers: [
        {
          provide: UrlsService,
          useValue: {
            create: jest.fn(),
            redirect: jest.fn(),
            findAll: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    urlsController = module.get<UrlsController>(UrlsController);
    urlsService = module.get<UrlsService>(UrlsService);
  });

  it('should be defined', () => {
    expect(urlsController).toBeDefined();
  });

  describe('create', () => {
    it('should create and return a short URL', async () => {
      const createUrlDto: CreateUrlDto = { originalUrl: 'https://example.com' };
      const url: Url = {
        id: 1,
        originalUrl: createUrlDto.originalUrl,
        shortUrl: 'abc123',
        clicks: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      jest.spyOn(urlsService, 'create').mockResolvedValue(url);

      const result = await urlsController.create(createUrlDto);
      expect(result).toEqual(url);
      expect(urlsService.create).toHaveBeenCalledWith(createUrlDto);
    });
  });

  describe('redirect', () => {
    it('should return the original URL for a short URL', async () => {
      const shortUrl = 'abc123';
      const originalUrl = 'https://example.com';

      jest.spyOn(urlsService, 'redirect').mockResolvedValue(originalUrl);

      const result = await urlsController.redirect(shortUrl);
      expect(result).toEqual(originalUrl);
      expect(urlsService.redirect).toHaveBeenCalledWith(shortUrl);
    });
  });

  describe('findAll', () => {
    it('should return a list of all URLs', async () => {
      const urls: Url[] = [
        {
          id: 1,
          originalUrl: 'https://example.com',
          shortUrl: 'abc123',
          clicks: 5,
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        },
        {
          id: 2,
          originalUrl: 'https://test.com',
          shortUrl: 'xyz789',
          clicks: 10,
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        },
      ];

      jest.spyOn(urlsService, 'findAll').mockResolvedValue(urls);

      const result = await urlsController.findAll();
      expect(result).toEqual(urls);
      expect(urlsService.findAll).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update and return the updated URL', async () => {
      const id = 1;
      const updateUrlDto: UpdateUrlDto = { originalUrl: 'https://updated.com' };
      const updatedUrl: Url = {
        id,
        originalUrl: updateUrlDto.originalUrl,
        shortUrl: 'abc123',
        clicks: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      jest.spyOn(urlsService, 'update').mockResolvedValue(updatedUrl);

      const result = await urlsController.update(id, updateUrlDto);
      expect(result).toEqual(updatedUrl);
      expect(urlsService.update).toHaveBeenCalledWith(id, updateUrlDto);
    });
  });

  describe('remove', () => {
    it('should remove the URL and return true', async () => {
      const id = 1;

      jest.spyOn(urlsService, 'remove').mockResolvedValue(true);

      const result = await urlsController.remove(id);
      expect(result).toEqual(true);
      expect(urlsService.remove).toHaveBeenCalledWith(id);
    });

    it('should return false if URL is not found', async () => {
      const id = 99;

      jest.spyOn(urlsService, 'remove').mockResolvedValue(false);

      const result = await urlsController.remove(id);
      expect(result).toEqual(false);
      expect(urlsService.remove).toHaveBeenCalledWith(id);
    });
  });
});

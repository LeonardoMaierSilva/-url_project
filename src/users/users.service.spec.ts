import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a user', async () => {
    const user = new User();
    user.email = 'test@example.com';
    user.name = 'Test User';
    user.password = 'hashedPassword';

    jest.spyOn(repository, 'save').mockResolvedValue(user);
    const result = await service.create(user);
    expect(result).toEqual(user);
  });

  it('should find user by email', async () => {
    const user = new User();
    user.email = 'test@example.com';

    jest.spyOn(repository, 'findOne').mockResolvedValue(user);
    const result = await service.findByEmail('test@example.com');
    expect(result).toEqual(user);
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findByEmail: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(() => 'mockToken'),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should register a new user', async () => {
    const userDto = {
      email: 'test@example.com',
      name: 'Test',
      password: 'password',
    };
    const user = new User();
    user.email = userDto.email;
    user.name = userDto.name;
    user.password = await bcrypt.hash(userDto.password, 10);

    jest.spyOn(usersService, 'findByEmail').mockResolvedValue(null);
    jest.spyOn(usersService, 'create').mockResolvedValue(user);

    const result = await service.register(userDto);
    expect(result.user).toEqual(user);
  });

  it('should login and return a token', async () => {
    const user = new User();
    user.email = 'test@example.com';
    user.password = await bcrypt.hash('password', 10);

    jest.spyOn(usersService, 'findByEmail').mockResolvedValue(user);
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

    const result = await service.login({
      email: 'test@example.com',
      password: 'password',
    });
    expect(result.access_token).toBe('mockToken');
  });
});

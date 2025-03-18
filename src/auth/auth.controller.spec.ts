import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { User } from '../users/entities/user.entity';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            register: jest.fn(),
            login: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const registerDto: RegisterDto = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'password123',
      };

      const createdUser: User = {
        id: 1,
        email: registerDto.email,
        name: registerDto.name,
        password: 'hashedPassword',
      } as User;

      jest
        .spyOn(authService, 'register')
        .mockResolvedValue({
          message: 'User registered successfully',
          user: createdUser,
        });

      const result = await authController.register(registerDto);
      expect(result).toEqual({
        message: 'User registered successfully',
        user: createdUser,
      });
      expect(authService.register).toHaveBeenCalledWith(registerDto);
    });
  });

  describe('login', () => {
    it('should return an access token when login is successful', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const mockToken = { access_token: 'mockJwtToken' };
      jest.spyOn(authService, 'login').mockResolvedValue(mockToken);

      const result = await authController.login(loginDto);
      expect(result).toEqual(mockToken);
      expect(authService.login).toHaveBeenCalledWith(loginDto);
    });
  });
});

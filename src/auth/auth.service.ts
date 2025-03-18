import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(
    registerDto: RegisterDto,
  ): Promise<{ message: string; user: User }> {
    const existingUser = await this.usersService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new ConflictException('Email ja esta sendo usado.');
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const hashedPassword: string = await bcrypt.hash(registerDto.password, 10);
    const user = new User();
    user.email = registerDto.email;
    user.name = registerDto.name;
    user.password = hashedPassword;

    const savedUser = await this.usersService.create(user);
    return { message: 'Usuario cadastrado com sucesso.', user: savedUser };
  }

  async login(loginDto: LoginDto): Promise<{ access_token: string }> {
    try {
      const user: User | null = await this.usersService.findByEmail(
        loginDto.email,
      );
      const { password } = loginDto;

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const isPasswordValid =
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        user?.password && (await bcrypt.compare(password, user.password));

      if (!user || !isPasswordValid) {
        throw new UnauthorizedException('Senha invalida.');
      }
      const payload = { sub: user.id, email: user.email };
      return { access_token: this.jwtService.sign(payload) };
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}

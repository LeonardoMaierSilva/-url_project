import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';
import { UsersService } from './users/users.service';
import { UsersController } from './users/users.controller';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { UrlsModule } from './urls/urls.module';
import { Url } from './urls/entities/urls.entity';
import { UrlsService } from './urls/urls.service';
import { UrlsController } from './urls/urls.controller';
import { AuthModule } from './auth/auth.module';
import { UsersRepository } from './users/users.repository';
import { UrlsRepository } from './urls/urls.repository';

@Module({
  imports: [
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mssql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      entities: [User, Url],
      synchronize: true,
      logging: true,
      options: {
        encrypt: true,
        trustServerCertificate: true,
      },
    }),
    UsersModule,
    UrlsModule,
    AuthModule,
  ],
  controllers: [AppController, UsersController, UrlsController],
  providers: [
    AppService,
    UsersService,
    UrlsService,
    UrlsRepository,
    UsersRepository,
  ],
})
export class AppModule {}

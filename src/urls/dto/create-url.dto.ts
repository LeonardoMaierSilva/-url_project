import { IsNotEmpty, IsUrl, IsOptional } from 'class-validator';

export class CreateUrlDto {
  @IsNotEmpty()
  @IsUrl()
  originalUrl: string;

  @IsOptional()
  userId?: number;
}

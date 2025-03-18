import { IsOptional, IsUrl } from 'class-validator';

export class UpdateUrlDto {
  @IsOptional()
  @IsUrl()
  originalUrl?: string;
}

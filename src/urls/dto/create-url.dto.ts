import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUrl } from 'class-validator';

export class CreateUrlDto {
  @ApiProperty({
    example: 'https://exemplo.com',
    description: 'URL original a ser encurtada',
  })
  @IsNotEmpty()
  @IsUrl()
  originalUrl: string;
}

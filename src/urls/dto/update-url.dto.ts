import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateUrlDto } from './create-url.dto';

export class UpdateUrlDto extends PartialType(CreateUrlDto) {
  @ApiProperty({
    example: 'https://novo-exemplo.com',
    description: 'Nova URL de destino',
  })
  originalUrl?: string;
}

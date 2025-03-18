import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { UrlsService } from './urls.service';
import { CreateUrlDto } from './dto/create-url.dto';
import { UpdateUrlDto } from './dto/update-url.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('URLs')
@Controller('urls')
export class UrlsController {
  constructor(private readonly urlsService: UrlsService) {}

  @Post()
  @ApiOperation({ summary: 'Criar uma URL encurtada' })
  @ApiResponse({ status: 201, description: 'URL encurtada com sucesso' })
  async create(@Body() createUrlDto: CreateUrlDto) {
    return this.urlsService.create(createUrlDto);
  }

  @Get(':shortUrl')
  @ApiOperation({ summary: 'Redirecionar para a URL original' })
  @ApiResponse({ status: 200, description: 'Redirecionamento bem-sucedido' })
  async redirect(@Param('shortUrl') shortUrl: string) {
    return this.urlsService.redirect(shortUrl);
  }

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar todas as URLs encurtadas' })
  @ApiResponse({ status: 200, description: 'Lista de URLs' })
  async findAll() {
    return this.urlsService.findAll();
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar a URL original de uma URL encurtada' })
  @ApiResponse({ status: 200, description: 'URL atualizada com sucesso' })
  async update(@Param('id') id: number, @Body() updateUrlDto: UpdateUrlDto) {
    return this.urlsService.update(id, updateUrlDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Excluir uma URL encurtada' })
  @ApiResponse({ status: 200, description: 'URL removida com sucesso' })
  async remove(@Param('id') id: number) {
    return this.urlsService.remove(id);
  }
}

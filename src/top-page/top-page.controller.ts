import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FindTopPageDto } from './dto/find-top-page.dto';
import { CreateTopPageDto } from './dto/create-top-page.dto';
import { TopPageService } from './top-page.service';
import { PAGE_NOT_FOUND_ERROR } from './top-page.constans';
import { IdValidationPipe } from '../pipes/id-validation/id-validation.pipe';
import { JWTAuthGuard } from '../auth/guards/JWTAuthGuard';

@Controller('top-page')
export class TopPageController {
  constructor(private readonly topPageService: TopPageService) {}

  @UseGuards(JWTAuthGuard)
  @Post('create')
  async create(@Body() dto: CreateTopPageDto) {
    return this.topPageService.create(dto);
  }

  @UseGuards(JWTAuthGuard)
  @Get(':id')
  async get(@Param('id', IdValidationPipe) id: string) {
    const foundTopPage = await this.topPageService.findById(id);

    if (!foundTopPage) {
      throw new NotFoundException(PAGE_NOT_FOUND_ERROR);
    }

    return foundTopPage;
  }

  @UseGuards(JWTAuthGuard)
  @Get('byAlias/:alias')
  async getByAlias(@Param('alias') alias: string) {
    const foundTopPage = await this.topPageService.findByAlias(alias);

    if (!foundTopPage) {
      throw new NotFoundException(PAGE_NOT_FOUND_ERROR);
    }

    return foundTopPage;
  }

  @UseGuards(JWTAuthGuard)
  @Delete(':id')
  async delete(@Param('id', IdValidationPipe) id: string) {
    const deletedTopPage = await this.topPageService.deleteById(id);

    if (!deletedTopPage) {
      throw new NotFoundException(PAGE_NOT_FOUND_ERROR);
    }
  }

  @UseGuards(JWTAuthGuard)
  @Patch(':id')
  async update(
    @Param('id', IdValidationPipe) id: string,
    @Body() dto: CreateTopPageDto,
  ) {
    const updatedTopPage = await this.topPageService.updateById(id, dto);

    if (!updatedTopPage) {
      throw new NotFoundException(PAGE_NOT_FOUND_ERROR);
    }

    return updatedTopPage;
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('find')
  async find(@Body() dto: FindTopPageDto) {
    return this.topPageService.findByCategory(dto.firstCategory);
  }

  @Get('textSearch/:text')
  async textSearch(@Param('text') text: string) {
    return this.topPageService.findByText(text);
  }
}

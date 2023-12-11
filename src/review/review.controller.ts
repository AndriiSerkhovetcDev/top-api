import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { REVIEW_NOT_FOUND } from './review.constans';
import { ReviewService } from './review.service';
import { JWTAuthGuard } from '../auth/guards/JWTAuthGuard';
import { IdValidationPipe } from '../pipes/id-validation/id-validation.pipe';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}
  @UseGuards(JWTAuthGuard)
  @UsePipes(new ValidationPipe())
  @Post('create')
  async create(@Body() dto: CreateReviewDto) {
    return this.reviewService.create(dto);
  }

  @UseGuards(JWTAuthGuard)
  @Delete(':id')
  async delete(@Param('id', IdValidationPipe) id: string) {
    const deletedReview = await this.reviewService.delete(id);

    if (!deletedReview) {
      throw new HttpException(REVIEW_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
  }

  @Get('byProduct/:productId')
  async getByProduct(@Param('productId', IdValidationPipe) productId: string) {
    return this.reviewService.findByProduct(productId);
  }

  @UseGuards(JWTAuthGuard)
  @Delete('byProduct/:productId')
  async deleteByProduct(
    @Param('productId', IdValidationPipe) productId: string,
  ) {
    return this.reviewService.deleteByProduct(productId);
  }
}

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ProductDocument, ProductModel } from './product.model';
import { Model, ModifyResult } from 'mongoose';
import { CreateProductDto } from './dto/create-product.dto';
import { ReviewDocument } from '../review/review.model';
import { FindProductDto } from './dto/find-product.dto';

export type ProductWithReviews = ProductDocument & {
  reviews: ReviewDocument[];
  reviewCount: number;
  reviewAvg: number;
};

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(ProductModel.name)
    private readonly productModel: Model<ProductDocument>,
  ) {}

  async create(dto: CreateProductDto): Promise<ProductDocument> {
    return this.productModel.create(dto);
  }

  async findById(id: string): Promise<ProductDocument> {
    return this.productModel.findById(id).exec();
  }

  async deleteById(id: string): Promise<ModifyResult<ProductDocument>> {
    return this.productModel.findByIdAndDelete(id).exec();
  }

  async updateById(
    id: string,
    dto: CreateProductDto,
  ): Promise<ProductDocument> {
    return this.productModel.findByIdAndUpdate(id, dto, { new: true }).exec();
  }

  async findWithReviews(dto: FindProductDto): Promise<ProductWithReviews[]> {
    const product = await this.productModel
      .aggregate([
        {
          $match: {
            categories: dto.category,
          },
        },
        {
          $sort: {
            _id: 1,
          },
        },
        {
          $limit: dto.limit,
        },
        {
          $lookup: {
            from: 'reviewmodels',
            localField: '_id',
            foreignField: 'productId',
            as: 'reviews',
          },
        },
        {
          $addFields: {
            reviewCount: {
              $size: '$reviews',
            },
            reviewAvg: {
              $avg: '$reviews.rating',
            },
          },
        },
      ])
      .exec();

    return product as ProductWithReviews[];
  }
}

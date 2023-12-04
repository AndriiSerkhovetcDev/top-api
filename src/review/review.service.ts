import { Injectable } from '@nestjs/common';
import { ReviewDocument, ReviewModel } from './review.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ModifyResult } from 'mongoose';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel(ReviewModel.name)
    private reviewDocumentModel: Model<ReviewDocument>,
  ) {}

  async create(dto: CreateReviewDto): Promise<ReviewDocument> {
    return this.reviewDocumentModel.create(dto);
  }

  async delete(id: string): Promise<ModifyResult<ReviewDocument>> {
    return this.reviewDocumentModel.findByIdAndDelete(id).exec();
  }

  async findByProduct(productId: string): Promise<ReviewDocument[]> {
    return this.reviewDocumentModel.find({ productId }).exec();
  }

  async deleteByProduct(productId: string) {
    return this.reviewDocumentModel.deleteMany({ productId }).exec();
  }
}

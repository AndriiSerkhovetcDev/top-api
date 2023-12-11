import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  TopLevelCategories,
  TopPageModel,
  TopPageModelDocument,
} from './top-page.model';
import { Model, ModifyResult } from 'mongoose';
import { CreateTopPageDto } from './dto/create-top-page.dto';

@Injectable()
export class TopPageService {
  constructor(
    @InjectModel(TopPageModel.name)
    private readonly topPageModel: Model<TopPageModelDocument>,
  ) {}

  public async create(dto: CreateTopPageDto): Promise<TopPageModelDocument> {
    return this.topPageModel.create(dto);
  }

  public async findById(id: string): Promise<TopPageModelDocument> {
    return this.topPageModel.findById(id).exec();
  }

  public async findByAlias(alias: string): Promise<TopPageModelDocument> {
    return this.topPageModel.findOne({ alias }).exec();
  }

  public findByCategory(
    firstCategory: TopLevelCategories,
  ): Promise<TopPageModelDocument[]> {
    return this.topPageModel
      .find({ firstCategory }, { alias: 1, secondCategory: 1, title: 1 })
      .exec();
  }

  public async deleteById(
    id: string,
  ): Promise<ModifyResult<TopPageModelDocument>> {
    return this.topPageModel.findByIdAndDelete(id).exec();
  }

  public async updateById(id: string, dto: CreateTopPageDto) {
    return this.topPageModel.findByIdAndUpdate(id, dto, { new: true }).exec();
  }
}

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export enum TopLevelCategories {
  Courses,
  Services,
  Books,
  Products,
}

export type TopPageModelDocument = HydratedDocument<TopPageModel>;

export class HhData {
  @Prop()
  count: number;

  @Prop()
  juniorSalary: number;

  @Prop()
  middleSalary: number;

  @Prop()
  seniorSalary: number;
}

export class Advantage {
  @Prop()
  title: string;

  @Prop()
  description: string;
}

@Schema()
export class TopPageModel {
  @Prop({ enum: TopLevelCategories })
  firstCategory: TopLevelCategories;

  @Prop()
  secondCategory: string;

  @Prop({ unique: true })
  alias: string;

  @Prop()
  title: string;

  @Prop(HhData)
  hh?: HhData;

  @Prop([Advantage])
  advantages: Advantage[];

  @Prop()
  seoText: string;

  @Prop()
  tagsTitle: string;

  @Prop([String])
  tags: string[];
}

export const TopPageSchema = SchemaFactory.createForClass(TopPageModel);
TopPageSchema.index({ '$**': 'text' });

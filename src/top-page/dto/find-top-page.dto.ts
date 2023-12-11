import { TopLevelCategories } from '../top-page.model';
import { IsEnum } from 'class-validator';

export class FindTopPageDto {
  @IsEnum(TopLevelCategories)
  firstCategory: TopLevelCategories;
}

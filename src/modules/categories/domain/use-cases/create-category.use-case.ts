import { injectable, inject } from "inversify";
import {
  CategoriesRepository,
  CreateCategoryData,
} from "../../data/repositories/categories.repository";
import { ICategoria } from "@/data/interfaces/interfaces.interface";
import { createCategoryResponseAdapter } from "../../data/adapters/categories.response.adapter";

@injectable()
export class CreateCategoryUseCase {
  constructor(
    @inject(CategoriesRepository)
    private categoriesRepository: CategoriesRepository
  ) {}

  async execute(
    data: CreateCategoryData,
    file: File,
    token: string
  ): Promise<ICategoria> {
    const response = await this.categoriesRepository.create(data, file, token);
    return createCategoryResponseAdapter(response);
  }
}

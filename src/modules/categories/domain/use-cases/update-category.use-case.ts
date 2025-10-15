import { injectable, inject } from "inversify";
import {
  CategoriesRepository,
  UpdateCategoryData,
} from "../../data/repositories/categories.repository";
import { ICategoria } from "@/data/interfaces/interfaces.interface";
import { updateCategoryResponseAdapter } from "../../data/adapters/categories.response.adapter";

@injectable()
export class UpdateCategoryUseCase {
  constructor(
    @inject(CategoriesRepository)
    private categoriesRepository: CategoriesRepository
  ) {}

  async execute(
    categoryId: number,
    data: UpdateCategoryData,
    file: File | null,
    token: string
  ): Promise<ICategoria> {
    const response = await this.categoriesRepository.update(
      categoryId,
      data,
      file,
      token
    );
    return updateCategoryResponseAdapter(response);
  }
}

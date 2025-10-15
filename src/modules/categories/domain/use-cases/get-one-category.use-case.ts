import { injectable, inject } from "inversify";
import { CategoriesRepository } from "../../data/repositories/categories.repository";
import { ICategoria } from "@/data/interfaces/interfaces.interface";
import { categoryResponseAdapter } from "../../data/adapters/categories.response.adapter";

@injectable()
export class GetOneCategoryUseCase {
  constructor(
    @inject(CategoriesRepository)
    private categoriesRepository: CategoriesRepository
  ) {}

  async execute(categoryId: number, token: string): Promise<ICategoria> {
    const response = await this.categoriesRepository.getOne(categoryId, token);
    return categoryResponseAdapter(response);
  }
}

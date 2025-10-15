import { injectable, inject } from "inversify";
import { CategoriesRepository } from "../../data/repositories/categories.repository";

@injectable()
export class DeleteCategoryUseCase {
  constructor(
    @inject(CategoriesRepository)
    private categoriesRepository: CategoriesRepository
  ) {}

  async execute(categoryId: number, token: string): Promise<void> {
    await this.categoriesRepository.delete(categoryId, token);
  }
}

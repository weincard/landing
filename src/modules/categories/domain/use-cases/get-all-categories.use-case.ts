import { injectable, inject } from "inversify";
import { CategoriesRepository } from "../../data/repositories/categories.repository";
import { ICategoria } from "@/data/interfaces/interfaces.interface";
import { allCategoriesResponseAdapter } from "../../data/adapters/categories.response.adapter";

@injectable()
export class GetAllCategoriesUseCase {
  constructor(
    @inject(CategoriesRepository)
    private categoriesRepository: CategoriesRepository
  ) {}

  async execute(): Promise<ICategoria[]> {
    const response = await this.categoriesRepository.getAll();
    return allCategoriesResponseAdapter(response);
  }
}

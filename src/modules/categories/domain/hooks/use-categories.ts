import { useState } from "react";
import container from "@/lib/di/container";
import { ICategoria } from "@/data/interfaces/interfaces.interface";
import { GetAllCategoriesUseCase } from "../use-cases/get-all-categories.use-case";
import { GetOneCategoryUseCase } from "../use-cases/get-one-category.use-case";
import { CreateCategoryUseCase } from "../use-cases/create-category.use-case";
import { UpdateCategoryUseCase } from "../use-cases/update-category.use-case";
import { DeleteCategoryUseCase } from "../use-cases/delete-category.use-case";
import {
  CreateCategoryData,
  UpdateCategoryData,
} from "../../data/repositories/categories.repository";

export const useCategories = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAllCategories = async (token: string): Promise<ICategoria[]> => {
    setLoading(true);
    setError(null);
    try {
      const useCase = container.get(GetAllCategoriesUseCase);
      const categories = await useCase.execute(token);
      return categories;
    } catch (err: any) {
      setError(err.message || "Error al obtener las categorías");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getOneCategory = async (
    categoryId: number,
    token: string
  ): Promise<ICategoria> => {
    setLoading(true);
    setError(null);
    try {
      const useCase = container.get(GetOneCategoryUseCase);
      const category = await useCase.execute(categoryId, token);
      return category;
    } catch (err: any) {
      setError(err.message || "Error al obtener la categoría");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createCategory = async (
    data: CreateCategoryData,
    file: File,
    token: string
  ): Promise<ICategoria> => {
    setLoading(true);
    setError(null);
    try {
      const useCase = container.get(CreateCategoryUseCase);
      const category = await useCase.execute(data, file, token);
      return category;
    } catch (err: any) {
      setError(err.message || "Error al crear la categoría");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateCategory = async (
    categoryId: number,
    data: UpdateCategoryData,
    file: File | null,
    token: string
  ): Promise<ICategoria> => {
    setLoading(true);
    setError(null);
    try {
      const useCase = container.get(UpdateCategoryUseCase);
      const category = await useCase.execute(categoryId, data, file, token);
      return category;
    } catch (err: any) {
      setError(err.message || "Error al actualizar la categoría");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (
    categoryId: number,
    token: string
  ): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const useCase = container.get(DeleteCategoryUseCase);
      await useCase.execute(categoryId, token);
    } catch (err: any) {
      setError(err.message || "Error al eliminar la categoría");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    getAllCategories,
    getOneCategory,
    createCategory,
    updateCategory,
    deleteCategory,
  };
};

import { ICategoria } from "@/data/interfaces/interfaces.interface";
import {
  CategoryResponse,
  CategoryCreateResponse,
  CategoryUpdateResponse,
  AllCategoriesResponse,
} from "../interfaces/categories.response.interface";

/**
 * Recursively adapt category with children
 */
const adaptCategoryWithChildren = (category: CategoryResponse): ICategoria => {
  return {
    categoryId: category.categoryId,
    name: category.name,
    description: category.description ?? undefined,
    image: category.image ?? null,
    slug: category.slug,
    parentCategory: category.parentCategory ?? null,
    children: category.children?.map(adaptCategoryWithChildren) ?? [],
  };
};

/**
 * Adapter to transform API category response to domain ICategoria
 */
export const categoryResponseAdapter = (
  response: CategoryResponse
): ICategoria => {
  return adaptCategoryWithChildren(response);
};

/**
 * Adapter for create category response
 */
export const createCategoryResponseAdapter = (
  response: CategoryCreateResponse
): ICategoria => {
  return {
    categoryId: response.categoryId,
    name: response.name,
    description: response.description ?? undefined,
    image: response.image ?? null,
    slug: response.slug,
    parentCategory: response.parentCategory ?? null,
  };
};

/**
 * Adapter for update category response
 */
export const updateCategoryResponseAdapter = (
  response: CategoryUpdateResponse
): ICategoria => {
  return {
    categoryId: response.categoryId,
    name: response.name,
    description: response.description ?? undefined,
    image: response.image ?? null,
    slug: response.slug,
    parentCategory: response.parentCategory ?? null,
  };
};

/**
 * Adapter for all categories response (returns array with hierarchy)
 */
export const allCategoriesResponseAdapter = (
  response: AllCategoriesResponse
): ICategoria[] => {
  // API returns { count: number, categories: CategoryResponse[] }
  if (response.categories && Array.isArray(response.categories)) {
    return response.categories.map(adaptCategoryWithChildren);
  }

  return [];
};

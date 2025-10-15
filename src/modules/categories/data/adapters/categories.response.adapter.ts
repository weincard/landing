import { ICategoria } from "@/data/interfaces/interfaces.interface";
import {
  CategoryResponse,
  CategoryCreateResponse,
  CategoryUpdateResponse,
  AllCategoriesResponse,
} from "../interfaces/categories.response.interface";

/**
 * Adapter to transform API category response to domain ICategoria
 */
export const categoryResponseAdapter = (
  response: CategoryResponse
): ICategoria => {
  return {
    idCategoria: response.id,
    idCategoriaPadre: response.parentCategory ?? null,
    nombre: response.name,
    descripcion: response.description ?? undefined,
    imagen: response.image ?? null,
    slug: response.name.toLowerCase().replace(/\s+/g, "-"),
  };
};

/**
 * Adapter for create category response
 */
export const createCategoryResponseAdapter = (
  response: CategoryCreateResponse
): ICategoria => {
  return {
    idCategoria: response.id,
    idCategoriaPadre: response.parentCategory ?? null,
    nombre: response.name,
    descripcion: response.description ?? undefined,
    imagen: response.image,
    slug: response.name.toLowerCase().replace(/\s+/g, "-"),
  };
};

/**
 * Adapter for update category response
 */
export const updateCategoryResponseAdapter = (
  response: CategoryUpdateResponse
): ICategoria => {
  return {
    idCategoria: response.id,
    idCategoriaPadre: response.parentCategory ?? null,
    nombre: response.name,
    descripcion: response.description ?? undefined,
    imagen: response.image,
    slug: response.name.toLowerCase().replace(/\s+/g, "-"),
  };
};

/**
 * Adapter for all categories response (returns array)
 */
export const allCategoriesResponseAdapter = (
  response: AllCategoriesResponse | CategoryResponse[]
): ICategoria[] => {
  // API returns array directly
  if (Array.isArray(response)) {
    return response.map(categoryResponseAdapter);
  }

  // Handle if it's wrapped in an object
  if (response.categories) {
    return response.categories.map(categoryResponseAdapter);
  }

  // If it's an object with numeric keys
  const categories = Object.values(response).filter(
    (item): item is CategoryResponse => typeof item === "object" && "id" in item
  );
  return categories.map(categoryResponseAdapter);
};

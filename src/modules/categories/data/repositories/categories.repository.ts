import { injectable } from "inversify";
import { apiUrls } from "@/config/protocols/http/api_urls";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export interface CreateCategoryData {
  name: string;
  description?: string | null;
  parentCategory?: number | null;
}

export interface UpdateCategoryData {
  name?: string;
  description?: string | null;
  parentCategory?: number | null;
}

@injectable()
export class CategoriesRepository {
  /**
   * Get all categories (requires authentication)
   */
  async getAll(token: string): Promise<any> {
    const response = await fetch(`${API_URL}${apiUrls.categories.getAll}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al obtener las categorías");
    }

    return response.json();
  }

  /**
   * Get one category by ID
   */
  async getOne(categoryId: number, token: string): Promise<any> {
    const response = await fetch(
      `${API_URL}${apiUrls.categories.getOne}/${categoryId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al obtener la categoría");
    }

    return response.json();
  }

  /**
   * Create a new category (requires SUPERADMIN role)
   */
  async create(
    data: CreateCategoryData,
    file: File,
    token: string
  ): Promise<any> {
    const formData = new FormData();
    formData.append("name", data.name);
    if (data.description) {
      formData.append("description", data.description);
    }
    // Only add parentCategory if it's a valid number (not null/undefined)
    if (data.parentCategory !== null && data.parentCategory !== undefined) {
      formData.append("parentCategory", data.parentCategory.toString());
    }
    formData.append("file", file);

    const response = await fetch(`${API_URL}${apiUrls.categories.create}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al crear la categoría");
    }

    return response.json();
  }

  /**
   * Update an existing category (requires SUPERADMIN role)
   */
  async update(
    categoryId: number,
    data: UpdateCategoryData,
    file: File | null,
    token: string
  ): Promise<any> {
    const formData = new FormData();

    if (data.name) {
      formData.append("name", data.name);
    }
    if (data.description !== undefined) {
      formData.append("description", data.description || "");
    }
    if (data.parentCategory !== undefined) {
      // Send parentCategory only if it's a valid number, otherwise omit it
      if (data.parentCategory !== null) {
        formData.append("parentCategory", data.parentCategory.toString());
      }
      // If it's null, we simply don't include it in the FormData
    }
    if (file) {
      formData.append("file", file);
    }

    const response = await fetch(
      `${API_URL}${apiUrls.categories.update}/${categoryId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al actualizar la categoría");
    }

    return response.json();
  }

  /**
   * Delete a category (requires SUPERADMIN role)
   */
  async delete(categoryId: number, token: string): Promise<any> {
    const response = await fetch(
      `${API_URL}${apiUrls.categories.delete}/${categoryId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al eliminar la categoría");
    }

    return response.json();
  }
}

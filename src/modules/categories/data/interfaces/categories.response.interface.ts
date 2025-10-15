export interface CategoryResponse {
  id: number;
  name: string;
  description?: string | null;
  parentCategory?: number | null;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryCreateResponse {
  id: number;
  name: string;
  description?: string | null;
  parentCategory?: number | null;
  image: string;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryUpdateResponse {
  id: number;
  name: string;
  description?: string | null;
  parentCategory?: number | null;
  image: string;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryDeleteResponse {
  message: string;
  deletedCategory: {
    id: number;
    name: string;
  };
}

export interface AllCategoriesResponse {
  categories?: CategoryResponse[];
  // If API returns array directly
  [key: number]: CategoryResponse;
}

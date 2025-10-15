export interface CategoryResponse {
  categoryId: number;
  name: string;
  description?: string | null;
  image?: string | null;
  slug?: string;
  parentCategory?: {
    categoryId: number;
    name: string;
    description?: string | null;
    image?: string | null;
    slug?: string;
  } | null;
  children?: CategoryResponse[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CategoryCreateResponse {
  categoryId: number;
  name: string;
  description?: string | null;
  image?: string | null;
  slug?: string;
  parentCategory?: {
    categoryId: number;
    name: string;
    description?: string | null;
    image?: string | null;
    slug?: string;
  } | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CategoryUpdateResponse {
  categoryId: number;
  name: string;
  description?: string | null;
  image?: string | null;
  slug?: string;
  parentCategory?: {
    categoryId: number;
    name: string;
    description?: string | null;
    image?: string | null;
    slug?: string;
  } | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CategoryDeleteResponse {
  message: string;
  deletedCategory: {
    categoryId: number;
    name: string;
  };
}

export interface AllCategoriesResponse {
  count: number;
  categories: CategoryResponse[];
}

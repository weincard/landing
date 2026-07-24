import { honoClient } from "./honoClient";

// Branch (food) category — the category chips inside a merchant category.
// GET /categories/all is public; we only type what the chips consume.
export interface FoodCategory {
  categoryId: number;
  name: string;
}

// Scoped flat list of the categories linked to a merchant (ally) category —
// the same fetch the Flutter CategoryFilterBar uses. The unscoped call returns
// a tree instead, so callers must always pass a merchantCategoryId.
export const getCategories = (merchantCategoryId: number) =>
  honoClient.get<FoodCategory[]>(
    `/categories/all?merchantCategoryId=${merchantCategoryId}`,
  );

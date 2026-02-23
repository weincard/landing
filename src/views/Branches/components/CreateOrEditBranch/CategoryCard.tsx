import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import type { ICategoria } from "@/data/interfaces/interfaces.interface";
import { CategoryRadioGroup } from "./CategoryRadioGroup";

interface CategoryCardProps {
  categoryId: string;
  categories: ICategoria[];
  loadingCategories: boolean;
  onCategoryChange: (value: string) => void;
  onCreateCategory: () => void;
  onEditCategory?: (categoryId: number) => void;
}

export function CategoryCard({
  categoryId,
  categories,
  loadingCategories,
  onCategoryChange,
  onCreateCategory,
  onEditCategory,
}: CategoryCardProps) {
  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-semibold">Categoría *</h2>
      </CardHeader>
      <CardContent className="space-y-4">
        {loadingCategories ? (
          <div className="text-sm text-muted-foreground">
            Cargando categorías...
          </div>
        ) : (
          <CategoryRadioGroup
            categoryId={categoryId}
            categories={categories}
            onCategoryChange={onCategoryChange}
            onEditCategory={onEditCategory}
          />
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={onCreateCategory}
          disabled={loadingCategories}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Crear nueva categoría
        </Button>
      </CardContent>
    </Card>
  );
}

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import type { ICategoria } from "@/data/interfaces/interfaces.interface";

interface CategoryCardProps {
  categoryId: string;
  categories: ICategoria[];
  loadingCategories: boolean;
  onCategoryChange: (value: string) => void;
  onCreateCategory: () => void;
}

export function CategoryCard({
  categoryId,
  categories,
  loadingCategories,
  onCategoryChange,
  onCreateCategory,
}: CategoryCardProps) {
  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-semibold">Categoría *</h2>
      </CardHeader>
      <CardContent className="space-y-4">
        <Select
          value={categoryId}
          onValueChange={onCategoryChange}
          disabled={loadingCategories}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecciona una categoría" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem
                key={category.categoryId}
                value={category.categoryId.toString()}
              >
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

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

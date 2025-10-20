import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import type { ICategoria } from "@/data/interfaces/interfaces.interface";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";

interface CategoryRadioGroupProps {
  categoryId: string;
  categories: ICategoria[];
  onCategoryChange: (value: string) => void;
}

export function CategoryRadioGroup({
  categoryId,
  categories,
  onCategoryChange,
}: CategoryRadioGroupProps) {
  const renderCategory = (category: ICategoria, level: number = 0) => {
    const hasChildren = category.children && category.children.length > 0;
    const isParent = hasChildren;

    return (
      <div key={category.categoryId} className="space-y-2">
        {/* Parent Category */}
        <div
          className={`flex items-start space-x-3 ${
            level > 0 ? "ml-1" : ""
          } py-2`}
        >
          <RadioGroupItem
            value={category.categoryId.toString()}
            id={`category-${category.categoryId}`}
            className="mt-1"
          />
          <Label
            htmlFor={`category-${category.categoryId}`}
            className={`flex-1 cursor-pointer ${
              isParent ? "font-semibold text-base" : "font-normal text-sm"
            }`}
          >
            <div className="flex items-center gap-2">
              {category.image && (
                <Image
                  src={category.image}
                  alt={category.name}
                  width={16}
                  height={16}
                  className="object-cover rounded"
                />
              )}
              <span>{category.name}</span>
            </div>
            {!!category.description && (
              <p className="text-xs text-muted-foreground font-normal mt-1">
                {category.description}
              </p>
            )}
          </Label>
        </div>

        {/* Children Categories */}
        {hasChildren && (
          <div className="ml-4 border-l-2 border-muted pl-2">
            {category.children!.map((child) =>
              renderCategory(child, level + 1)
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <ScrollArea className="h-[400px] pr-4">
      <RadioGroup value={categoryId} onValueChange={onCategoryChange}>
        <div className="space-y-1">
          {categories.map((category) => renderCategory(category))}
        </div>
      </RadioGroup>
    </ScrollArea>
  );
}

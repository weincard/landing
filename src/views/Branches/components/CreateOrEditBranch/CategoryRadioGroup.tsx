"use client";

import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Pencil, Trash2, Loader2 } from "lucide-react";
import type { ICategoria } from "@/data/interfaces/interfaces.interface";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface CategoryRadioGroupProps {
  categoryId: string;
  categories: ICategoria[];
  onCategoryChange: (value: string) => void;
  onEditCategory?: (categoryId: number) => void;
  onDeleteCategory?: (categoryId: number) => Promise<void>;
}

export function CategoryRadioGroup({
  categoryId,
  categories,
  onCategoryChange,
  onEditCategory,
  onDeleteCategory,
}: CategoryRadioGroupProps) {
  const [confirmDelete, setConfirmDelete] = useState<ICategoria | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleConfirmDelete = async () => {
    if (!confirmDelete || !onDeleteCategory) return;
    setDeleting(true);
    try {
      await onDeleteCategory(confirmDelete.categoryId);
    } finally {
      setDeleting(false);
      setConfirmDelete(null);
    }
  };

  const renderCategory = (category: ICategoria, level: number = 0) => {
    const hasChildren = category.children && category.children.length > 0;
    const isParent = hasChildren;

    return (
      <div key={category.categoryId} className="space-y-2">
        <div
          className={`flex items-center space-x-3 group ${
            level > 0 ? "ml-1" : ""
          } py-2`}
        >
          <RadioGroupItem
            value={category.categoryId.toString()}
            id={`category-${category.categoryId}`}
            className="shrink-0"
          />
          <Label
            htmlFor={`category-${category.categoryId}`}
            className={`flex-1 cursor-pointer min-w-0 ${
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
                  className="object-cover rounded shrink-0"
                />
              )}
              <span className="truncate flex-1">{category.name}</span>
              <span className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                {onEditCategory && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onEditCategory(category.categoryId);
                    }}
                    className="text-muted-foreground hover:text-foreground"
                    aria-label={`Editar ${category.name}`}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                )}
                {onDeleteCategory && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setConfirmDelete(category);
                    }}
                    className="text-muted-foreground hover:text-destructive"
                    aria-label={`Eliminar ${category.name}`}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </span>
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
    <>
      <ScrollArea className="h-[400px] pr-4">
        <RadioGroup value={categoryId} onValueChange={onCategoryChange}>
          <div className="space-y-1">
            {categories.map((category) => renderCategory(category))}
          </div>
        </RadioGroup>
      </ScrollArea>

      <AlertDialog
        open={!!confirmDelete}
        onOpenChange={(open) => { if (!open && !deleting) setConfirmDelete(null); }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar categoría?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará la categoría{" "}
              <span className="font-semibold">"{confirmDelete?.name}"</span>
              {confirmDelete?.children?.length ? (
                <> y sus {confirmDelete.children.length} subcategoría(s)</>
              ) : null}
              .
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

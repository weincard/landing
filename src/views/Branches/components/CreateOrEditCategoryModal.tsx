"use client";

import { useState, useEffect } from "react";
import { useCategories } from "@/modules/categories/domain/hooks/use-categories";
import { ICategoria } from "@/data/interfaces/interfaces.interface";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Upload, X } from "lucide-react";
import Image from "next/image";

interface CreateOrEditCategoryModalProps {
  token: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  categoryId?: number;
  allCategories?: ICategoria[];
}

export const CreateOrEditCategoryModal: React.FC<
  CreateOrEditCategoryModalProps
> = ({ token, isOpen, onClose, onSuccess, categoryId, allCategories = [] }) => {
  const { loading, createCategory, updateCategory, getOneCategory } =
    useCategories();

  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [parentCategoryId, setParentCategoryId] = useState<number | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);

  const [loadingCategory, setLoadingCategory] = useState(false);

  // Load category data in edit mode
  useEffect(() => {
    if (categoryId && isOpen) {
      setLoadingCategory(true);
      getOneCategory(categoryId, token)
        .then((category) => {
          setName(category.name);
          setDescription(category.description || "");
          setParentCategoryId(category.parentCategory?.categoryId || null);
          setExistingImageUrl(category.image || null);
        })
        .catch((error) => {
          toast.error(error.message || "Error al cargar la categoría");
          onClose();
        })
        .finally(() => {
          setLoadingCategory(false);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId, isOpen]);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setName("");
      setDescription("");
      setParentCategoryId(null);
      setImageFile(null);
      setImagePreview(null);
      setExistingImageUrl(null);
      setLoadingCategory(false);
    }
  }, [isOpen]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSave = async () => {
    // Validation
    if (!name.trim()) {
      toast.error("El nombre es requerido");
      return;
    }

    // Image is required only for create mode
    if (!categoryId && !imageFile) {
      toast.error("La imagen es requerida");
      return;
    }

    try {
      if (categoryId) {
        // Update mode
        await updateCategory(
          categoryId,
          {
            name: name.trim(),
            description: description.trim() || null,
            parentCategory: parentCategoryId,
          },
          imageFile,
          token
        );
        toast.success("Categoría actualizada exitosamente");
      } else {
        // Create mode
        await createCategory(
          {
            name: name.trim(),
            description: description.trim() || null,
            parentCategory: parentCategoryId,
          },
          imageFile!,
          token
        );
        toast.success("Categoría creada exitosamente");
      }

      onSuccess?.();
      onClose();
    } catch (error: any) {
      toast.error(error.message || "Error al guardar la categoría");
    }
  };

  // Filter out current category from parent selection to avoid circular reference
  const availableParentCategories = allCategories.filter(
    (cat) => cat.categoryId !== categoryId
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {categoryId ? "Editar categoría" : "Crear categoría"}
          </DialogTitle>
          <DialogDescription>
            {categoryId
              ? "Actualiza los datos de la categoría"
              : "Completa los datos para crear una nueva categoría"}
          </DialogDescription>
        </DialogHeader>

        {loadingCategory ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <div className="grid gap-4 py-4">
            {/* Name */}
            <div className="grid gap-2">
              <Label htmlFor="name">
                Nombre <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej: Vinos Tintos"
              />
            </div>

            {/* Description */}
            <div className="grid gap-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe la categoría..."
                rows={3}
              />
            </div>

            {/* Parent Category */}
            <div className="grid gap-2">
              <Label htmlFor="parentCategory">Categoría padre</Label>
              <Select
                value={parentCategoryId?.toString() || "none"}
                onValueChange={(value) =>
                  setParentCategoryId(value === "none" ? null : Number(value))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sin categoría padre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sin categoría padre</SelectItem>
                  {availableParentCategories.map((category) => (
                    <SelectItem
                      key={category.categoryId}
                      value={category.categoryId.toString()}
                    >
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Image Upload */}
            <div className="grid gap-2">
              <Label htmlFor="image">
                Imagen {!categoryId && <span className="text-red-500">*</span>}
              </Label>

              {/* Show existing image in edit mode */}
              {categoryId && existingImageUrl && !imagePreview && (
                <div className="relative w-full h-40 border rounded-md overflow-hidden">
                  <Image
                    src={existingImageUrl}
                    alt="Imagen actual"
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              {/* Show preview if new image selected */}
              {imagePreview && (
                <div className="relative w-full h-40 border rounded-md overflow-hidden">
                  <Image
                    src={imagePreview}
                    alt="Vista previa"
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}

              {/* Upload button */}
              <div className="flex items-center gap-2">
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <Label
                  htmlFor="image"
                  className="cursor-pointer flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-50"
                >
                  <Upload className="h-4 w-4" />
                  {imageFile
                    ? "Cambiar imagen"
                    : categoryId
                    ? "Subir nueva imagen"
                    : "Subir imagen"}
                </Label>
                {imageFile && (
                  <span className="text-sm text-gray-500">
                    {imageFile.name}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={loading || loadingCategory}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {categoryId ? "Actualizar" : "Crear"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

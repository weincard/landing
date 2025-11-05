import { useCallback } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import Image from "next/image";

interface ImagesCardProps {
  images: string[];
  imageFiles: File[];
  onImagesChange: (newImages: string[], newFiles: File[]) => void;
}

export function ImagesCard({
  images,
  imageFiles,
  onImagesChange,
}: ImagesCardProps) {
  const handleImagesUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        const filesArray = Array.from(e.target.files);
        const newImages: string[] = [];
        const newFiles: File[] = [];

        filesArray.forEach((file) => {
          newFiles.push(file);
          const reader = new FileReader();
          reader.onloadend = () => {
            newImages.push(reader.result as string);
            if (newImages.length === filesArray.length) {
              onImagesChange(
                [...images, ...newImages],
                [...imageFiles, ...newFiles]
              );
            }
          };
          reader.readAsDataURL(file);
        });
      }
    },
    [images, imageFiles, onImagesChange]
  );

  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-semibold">Imágenes</h2>
      </CardHeader>
      <CardContent>
        <div className="border-2 border-dashed rounded-lg p-8 text-center">
          {images.length > 0 ? (
            <div className="grid grid-cols-4 gap-4">
              {images.map((img, idx) => (
                <div key={idx} className="relative aspect-square">
                  <Image
                    src={img}
                    alt={`Image ${idx + 1}`}
                    fill
                    className="object-cover rounded"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
              <div className="text-sm text-muted-foreground">
                Arrastra varias imágenes aquí
              </div>
            </div>
          )}
          <input
            type="file"
            id="images-upload"
            className="hidden"
            accept="image/*"
            multiple
            onChange={handleImagesUpload}
          />
          <Button
            variant="link"
            className="mt-2"
            onClick={() => document.getElementById("images-upload")?.click()}
          >
            Agregar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

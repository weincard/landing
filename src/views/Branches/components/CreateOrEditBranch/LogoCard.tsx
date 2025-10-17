import { useCallback } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import Image from "next/image";

interface LogoCardProps {
  logo: string;
  onLogoChange: (file: File, base64: string) => void;
}

export function LogoCard({ logo, onLogoChange }: LogoCardProps) {
  const handleLogoUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
          onLogoChange(file, reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    },
    [onLogoChange]
  );

  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-semibold">Logo *</h2>
      </CardHeader>
      <CardContent>
        <div className="border-2 border-dashed rounded-lg p-8 text-center">
          {logo ? (
            <div className="relative w-32 h-32 mx-auto">
              <Image src={logo} alt="Logo" fill className="object-contain" />
            </div>
          ) : (
            <div className="space-y-2">
              <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
              <div className="text-sm text-muted-foreground">
                Arrastra una imagen aquí
              </div>
            </div>
          )}
          <input
            type="file"
            id="logo-upload"
            className="hidden"
            accept="image/*"
            onChange={handleLogoUpload}
          />
          <Button
            variant="link"
            className="mt-2"
            onClick={() => document.getElementById("logo-upload")?.click()}
          >
            Agregar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface BranchHeaderProps {
  isEditing: boolean;
  isLoading: boolean;
  onSave: () => void;
  onCancel: () => void;
}

export function BranchHeader({
  isEditing,
  isLoading,
  onSave,
  onCancel,
}: BranchHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-semibold">
        {isEditing ? "Editar sucursal" : "Agregar sucursal"}
      </h1>
      <div className="flex items-center gap-2">
        <Button variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancelar
        </Button>
        <Button onClick={onSave} disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ...
            </>
          ) : (
            "Guardar"
          )}
        </Button>
      </div>
    </div>
  );
}

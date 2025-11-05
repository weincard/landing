import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Loader2 } from "lucide-react";

interface CreationProgress {
  isCreating: boolean;
  step: string;
  currentOffer: number;
  totalOffers: number;
}

interface BranchHeaderProps {
  isEditing: boolean;
  isLoading: boolean;
  onSave: () => void;
  onCancel: () => void;
  creationProgress?: CreationProgress;
}

export function BranchHeader({
  isEditing,
  isLoading,
  onSave,
  onCancel,
  creationProgress,
}: BranchHeaderProps) {
  const getProgressPercentage = () => {
    if (!creationProgress || creationProgress.totalOffers === 0) return 0;
    if (creationProgress.currentOffer === 0) return 10; // Branch creation
    return (
      10 + (creationProgress.currentOffer / creationProgress.totalOffers) * 90
    );
  };

  return (
    <div className="space-y-4">
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

      {/* Progress indicator for creation flow */}
      {creationProgress && creationProgress.isCreating && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-blue-900">
              Creando sucursal y ofertas...
            </p>
            <span className="text-xs text-blue-600">
              {Math.round(getProgressPercentage())}%
            </span>
          </div>
          <Progress value={getProgressPercentage()} className="mb-2" />
          <p className="text-xs text-blue-700">{creationProgress.step}</p>
        </div>
      )}
    </div>
  );
}

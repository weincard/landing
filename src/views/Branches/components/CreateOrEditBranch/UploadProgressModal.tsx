import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Upload, Loader2, X } from "lucide-react";
import type { UploadProgress } from "@/modules/s3";

interface UploadProgressModalProps {
  progress: UploadProgress[];
  step: string;
  onCancel?: () => void;
}

export function UploadProgressModal({
  progress,
  step,
  onCancel,
}: UploadProgressModalProps) {
  const totalProgress =
    progress.length > 0
      ? progress.reduce((acc, p) => acc + p.progress, 0) / progress.length
      : 0;

  const hasErrors = progress.some((p) => p.status === "error");
  const isCompleted =
    progress.length > 0 &&
    progress.every((p) => p.status === "completed" || p.status === "error");

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              {step}
            </div>
            {onCancel && (hasErrors || isCompleted) && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onCancel}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Overall Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progreso total</span>
              <span>{Math.round(totalProgress)}%</span>
            </div>
            <Progress value={totalProgress} />
          </div>

          {/* Individual File Progress */}
          {progress.length > 0 && (
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {progress.map((item) => (
                <div
                  key={item.fileName}
                  className="flex items-center gap-3 text-sm"
                >
                  {item.status === "completed" && (
                    <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                  )}
                  {item.status === "error" && (
                    <XCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
                  )}
                  {item.status === "uploading" && (
                    <Loader2 className="h-4 w-4 animate-spin text-blue-600 flex-shrink-0" />
                  )}
                  {item.status === "pending" && (
                    <Upload className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  )}

                  <div className="flex-1 min-w-0">
                    <p className="truncate">{item.fileName}</p>
                    {item.status === "uploading" && (
                      <Progress value={item.progress} className="h-1 mt-1" />
                    )}
                    {item.status === "error" && item.error && (
                      <p className="text-xs text-red-600 mt-1">{item.error}</p>
                    )}
                  </div>

                  <span className="text-xs text-muted-foreground">
                    {item.progress}%
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Cancel/Close Button */}
          {onCancel && (hasErrors || isCompleted) && (
            <div className="flex justify-end pt-2">
              <Button variant="outline" onClick={onCancel} className="w-full">
                {hasErrors ? "Cerrar" : "Aceptar"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

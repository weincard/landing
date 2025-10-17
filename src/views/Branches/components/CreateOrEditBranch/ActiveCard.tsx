import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface ActiveCardProps {
  isActive: boolean;
  onActiveChange: (value: boolean) => void;
}

export function ActiveCard({ isActive, onActiveChange }: ActiveCardProps) {
  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-semibold">Activo</h2>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <Label className="text-muted-foreground" htmlFor="active">
            Sí
          </Label>
          <Switch
            id="active"
            checked={isActive}
            onCheckedChange={onActiveChange}
          />
        </div>
      </CardContent>
    </Card>
  );
}

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface OfferCardProps {
  selectedDays: string[];
  selectedTimes: string[];
  onToggleDay: (day: string) => void;
  onToggleTime: (time: string) => void;
}

export function OfferCard({
  selectedDays,
  selectedTimes,
  onToggleDay,
  onToggleTime,
}: OfferCardProps) {
  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-semibold">Oferta</h2>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-muted-foreground">Tipo de oferta</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Cantidad de comensales" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="comensales">
                  Cantidad de comensales
                </SelectItem>
                <SelectItem value="porcentaje">Porcentaje</SelectItem>
                <SelectItem value="monto">Monto fijo</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-muted-foreground">Tipo de membresía</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Wein card premium" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="premium">Wein card premium</SelectItem>
                <SelectItem value="basic">Wein card basic</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-muted-foreground">
            Establece la cantidad de comensales
          </Label>
          <Input placeholder="2×1" />
        </div>

        <div className="space-y-2">
          <Label className="text-muted-foreground">
            Detalles de la promoción
          </Label>
          <Input placeholder="Qué productos" />
        </div>

        <Button variant="link" className="p-0 h-auto text-blue-600">
          Agregar otra oferta
        </Button>
      </CardContent>
    </Card>
  );
}

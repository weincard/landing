import { Card, CardContent, CardHeader } from "@/components/ui/card";
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

interface AvailabilityCardProps {
  selectedDays: string[];
  selectedTimes: string[];
  onToggleDay: (day: string) => void;
  onToggleTime: (time: string) => void;
}

export function AvailabilityCard({
  selectedDays,
  selectedTimes,
  onToggleDay,
  onToggleTime,
}: AvailabilityCardProps) {
  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-semibold">Disponibilidad</h2>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label className="text-muted-foreground">Tipo</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Días" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dias">Días</SelectItem>
              <SelectItem value="horas">Horas</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-muted-foreground">Tipo</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Hora" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hora">Hora</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-muted-foreground">Valores</Label>
          <div className="flex flex-wrap gap-2">
            {["Sábado", "Domingo"].map((day) => (
              <Button
                key={day}
                variant={selectedDays.includes(day) ? "default" : "outline"}
                size="sm"
                onClick={() => onToggleDay(day)}
              >
                {day}
                {selectedDays.includes(day) && <X className="h-3 w-3 ml-1" />}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-muted-foreground">Valores</Label>
          <div className="flex flex-wrap gap-2">
            {["14h", "15h", "16h"].map((time) => (
              <Button
                key={time}
                variant={selectedTimes.includes(time) ? "default" : "outline"}
                size="sm"
                onClick={() => onToggleTime(time)}
              >
                {time}
                {selectedTimes.includes(time) && <X className="h-3 w-3 ml-1" />}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-start">
          <Button variant="link" className="p-0 h-auto text-blue-600">
            Agregar otra disponibilidad
          </Button>
          <Button variant="link" className="p-0 h-auto text-blue-600 mt-4">
            Agregar nuevo beneficio
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

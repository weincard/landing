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
import { X, Trash2 } from "lucide-react";

interface Availability {
  id: string;
  type: "dias" | "horas";
  selectedDays: string[];
  selectedTimes: string[];
}

interface AvailabilityCardProps {
  availabilities: Availability[];
  onAddAvailability: () => void;
  onRemoveAvailability: (id: string) => void;
  onUpdateAvailability: (
    id: string,
    field: keyof Availability,
    value: any
  ) => void;
  onToggleAvailabilityDay: (availabilityId: string, day: string) => void;
  onToggleAvailabilityTime: (availabilityId: string, time: string) => void;
}

export function AvailabilityCard({
  availabilities,
  onAddAvailability,
  onRemoveAvailability,
  onUpdateAvailability,
  onToggleAvailabilityDay,
  onToggleAvailabilityTime,
}: AvailabilityCardProps) {
  const daysOfWeek = [
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
    "Domingo",
  ];

  const hoursOfDay = [
    "00:00",
    "01:00",
    "02:00",
    "03:00",
    "04:00",
    "05:00",
    "06:00",
    "07:00",
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
    "20:00",
    "21:00",
    "22:00",
    "23:00",
  ];

  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-semibold">Disponibilidad</h2>
      </CardHeader>
      <CardContent className="space-y-4">
        {availabilities.map((availability, index) => (
          <div
            key={availability.id}
            className={`space-y-4 ${
              availabilities.length > 1
                ? "p-4 border rounded-lg shadow-sm relative"
                : ""
            }`}
          >
            {availabilities.length > 1 && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                onClick={() => onRemoveAvailability(availability.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}

            <div className="space-y-2">
              <Label className="text-muted-foreground">
                Tipo de disponibilidad
              </Label>
              <Select
                value={availability.type}
                onValueChange={(value: "dias" | "horas") =>
                  onUpdateAvailability(availability.id, "type", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona el tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dias">Días</SelectItem>
                  <SelectItem value="horas">Horas</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-muted-foreground">
                {availability.type === "dias"
                  ? "Días disponibles"
                  : "Horas disponibles"}
              </Label>
              <div className="flex flex-wrap gap-2">
                {availability.type === "dias"
                  ? // Mostrar días de la semana
                    daysOfWeek.map((day) => (
                      <Button
                        key={day}
                        variant={
                          availability.selectedDays.includes(day)
                            ? "default"
                            : "outline"
                        }
                        size="sm"
                        onClick={() =>
                          onToggleAvailabilityDay(availability.id, day)
                        }
                      >
                        {day}
                        {availability.selectedDays.includes(day) && (
                          <X className="h-3 w-3 ml-1" />
                        )}
                      </Button>
                    ))
                  : // Mostrar horas del día
                    hoursOfDay.map((time) => (
                      <Button
                        key={time}
                        variant={
                          availability.selectedTimes.includes(time)
                            ? "default"
                            : "outline"
                        }
                        size="sm"
                        onClick={() =>
                          onToggleAvailabilityTime(availability.id, time)
                        }
                      >
                        {time}
                        {availability.selectedTimes.includes(time) && (
                          <X className="h-3 w-3 ml-1" />
                        )}
                      </Button>
                    ))}
              </div>
            </div>
          </div>
        ))}

        <div className="flex flex-col items-start">
          <Button
            variant="link"
            className="p-0 h-auto text-blue-600"
            onClick={onAddAvailability}
          >
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

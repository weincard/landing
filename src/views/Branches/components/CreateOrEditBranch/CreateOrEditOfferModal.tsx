"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Trash2, Plus } from "lucide-react";
import { toast } from "sonner";

export interface Availability {
  id: string;
  selectedDays: string[];
  selectedTimes: string[];
}

export interface Offer {
  id: string;
  title: string;
  offerType: string;
  membershipType: string;
  quantity: string;
  details: string;
  availabilities: Availability[];
}

interface CreateOrEditOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (offer: Offer) => void;
  offer?: Offer | null;
}

export function CreateOrEditOfferModal({
  isOpen,
  onClose,
  onSave,
  offer,
}: CreateOrEditOfferModalProps) {
  const [formData, setFormData] = useState<Offer>({
    id: "",
    title: "",
    offerType: "",
    membershipType: "",
    quantity: "",
    details: "",
    availabilities: [
      {
        id: "1",
        selectedDays: [],
        selectedTimes: [],
      },
    ],
  });

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

  useEffect(() => {
    if (offer) {
      setFormData(offer);
    } else {
      setFormData({
        id: Date.now().toString(),
        title: "",
        offerType: "",
        membershipType: "",
        quantity: "",
        details: "",
        availabilities: [
          {
            id: "1",
            selectedDays: [],
            selectedTimes: [],
          },
        ],
      });
    }
  }, [offer, isOpen]);

  const handleInputChange = (field: keyof Offer, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const addAvailability = () => {
    const newAvailability: Availability = {
      id: Date.now().toString(),
      selectedDays: [],
      selectedTimes: [],
    };
    setFormData((prev) => ({
      ...prev,
      availabilities: [...prev.availabilities, newAvailability],
    }));
  };

  const removeAvailability = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      availabilities: prev.availabilities.filter((av) => av.id !== id),
    }));
  };

  const toggleAvailabilityDay = (availabilityId: string, day: string) => {
    setFormData((prev) => ({
      ...prev,
      availabilities: prev.availabilities.map((availability) => {
        if (availability.id === availabilityId) {
          const selectedDays = availability.selectedDays.includes(day)
            ? availability.selectedDays.filter((d) => d !== day)
            : [...availability.selectedDays, day];
          return { ...availability, selectedDays };
        }
        return availability;
      }),
    }));
  };

  const toggleAvailabilityTime = (availabilityId: string, time: string) => {
    setFormData((prev) => ({
      ...prev,
      availabilities: prev.availabilities.map((availability) => {
        if (availability.id === availabilityId) {
          const selectedTimes = availability.selectedTimes.includes(time)
            ? availability.selectedTimes.filter((t) => t !== time)
            : [...availability.selectedTimes, time];
          return { ...availability, selectedTimes };
        }
        return availability;
      }),
    }));
  };

  const getQuantityLabel = (offerType: string) => {
    switch (offerType) {
      case "porcentaje":
        return "Porcentaje de descuento";
      case "monto":
        return "Monto fijo del descuento";
      case "promo":
        return "Establece la cantidad de comensales";
      case "menu-wein":
        return "Menu Wein";
      default:
        return "Cantidad";
    }
  };

  const getQuantityPlaceholder = (offerType: string) => {
    switch (offerType) {
      case "porcentaje":
        return "20";
      case "monto":
        return "15000";
      case "promo":
        return "Selecciona la opción";
      case "menu-wein":
        return "";
      default:
        return "Ingresa valor";
    }
  };

  const renderQuantityField = () => {
    if (formData.offerType === "menu-wein") {
      // No mostrar campo de cantidad para menu-wein
      return null;
    }
    if (formData.offerType === "promo") {
      return (
        <Select
          value={formData.quantity}
          onValueChange={(value) => handleInputChange("quantity", value)}
        >
          <SelectTrigger>
            <SelectValue
              placeholder={getQuantityPlaceholder(formData.offerType)}
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2x1">2×1</SelectItem>
            <SelectItem value="3x1">3×1</SelectItem>
            <SelectItem value="3x2">3×2</SelectItem>
          </SelectContent>
        </Select>
      );
    }
    // Para porcentaje y monto, siempre string
    return (
      <div className="relative">
        <Input
          type="text"
          placeholder={getQuantityPlaceholder(formData.offerType)}
          value={formData.quantity}
          onChange={(e) => handleInputChange("quantity", e.target.value)}
        />
      </div>
    );
  };

  const handleSave = () => {
    if (!formData.title.trim()) {
      toast.error("El título de la oferta es requerido");
      return;
    }
    if (!formData.offerType) {
      toast.error("El tipo de oferta es requerido");
      return;
    }
    if (!formData.membershipType) {
      toast.error("El tipo de membresía es requerido");
      return;
    }

    onSave(formData);
    onClose();
  };

  const formatAvailabilityText = (availability: Availability) => {
    const days = availability.selectedDays.join(", ");
    const times = availability.selectedTimes.join(", ");

    if (days && times) {
      return `${days} a las ${times}`;
    } else if (days) {
      return days;
    } else if (times) {
      return `A las ${times}`;
    }
    return "Sin horarios definidos";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {offer ? "Editar Oferta" : "Crear Nueva Oferta"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Título de la oferta */}
          <div className="space-y-2">
            <Label>Título de la oferta</Label>
            <Input
              placeholder="Ej: Descuento en almuerzo ejecutivo"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
            />
          </div>

          {/* Información básica de la oferta */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Tipo de oferta</Label>
              <Select
                value={formData.offerType}
                onValueChange={(value) => {
                  handleInputChange("offerType", value);
                  handleInputChange("quantity", "");
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="promo">Promo</SelectItem>
                  <SelectItem value="porcentaje">Porcentaje</SelectItem>
                  <SelectItem value="monto">Regalo/Cortesía</SelectItem>
                  <SelectItem value="menu-wein">Menu Wein</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Tipo de membresía</Label>
              <Select
                value={formData.membershipType}
                onValueChange={(value) =>
                  handleInputChange("membershipType", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona membresía" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="premium">Wein card premium</SelectItem>
                  <SelectItem value="basic">Wein card basic</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Cantidad */}
          <div className="space-y-2 w-1/2">
            {/* Solo mostrar label y campo si no es menu-wein */}
            {formData.offerType !== "menu-wein" && (
              <>
                <Label>{getQuantityLabel(formData.offerType)}</Label>
                {renderQuantityField()}
              </>
            )}
          </div>

          {/* Detalles */}
          <div className="space-y-2">
            <Label>Detalles de la promoción</Label>
            <Input
              placeholder="Qué productos están incluidos"
              value={formData.details}
              onChange={(e) => handleInputChange("details", e.target.value)}
            />
          </div>

          {/* Disponibilidades */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-lg">Disponibilidades</Label>
              <Button onClick={addAvailability} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Agregar disponibilidad
              </Button>
            </div>

            {formData.availabilities.map((availability, index) => (
              <Card key={availability.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <h4 className="text-md font-medium">
                      Disponibilidad #{index + 1}
                    </h4>
                    {formData.availabilities.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAvailability(availability.id)}
                        className="hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {formatAvailabilityText(availability)}
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Días */}
                  <div className="space-y-2">
                    <Label>Días disponibles</Label>
                    <div className="flex flex-wrap gap-2">
                      {daysOfWeek.map((day) => (
                        <Button
                          key={day}
                          variant={
                            availability.selectedDays.includes(day)
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          onClick={() =>
                            toggleAvailabilityDay(availability.id, day)
                          }
                        >
                          {day}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Horas */}
                  <div className="space-y-2">
                    <Label>Horas disponibles</Label>
                    <div className="flex flex-wrap gap-2">
                      {hoursOfDay.map((time) => (
                        <Button
                          key={time}
                          variant={
                            availability.selectedTimes.includes(time)
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          onClick={() =>
                            toggleAvailabilityTime(availability.id, time)
                          }
                        >
                          {time}
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            {offer ? "Actualizar" : "Crear"} Oferta
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

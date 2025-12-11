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
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

export interface Offer {
  offerId?: number;
  title: string;
  description: string;
  offerType: "percentage" | "fixed_amount" | "promo" | "menu_weincard";
  value: string;
  conditions: string;
  validFrom: string;
  validTo?: string;
  validDays: string[];
  // validHours: string[]; // Deprecated: now using startTime and endTime
  startTime?: string; // Formato HH:mm (ej: "09:00")
  endTime?: string; // Formato HH:mm (ej: "17:00")
  isActive: boolean;
  expiresAt: string;
  excludesBankHolidays: boolean;
  membershipPlanId: number;
  branchId?: number;
}

interface CreateOrEditOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (offer: Offer) => Promise<void> | void;
  offer?: Offer | null;
}

export function CreateOrEditOfferModal({
  isOpen,
  onClose,
  onSave,
  offer,
}: CreateOrEditOfferModalProps) {
  const [formData, setFormData] = useState<Offer>({
    title: "",
    description: "",
    offerType: "percentage",
    value: "",
    conditions: "",
    validFrom: new Date().toISOString().split("T")[0],
    validTo: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    validDays: [],
    // validHours: [], // Deprecated
    startTime: "",
    endTime: "",
    isActive: true,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    excludesBankHolidays: false,
    membershipPlanId: 1,
  });

  const daysOfWeek = [
    { value: "Monday", label: "Lunes" },
    { value: "Tuesday", label: "Martes" },
    { value: "Wednesday", label: "Miércoles" },
    { value: "Thursday", label: "Jueves" },
    { value: "Friday", label: "Viernes" },
    { value: "Saturday", label: "Sábado" },
    { value: "Sunday", label: "Domingo" },
  ];

  // Deprecated: hoursOfDay array - now using time range inputs
  // const hoursOfDay = [
  //   { value: "1", label: "1 AM" },
  //   { value: "2", label: "2 AM" },
  //   ...
  // ];

  useEffect(() => {
    if (offer) {
      console.log("Loading offer for edit:", offer); // Debug log
      console.log("Valid days from offer:", offer.validDays); // Debug log
      setFormData({
        ...offer,
        membershipPlanId: offer.membershipPlanId || 1,
        description: offer.description || "",
        conditions: offer.conditions || "",
        validDays: offer.validDays || [],
        // validHours: offer.validHours || [], // Deprecated
        startTime: offer.startTime || "",
        endTime: offer.endTime || "",
        validFrom: offer.validFrom
          ? new Date(offer.validFrom).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
        validTo: offer.validTo
          ? new Date(offer.validTo).toISOString().split("T")[0]
          : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
              .toISOString()
              .split("T")[0],
      });
    } else {
      setFormData({
        title: "",
        description: "",
        offerType: "percentage",
        value: "",
        conditions: "",
        validFrom: new Date().toISOString().split("T")[0],
        validTo: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        validDays: [],
        // validHours: [], // Deprecated
        startTime: "",
        endTime: "",
        isActive: true,
        expiresAt: new Date(
          Date.now() + 30 * 24 * 60 * 60 * 1000
        ).toISOString(),
        excludesBankHolidays: false,
        membershipPlanId: 1,
      });
    }
  }, [offer, isOpen]);

  const handleInputChange = (field: keyof Offer, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const toggleDay = (day: string) => {
    setFormData((prev) => ({
      ...prev,
      validDays: prev.validDays.includes(day)
        ? prev.validDays.filter((d) => d !== day)
        : [...prev.validDays, day],
    }));
  };

  // Deprecated: toggleHour function - now using time inputs
  // const toggleHour = (hour: string) => {
  //   setFormData((prev) => ({
  //     ...prev,
  //     validHours: prev.validHours.includes(hour)
  //       ? prev.validHours.filter((h) => h !== hour)
  //       : [...prev.validHours, hour],
  //   }));
  // };

  const getOfferTypeLabel = (offerType: string) => {
    switch (offerType) {
      case "percentage":
        return "Porcentaje (%)";
      case "fixed_amount":
        return "Regalo ($)";
      case "promo":
        return "Promoción especial";
      case "menu_weincard":
        return "Menú Weincard";
      default:
        return "Valor";
    }
  };

  const getValuePlaceholder = (offerType: string) => {
    switch (offerType) {
      case "percentage":
        return "20";
      case "fixed_amount":
        return "15000";
      case "promo":
        return "2x1, 3x2, etc.";
      case "menu_weincard":
        return "Descripción del menú";
      default:
        return "Ingresa valor";
    }
  };

  const handleSave = async () => {
    if (!formData.title.trim()) {
      toast.error("El título de la oferta es requerido");
      return;
    }
    if (!formData.value.trim()) {
      toast.error("El valor de la oferta es requerido");
      return;
    }
    if (!formData.validFrom) {
      toast.error("La fecha de inicio es requerida");
      return;
    }
    if (
      formData.validTo &&
      new Date(formData.validFrom) >= new Date(formData.validTo)
    ) {
      toast.error("La fecha de inicio debe ser anterior a la fecha de fin");
      return;
    }

    // Validar rango horario si se especifica
    if (formData.startTime && formData.endTime) {
      if (formData.startTime >= formData.endTime) {
        toast.error("La hora de inicio debe ser anterior a la hora de fin");
        return;
      }
    }

    // Construir las fechas con horarios para el backend
    const offerData = {
      ...formData,
      // Agregar hora de inicio a validFrom si se especifica
      validFrom: formData.startTime
        ? `${formData.validFrom}T${formData.startTime}:00.000Z`
        : `${formData.validFrom}T00:00:00.000Z`,
      // Agregar hora de fin a validTo si se especifica y validTo existe
      validTo: formData.validTo
        ? formData.endTime
          ? `${formData.validTo}T${formData.endTime}:00.000Z`
          : `${formData.validTo}T23:59:59.000Z`
        : formData.validTo, // Keep original value (empty string or valid date)
    };

    try {
      await onSave(offerData);
      onClose();
    } catch (error) {
      console.error("Error saving offer:", error);
      // The parent component should handle the error display
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {offer ? "Editar Oferta" : "Crear Nueva Oferta"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Información básica */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Título de la oferta *</Label>
              <Input
                placeholder="Ej: Descuento en almuerzo ejecutivo"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Tipo de oferta *</Label>
              <Select
                value={formData.offerType}
                onValueChange={(value) => {
                  handleInputChange("offerType", value);
                  handleInputChange("value", "");
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Porcentaje</SelectItem>
                  <SelectItem value="fixed_amount">Regalo</SelectItem>
                  <SelectItem value="promo">Promoción</SelectItem>
                  <SelectItem value="menu_weincard">Menú Weincard</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Valor y descripción */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{getOfferTypeLabel(formData.offerType)} *</Label>
              <Input
                placeholder={getValuePlaceholder(formData.offerType)}
                value={formData.value}
                onChange={(e) => handleInputChange("value", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Plan de membresía *</Label>
              <Select
                value={formData.membershipPlanId?.toString() || "1"}
                onValueChange={(value) =>
                  handleInputChange("membershipPlanId", parseInt(value))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Basic</SelectItem>
                  <SelectItem value="2">Premium</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Descripción y condiciones */}
          <div className="space-y-2">
            <Label>Descripción</Label>
            <Input
              placeholder="Descripción detallada de la oferta"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Condiciones</Label>
            <Input
              placeholder="Términos y condiciones de la oferta"
              value={formData.conditions}
              onChange={(e) => handleInputChange("conditions", e.target.value)}
            />
          </div>

          {/* Fechas de vigencia */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Válido desde *</Label>
              <Input
                type="date"
                value={formData.validFrom}
                onChange={(e) => handleInputChange("validFrom", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Válido hasta</Label>
              <Input
                type="date"
                value={formData.validTo}
                onChange={(e) => {
                  handleInputChange("validTo", e.target.value);
                  if (e.target.value) {
                    handleInputChange(
                      "expiresAt",
                      new Date(e.target.value).toISOString()
                    );
                  }
                }}
              />
            </div>
          </div>

          {/* Días válidos */}
          <div className="space-y-2">
            <Label>Días válidos</Label>
            <div className="flex flex-wrap gap-2">
              {daysOfWeek.map((day) => (
                <Button
                  key={day.value}
                  variant={
                    formData.validDays.includes(day.value)
                      ? "default"
                      : "outline"
                  }
                  size="sm"
                  onClick={() => toggleDay(day.value)}
                >
                  {day.label}
                </Button>
              ))}
            </div>
            {formData.validDays.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Si no seleccionas días, la oferta será válida todos los días
              </p>
            )}
          </div>

          {/* Rango horario válido */}
          <div className="space-y-2">
            <Label>Rango horario válido (opcional)</Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">
                  Hora de inicio
                </Label>
                <Input
                  type="time"
                  value={formData.startTime || ""}
                  onChange={(e) =>
                    handleInputChange("startTime", e.target.value)
                  }
                  placeholder="09:00"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">
                  Hora de fin
                </Label>
                <Input
                  type="time"
                  value={formData.endTime || ""}
                  onChange={(e) => handleInputChange("endTime", e.target.value)}
                  placeholder="17:00"
                />
              </div>
            </div>
            {!formData.startTime && !formData.endTime && (
              <p className="text-sm text-muted-foreground">
                Si no especificas horario, la oferta será válida todo el día
              </p>
            )}
          </div>

          {/* Opciones adicionales */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) =>
                  handleInputChange("isActive", checked)
                }
              />
              <Label htmlFor="isActive">Oferta activa</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="excludesBankHolidays"
                checked={formData.excludesBankHolidays}
                onCheckedChange={(checked) =>
                  handleInputChange("excludesBankHolidays", checked)
                }
              />
              <Label htmlFor="excludesBankHolidays">
                Excluir días festivos
              </Label>
            </div>
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

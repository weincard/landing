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
import { Textarea } from "@/components/ui/textarea";
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
  validTo?: string; // Hora de fin (Formato HH:mm)
  validDays: string[];
  // validHours: string[]; // Deprecated: now using startTime and validTo
  startTime?: string; // Formato HH:mm (ej: "09:00")
  // endTime?: string; // Deprecated: ahora usamos validTo
  isActive: boolean;
  expiresAt: string | null; // Fecha límite de la oferta
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
    validTo: undefined, // Hora de fin
    validDays: [],
    // validHours: [], // Deprecated
    startTime: undefined,
    // endTime: "", // Deprecated: ahora usamos validTo
    isActive: true,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0], // Fecha límite
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
        startTime: offer.startTime
          ? typeof offer.startTime === "string" && offer.startTime.includes("T")
            ? new Date(offer.startTime).toISOString().substr(11, 5) // Si es datetime, extraer hora
            : offer.startTime // Si ya es formato HH:mm, usar tal como está
          : offer.validFrom &&
            new Date(offer.validFrom).toISOString().substr(11, 5) !== "00:00"
          ? new Date(offer.validFrom).toISOString().substr(11, 5) // Fallback: extraer hora de validFrom solo si no es 00:00
          : "",
        validTo: offer.validTo
          ? typeof offer.validTo === "string" && offer.validTo.includes("T")
            ? new Date(offer.validTo).toISOString().substr(11, 5) // Si es datetime, extraer hora
            : offer.validTo // Si ya es formato HH:mm, usar tal como está
          : undefined, // Hora de fin
        validFrom: offer.validFrom
          ? new Date(offer.validFrom).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
        expiresAt: offer.expiresAt
          ? new Date(offer.expiresAt).toISOString().split("T")[0]
          : "", // Fecha límite
      });
    } else {
      setFormData({
        title: "",
        description: "",
        offerType: "percentage",
        value: "",
        conditions: "",
        validFrom: new Date().toISOString().split("T")[0],
        validTo: undefined, // Hora de fin
        validDays: [],
        // validHours: [], // Deprecated
        startTime: undefined,
        // endTime: "", // Deprecated
        isActive: true,
        expiresAt: null, // Fecha límite
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
        return "Cortesía ($)";
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
        return "Entrada: Ensalada mixta\nPlato principal: Lomo de cerdo\nPostre: Torta de chocolate\nBebida: Jugo natural";
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
      formData.expiresAt &&
      formData.validFrom &&
      new Date(formData.validFrom) >= new Date(formData.expiresAt)
    ) {
      toast.error("La fecha de inicio debe ser anterior a la fecha de fin");
      return;
    }

    // Validar rango horario si se especifica
    if (formData.startTime && formData.validTo) {
      // Validar que son horarios válidos antes de compararlos
      const timeRegex = /^([01]?\d|2[0-3]):([0-5]?\d)$/;
      if (
        !timeRegex.test(formData.startTime) ||
        !timeRegex.test(formData.validTo)
      ) {
        toast.error("Formato de hora inválido");
        return;
      }

      if (formData.startTime >= formData.validTo) {
        toast.error("La hora de inicio debe ser anterior a la hora de fin");
        return;
      }
    }

    // Construir las fechas con horarios para el backend
    const offerData = {
      ...formData,
      // Agregar hora de inicio a validFrom solo si se especifica, sino usar solo la fecha
      validFrom:
        formData.startTime && formData.startTime.trim() && formData.validFrom
          ? `${formData.validFrom}T${formData.startTime}:00.000Z`
          : formData.validFrom || new Date().toISOString().split("T")[0],
      // validTo debe ser datetime también si se especifica hora de fin
      validTo:
        formData.validTo && formData.validTo.trim() && formData.validFrom
          ? `${formData.validFrom}T${formData.validTo}:00.000Z` // Usar la misma fecha base con la hora de fin
          : undefined,
      // expiresAt es la fecha límite de la oferta, solo agregar hora si hay validTo especificado
      expiresAt: formData.expiresAt
        ? formData.validTo && formData.validTo.trim() // Si hay hora de fin, combinar fecha límite con hora
          ? `${formData.expiresAt}T${formData.validTo}:00.000Z`
          : formData.expiresAt // Si no hay hora de fin, usar solo la fecha
        : null, // Si no hay fecha límite, null
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
                  <SelectItem value="fixed_amount">Cortesía</SelectItem>
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
              {formData.offerType === "menu_weincard" ? (
                <Textarea
                  placeholder={getValuePlaceholder(formData.offerType)}
                  value={formData.value}
                  onChange={(e) => handleInputChange("value", e.target.value)}
                  rows={4}
                  className="resize-none"
                />
              ) : (
                <Input
                  placeholder={getValuePlaceholder(formData.offerType)}
                  value={formData.value}
                  onChange={(e) => handleInputChange("value", e.target.value)}
                />
              )}
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
            <Textarea
              placeholder="Descripción detallada de la oferta"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={3}
              className="resize-none"
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
                value={formData.expiresAt || ""}
                onChange={(e) => {
                  const newExpiresAt = e.target.value;
                  handleInputChange("expiresAt", newExpiresAt);
                  // Ya no borramos validTo cuando se borra expiresAt
                  // Los campos son independientes
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
                  onChange={(e) => {
                    const startTime = e.target.value;
                    handleInputChange("startTime", startTime || undefined);

                    // Si se pone hora de inicio y no hay hora de fin, asignar hora de fin automáticamente
                    if (startTime && !formData.validTo) {
                      // Calcular hora de fin (8 horas después por defecto)
                      const [hours, minutes] = startTime.split(":");
                      const startHour = parseInt(hours);
                      const endHour = Math.min(startHour + 8, 23); // Máximo 23:00
                      const endTime = `${endHour
                        .toString()
                        .padStart(2, "0")}:${minutes}`;
                      handleInputChange("validTo", endTime);
                    }
                  }}
                  placeholder="09:00"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">
                  Hora de fin
                </Label>
                <Input
                  type="time"
                  value={formData.validTo || ""}
                  onChange={(e) => {
                    const endTime = e.target.value;
                    handleInputChange("validTo", endTime || undefined);

                    // Si se pone hora de fin y no hay hora de inicio, asignar hora de inicio automáticamente
                    if (endTime && !formData.startTime) {
                      // Calcular hora de inicio (8 horas antes por defecto)
                      const [hours, minutes] = endTime.split(":");
                      const endHour = parseInt(hours);
                      const startHour = Math.max(endHour - 8, 0); // Mínimo 00:00
                      const startTime = `${startHour
                        .toString()
                        .padStart(2, "0")}:${minutes}`;
                      handleInputChange("startTime", startTime);
                    }
                  }}
                  placeholder="17:00"
                />
              </div>
            </div>
            {!formData.startTime && !formData.validTo && (
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

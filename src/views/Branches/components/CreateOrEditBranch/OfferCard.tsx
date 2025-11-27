import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface Offer {
  offerId?: number;
  title: string;
  description: string;
  offerType: "percentage" | "fixed_amount" | "promo" | "menu_weincard";
  value: string;
  conditions: string;
  validFrom: string;
  validTo: string;
  validDays: string[];
  // validHours: string[]; // Deprecated: now using startTime and endTime
  startTime?: string;
  endTime?: string;
  isActive: boolean;
  expiresAt: string;
  excludesBankHolidays: boolean;
  membershipPlanId: number;
  branchId?: number;
}

interface OfferCardProps {
  offers: Offer[];
  onCreateOffer: () => void;
  onEditOffer: (offer: Offer) => void;
  onDeleteOffer: (offerId: number) => void;
  isEditMode?: boolean;
}

export function OfferCard({
  offers,
  onCreateOffer,
  onEditOffer,
  onDeleteOffer,
  isEditMode = false,
}: OfferCardProps) {
  const formatValidDaysText = (validDays: string[]) => {
    if (!validDays || validDays.length === 0) {
      return "Todos los días";
    }

    const dayMapping: { [key: string]: string } = {
      Monday: "Lunes",
      Tuesday: "Martes",
      Wednesday: "Miércoles",
      Thursday: "Jueves",
      Friday: "Viernes",
      Saturday: "Sábado",
      Sunday: "Domingo",
    };

    const spanishDays = validDays.map((day) => dayMapping[day] || day);
    return spanishDays.join(", ");
  };

  const formatTimeRangeText = (startTime?: string, endTime?: string) => {
    if (!startTime && !endTime) {
      return "Todo el día";
    }

    const formatTime = (time: string) => {
      const [hours, minutes] = time.split(":");
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? "PM" : "AM";
      const hour12 = hour % 12 || 12;
      return `${hour12}:${minutes} ${ampm}`;
    };

    if (startTime && endTime) {
      return `${formatTime(startTime)} - ${formatTime(endTime)}`;
    } else if (startTime) {
      return `Desde ${formatTime(startTime)}`;
    } else {
      return `Hasta ${formatTime(endTime!)}`;
    }
  };

  const getOfferTypeDisplay = (offerType: string) => {
    switch (offerType) {
      case "percentage":
        return "Porcentaje";
      case "fixed_amount":
        return "Monto fijo";
      case "promo":
        return "Promoción";
      case "menu_weincard":
        return "Menú Weincard";
      default:
        return offerType;
    }
  };

  const formatDateRange = (validFrom: string, validTo: string) => {
    const from = new Date(validFrom).toLocaleDateString();
    const to = new Date(validTo).toLocaleDateString();
    return `${from} - ${to}`;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold">Ofertas</h2>
            {isEditMode ? (
              <p className="text-sm text-blue-600">
                💾 Modo edición: Los cambios se guardan inmediatamente
              </p>
            ) : (
              <p className="text-sm text-orange-600">
                📝 Modo creación: Las ofertas se crearán al guardar la sucursal
              </p>
            )}
          </div>
          <Button onClick={onCreateOffer} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Crear Oferta
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {offers.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No hay ofertas creadas</p>
            <p className="text-sm">
              Haz clic en &quot;Crear Oferta&quot; para agregar una nueva
            </p>
          </div>
        ) : (
          offers.map((offer, index) => (
            <div
              key={offer.offerId || index}
              className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-medium">{offer.title}</h3>
                    <Badge variant="secondary" className="text-xs">
                      {getOfferTypeDisplay(offer.offerType)}
                    </Badge>
                    <Badge
                      variant={offer.isActive ? "default" : "outline"}
                      className="text-xs"
                    >
                      {offer.isActive ? "Activa" : "Inactiva"}
                    </Badge>
                  </div>

                  {offer.value && (
                    <p className="text-sm text-muted-foreground mb-1">
                      <strong>Valor:</strong> {offer.value}
                    </p>
                  )}

                  {offer.description && (
                    <p className="text-sm text-muted-foreground mb-2">
                      <strong>Descripción:</strong> {offer.description}
                    </p>
                  )}

                  {offer.conditions && (
                    <p className="text-sm text-muted-foreground mb-2">
                      <strong>Condiciones:</strong> {offer.conditions}
                    </p>
                  )}

                  <p className="text-sm text-blue-600 mb-1">
                    <strong>Vigencia:</strong>{" "}
                    {formatDateRange(offer.validFrom, offer.validTo)}
                  </p>

                  <p className="text-sm text-green-600 mb-1">
                    <strong>Días válidos:</strong>{" "}
                    {formatValidDaysText(offer.validDays)}
                  </p>

                  <p className="text-sm text-purple-600">
                    <strong>Horario:</strong>{" "}
                    {formatTimeRangeText(offer.startTime, offer.endTime)}
                  </p>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEditOffer(offer)}
                    className="hover:bg-blue-50 hover:text-blue-600"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDeleteOffer(offer.offerId || 0)}
                    className="hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}

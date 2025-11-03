import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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

interface OfferCardProps {
  offers: Offer[];
  onCreateOffer: () => void;
  onEditOffer: (offer: Offer) => void;
  onDeleteOffer: (offerId: string) => void;
}

export function OfferCard({
  offers,
  onCreateOffer,
  onEditOffer,
  onDeleteOffer,
}: OfferCardProps) {
  const formatAvailabilityText = (availabilities: Availability[]) => {
    if (!availabilities || availabilities.length === 0) {
      return "Sin disponibilidad definida";
    }

    const formattedAvailabilities = availabilities.map((availability) => {
      const days = availability.selectedDays.join(", ");
      const times = availability.selectedTimes.join(", ");

      if (days && times) {
        return `${days} a las ${times}`;
      } else if (days) {
        return days;
      } else if (times) {
        return `A las ${times}`;
      }
      return "Sin horarios";
    });

    return formattedAvailabilities.join(" | ");
  };

  const getOfferTypeDisplay = (offerType: string) => {
    switch (offerType) {
      case "porcentaje":
        return "Porcentaje";
      case "monto":
        return "Monto fijo";
      case "comensales":
        return "Comensales";
      case "promo":
        return "Promoción";
      default:
        return offerType;
    }
  };

  const getMembershipDisplay = (membershipType: string) => {
    switch (membershipType) {
      case "premium":
        return "Premium";
      case "basic":
        return "Basic";
      default:
        return membershipType;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Ofertas</h2>
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
          offers.map((offer) => (
            <div
              key={offer.id}
              className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-medium">{offer.title}</h3>
                    <Badge variant="secondary" className="text-xs">
                      {getOfferTypeDisplay(offer.offerType)}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {getMembershipDisplay(offer.membershipType)}
                    </Badge>
                  </div>

                  {offer.quantity && (
                    <p className="text-sm text-muted-foreground mb-1">
                      <strong>Cantidad:</strong> {offer.quantity}
                    </p>
                  )}

                  {offer.details && (
                    <p className="text-sm text-muted-foreground mb-2">
                      <strong>Detalles:</strong> {offer.details}
                    </p>
                  )}

                  <p className="text-sm text-blue-600">
                    <strong>Disponibilidad:</strong>{" "}
                    {formatAvailabilityText(offer.availabilities)}
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
                    onClick={() => onDeleteOffer(offer.id)}
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

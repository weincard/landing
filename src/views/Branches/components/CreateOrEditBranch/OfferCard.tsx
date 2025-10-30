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
import { Trash2 } from "lucide-react";

interface Offer {
  id: string;
  offerType: string;
  membershipType: string;
  quantity: string;
  details: string;
}

interface OfferCardProps {
  offers: Offer[];
  onAddOffer: () => void;
  onRemoveOffer: (id: string) => void;
  onUpdateOffer: (id: string, field: keyof Offer, value: string) => void;
}

export function OfferCard({
  offers,
  onAddOffer,
  onRemoveOffer,
  onUpdateOffer,
}: OfferCardProps) {
  const getQuantityLabel = (offerType: string) => {
    switch (offerType) {
      case "porcentaje":
        return "Porcentaje de descuento";
      case "monto":
        return "Monto fijo del descuento";
      case "comensales":
      default:
        return "Establece la cantidad de comensales";
    }
  };

  const getQuantityPlaceholder = (offerType: string) => {
    switch (offerType) {
      case "porcentaje":
        return "20%";
      case "monto":
        return "$15000";
      case "comensales":
      default:
        return "Selecciona la opción";
    }
  };

  const renderQuantityField = (offer: Offer) => {
    if (offer.offerType === "comensales" || !offer.offerType.length) {
      return (
        <Select
          value={offer.quantity}
          onValueChange={(value) => onUpdateOffer(offer.id, "quantity", value)}
        >
          <SelectTrigger>
            <SelectValue
              placeholder={getQuantityPlaceholder(offer.offerType)}
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

    return (
      <div className="relative">
        <Input
          type="number"
          placeholder={getQuantityPlaceholder(offer.offerType)}
          value={offer.quantity}
          onChange={(e) => onUpdateOffer(offer.id, "quantity", e.target.value)}
        />
      </div>
    );
  };
  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-semibold">Ofertas</h2>
      </CardHeader>
      <CardContent className="space-y-4">
        {offers.map((offer, index) => (
          <div
            key={offer.id}
            className={`space-y-4 ${
              offers.length > 1
                ? "p-4 border rounded-lg shadow-sm relative"
                : ""
            }`}
          >
            {offers.length > 1 && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                onClick={() => onRemoveOffer(offer.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-muted-foreground">Tipo de oferta</Label>
                <Select
                  value={offer.offerType}
                  onValueChange={(value) => {
                    onUpdateOffer(offer.id, "offerType", value);
                    // Limpiar el campo quantity cuando cambie el tipo
                    onUpdateOffer(offer.id, "quantity", "");
                  }}
                >
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
                <Label className="text-muted-foreground">
                  Tipo de membresía
                </Label>
                <Select
                  value={offer.membershipType}
                  onValueChange={(value) =>
                    onUpdateOffer(offer.id, "membershipType", value)
                  }
                >
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

            <div className="space-y-2 w-1/2">
              <Label className="text-muted-foreground">
                {getQuantityLabel(offer.offerType)}
              </Label>
              {renderQuantityField(offer)}
            </div>

            <div className="space-y-2">
              <Label className="text-muted-foreground">
                Detalles de la promoción
              </Label>
              <Input
                placeholder="Qué productos"
                value={offer.details}
                onChange={(e) =>
                  onUpdateOffer(offer.id, "details", e.target.value)
                }
              />
            </div>
          </div>
        ))}

        <Button
          variant="link"
          className="p-0 h-auto text-blue-600"
          onClick={onAddOffer}
        >
          Agregar otra oferta
        </Button>
      </CardContent>
    </Card>
  );
}

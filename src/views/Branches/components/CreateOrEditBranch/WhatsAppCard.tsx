import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const CONTACT_MESSAGE = "Hola! Soy un miembro WEINCARD 😎 y quiero hacer una solicitud.";
const DELIVERY_MESSAGE = "¡Hola! Soy un miembro WEINCARD😎y quiero pedir un domicilio";

interface WhatsAppCardProps {
  canContact: boolean;
  whatsapp: string;
  messageType: "contact" | "delivery" | null;
  contactMessage: string;
  onCanContactChange: (value: boolean) => void;
  onWhatsappChange: (value: string) => void;
  onMessageTypeChange: (value: "contact" | "delivery") => void;
  onContactMessageChange: (value: string) => void;
}

export function WhatsAppCard({
  canContact,
  whatsapp,
  messageType,
  contactMessage,
  onCanContactChange,
  onWhatsappChange,
  onMessageTypeChange,
  onContactMessageChange,
}: WhatsAppCardProps) {
  const resolvedType = messageType ?? "contact";

  const handleTypeChange = (value: "contact" | "delivery") => {
    onMessageTypeChange(value);
    onContactMessageChange(value === "delivery" ? DELIVERY_MESSAGE : CONTACT_MESSAGE);
  };

  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-semibold">Contacto WhatsApp</h2>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-muted-foreground" htmlFor="whatsapp-contact">
            Permitir contacto por WhatsApp
          </Label>
          <Switch
            id="whatsapp-contact"
            checked={canContact}
            onCheckedChange={onCanContactChange}
          />
        </div>

        {canContact && (
          <>
            <div className="space-y-2">
              <Label htmlFor="whatsapp-number" className="text-sm font-medium">
                Número de WhatsApp
              </Label>
              <Input
                id="whatsapp-number"
                type="tel"
                placeholder="+5493511234567"
                value={whatsapp}
                onChange={(e) => onWhatsappChange(e.target.value)}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Incluye el código de país (ej: +54 para Argentina)
              </p>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Tipo de mensaje</Label>
              <div className="flex rounded-md border overflow-hidden">
                <button
                  type="button"
                  onClick={() => handleTypeChange("contact")}
                  className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
                    resolvedType === "contact"
                      ? "bg-primary text-primary-foreground"
                      : "bg-background text-muted-foreground hover:bg-muted"
                  }`}
                >
                  Contacto
                </button>
                <button
                  type="button"
                  onClick={() => handleTypeChange("delivery")}
                  className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
                    resolvedType === "delivery"
                      ? "bg-primary text-primary-foreground"
                      : "bg-background text-muted-foreground hover:bg-muted"
                  }`}
                >
                  Domicilio
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact-message" className="text-sm font-medium">
                Mensaje de WhatsApp
              </Label>
              <Textarea
                id="contact-message"
                value={contactMessage}
                onChange={(e) => onContactMessageChange(e.target.value)}
                rows={3}
                className="w-full resize-none"
              />
              <p className="text-xs text-muted-foreground">
                Puedes editar el mensaje predeterminado según el tipo seleccionado.
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

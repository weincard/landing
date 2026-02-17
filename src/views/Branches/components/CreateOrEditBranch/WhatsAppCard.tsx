import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";

interface WhatsAppCardProps {
  canContact: boolean;
  whatsapp: string;
  onCanContactChange: (value: boolean) => void;
  onWhatsappChange: (value: string) => void;
}

export function WhatsAppCard({ 
  canContact, 
  whatsapp, 
  onCanContactChange, 
  onWhatsappChange 
}: WhatsAppCardProps) {
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
        )}
      </CardContent>
    </Card>
  );
}
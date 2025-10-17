import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AddressCardProps {
  address: string;
  city: string;
  country: string;
  latitude: string;
  longitude: string;
  website: string;
  onAddressChange: (value: string) => void;
  onCityChange: (value: string) => void;
  onCountryChange: (value: string) => void;
  onLatitudeChange: (value: string) => void;
  onLongitudeChange: (value: string) => void;
  onWebsiteChange: (value: string) => void;
}

export function AddressCard({
  address,
  city,
  country,
  latitude,
  longitude,
  website,
  onAddressChange,
  onCityChange,
  onCountryChange,
  onLatitudeChange,
  onLongitudeChange,
  onWebsiteChange,
}: AddressCardProps) {
  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-semibold">Dirección *</h2>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label className="text-muted-foreground" htmlFor="address">
            Dirección
          </Label>
          <Input
            id="address"
            placeholder="Cra. 35 #58-35"
            value={address}
            onChange={(e) => onAddressChange(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-muted-foreground" htmlFor="city">
              Ciudad *
            </Label>
            <Input
              id="city"
              placeholder="Medellín"
              value={city}
              onChange={(e) => onCityChange(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-muted-foreground" htmlFor="country">
              País *
            </Label>
            <Input
              id="country"
              placeholder="Colombia"
              value={country}
              onChange={(e) => onCountryChange(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-muted-foreground" htmlFor="latitude">
              Latitud *
            </Label>
            <Input
              id="latitude"
              type="number"
              step="any"
              placeholder="6.244203"
              value={latitude}
              onChange={(e) => onLatitudeChange(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-muted-foreground" htmlFor="longitude">
              Longitud *
            </Label>
            <Input
              id="longitude"
              type="number"
              step="any"
              placeholder="-75.581215"
              value={longitude}
              onChange={(e) => onLongitudeChange(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-muted-foreground" htmlFor="website">
            Sitio Web (opcional)
          </Label>
          <Input
            id="website"
            type="url"
            placeholder="https://ejemplo.com"
            value={website}
            onChange={(e) => onWebsiteChange(e.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  );
}

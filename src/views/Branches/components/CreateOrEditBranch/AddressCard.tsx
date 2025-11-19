"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { MapPin, Loader2, Search } from "lucide-react";
import { GoogleStaticMap } from "@/components/GoogleStaticMap";
import {
  getAddressPredictions,
  getPlaceDetails,
  reverseGeocode,
  type GoogleAddressPrediction,
} from "@/lib/google-maps-service";

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
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [predictions, setPredictions] = useState<GoogleAddressPrediction[]>([]);
  const [showPredictions, setShowPredictions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Search for address predictions with debounce
  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
    setShowPredictions(true);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (value.trim().length < 3) {
      setPredictions([]);
      return;
    }

    searchTimeoutRef.current = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await getAddressPredictions(value);
        setPredictions(results);
      } catch (error) {
        console.error("Error searching address:", error);
        setPredictions([]);
      } finally {
        setIsSearching(false);
      }
    }, 500);
  }, []);

  // Select a prediction
  const handleSelectPrediction = useCallback(
    async (prediction: GoogleAddressPrediction) => {
      setShowPredictions(false);
      setSearchQuery(prediction.description);
      onAddressChange(prediction.description);

      try {
        const details = await getPlaceDetails(prediction.placeId);
        if (details) {
          onLatitudeChange(details.latitude.toString());
          onLongitudeChange(details.longitude.toString());
          if (details.locality) onCityChange(details.locality);
          if (details.country) onCountryChange(details.country);
        }
      } catch (error) {
        console.error("Error fetching place details:", error);
      }
    },
    [
      onAddressChange,
      onLatitudeChange,
      onLongitudeChange,
      onCityChange,
      onCountryChange,
    ]
  );

  // Get current location
  const getCurrentLocation = useCallback(() => {
    setIsLoadingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          onLatitudeChange(lat.toString());
          onLongitudeChange(lng.toString());

          try {
            const result = await reverseGeocode(lat, lng);
            if (result) {
              onAddressChange(result.formattedAddress);
              setSearchQuery(result.formattedAddress);
              if (result.locality) onCityChange(result.locality);
              if (result.country) onCountryChange(result.country);
            }
          } catch (error) {
            console.error("Error reverse geocoding:", error);
          } finally {
            setIsLoadingLocation(false);
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          setIsLoadingLocation(false);
        }
      );
    }
  }, [
    onLatitudeChange,
    onLongitudeChange,
    onAddressChange,
    onCityChange,
    onCountryChange,
  ]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Dirección</h2>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={getCurrentLocation}
            disabled={isLoadingLocation}
          >
            {isLoadingLocation ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Ubicando...
              </>
            ) : (
              <>
                <MapPin className="h-4 w-4 mr-2" />
                Mi ubicación
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Google Maps Static Image */}
        <div className="space-y-2">
          <Label className="text-muted-foreground">Mapa</Label>
          {latitude && longitude ? (
            <GoogleStaticMap
              latitude={parseFloat(latitude) || 6.244203}
              longitude={parseFloat(longitude) || -75.581215}
              width={600}
              height={256}
              zoom={15}
              className="w-full"
            />
          ) : (
            <div className="w-full h-64 rounded-lg border bg-muted flex items-center justify-center text-muted-foreground">
              Selecciona una dirección para ver el mapa
            </div>
          )}
          <p className="text-xs text-muted-foreground">
            Usa el buscador o &quot;Mi ubicación&quot; para establecer las
            coordenadas
          </p>
        </div>

        {/* Address Search with Autocomplete */}
        <div className="space-y-2 relative">
          <Label className="text-muted-foreground" htmlFor="address">
            Dirección exacta *
          </Label>
          <div className="relative">
            <Input
              id="address"
              placeholder="Buscar dirección..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              onFocus={() => setShowPredictions(true)}
              className="pr-10"
            />
            {isSearching && (
              <Loader2 className="h-4 w-4 animate-spin absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            )}
            {!isSearching && searchQuery && (
              <Search className="h-4 w-4 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            )}
          </div>

          {/* Predictions Dropdown */}
          {showPredictions && predictions.length > 0 && (
            <div className="absolute z-50 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {predictions.map((prediction) => (
                <button
                  key={prediction.placeId}
                  type="button"
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b last:border-b-0 transition-colors"
                  onClick={() => handleSelectPrediction(prediction)}
                >
                  <div className="font-medium text-sm">
                    {prediction.mainText}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {prediction.secondaryText}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-muted-foreground" htmlFor="city">
              Ciudad
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
              País
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
              Ubicación Google Maps - Latitud *
            </Label>
            <Input
              id="latitude"
              type="number"
              step="any"
              placeholder="6.244203"
              value={latitude}
              onChange={(e) => onLatitudeChange(e.target.value)}
              className="bg-muted"
              readOnly
            />
          </div>
          <div className="space-y-2">
            <Label className="text-muted-foreground" htmlFor="longitude">
              Ubicación Google Maps - Longitud *
            </Label>
            <Input
              id="longitude"
              type="number"
              step="any"
              placeholder="-75.581215"
              value={longitude}
              onChange={(e) => onLongitudeChange(e.target.value)}
              className="bg-muted"
              readOnly
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

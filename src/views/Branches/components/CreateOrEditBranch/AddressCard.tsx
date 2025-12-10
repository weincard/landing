"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { MapPin, Loader2 } from "lucide-react";
import { loadGoogleMaps } from "@/lib/google-maps-loader";

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
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markerInstanceRef = useRef<google.maps.Marker | null>(null);
  const autocompleteInstanceRef =
    useRef<google.maps.places.Autocomplete | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const addressInputRef = useRef<HTMLInputElement>(null);

  // Extract address components from Google Maps data
  const extractAddressComponents = useCallback(
    (
      components: google.maps.GeocoderAddressComponent[],
      formattedAddress: string
    ) => {
      let streetAddress = "";
      let cityName = "";
      let countryName = "";

      components.forEach((component) => {
        const types = component.types;
        if (types.includes("street_number") || types.includes("route")) {
          streetAddress += component.long_name + " ";
        }
        if (
          types.includes("locality") ||
          types.includes("administrative_area_level_2")
        ) {
          cityName = component.long_name;
        }
        if (types.includes("country")) {
          countryName = component.long_name;
        }
      });

      onAddressChange(streetAddress.trim() || formattedAddress);
      if (cityName) onCityChange(cityName);
      if (countryName) onCountryChange(countryName);
    },
    [onAddressChange, onCityChange, onCountryChange]
  );

  // Reverse geocode to get address from coordinates
  const reverseGeocode = useCallback(
    (lat: number, lng: number) => {
      if (!window.google) return;

      const geocoder = new google.maps.Geocoder();
      geocoder.geocode(
        { location: { lat, lng } },
        (
          results: google.maps.GeocoderResult[] | null,
          status: google.maps.GeocoderStatus
        ) => {
          if (status === "OK" && results && results[0]) {
            const place = results[0];
            if (place.address_components) {
              extractAddressComponents(
                place.address_components,
                place.formatted_address
              );
            }
          }
        }
      );
    },
    [extractAddressComponents]
  );

  // Update map when coordinates are manually changed
  const updateMapFromCoordinates = useCallback(
    (lat: string, lng: string) => {
      const latNum = parseFloat(lat);
      const lngNum = parseFloat(lng);

      if (
        !isNaN(latNum) &&
        !isNaN(lngNum) &&
        mapInstanceRef.current &&
        markerInstanceRef.current
      ) {
        const position = { lat: latNum, lng: lngNum };
        mapInstanceRef.current.setCenter(position);
        markerInstanceRef.current.setPosition(position);

        // Optionally reverse geocode to update address
        reverseGeocode(latNum, lngNum);
      }
    },
    [reverseGeocode]
  );

  // Initialize Google Maps (once) using singleton loader
  useEffect(() => {
    let isCancelled = false;

    const initialize = async () => {
      try {
        await loadGoogleMaps();
        if (isCancelled || !mapRef.current || !window.google) return;

        const lat = parseFloat(latitude) || 6.244203;
        const lng = parseFloat(longitude) || -75.581215;

        const mapInstance = new google.maps.Map(mapRef.current, {
          center: { lat, lng },
          zoom: 15,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
        });

        const markerInstance = new google.maps.Marker({
          position: { lat, lng },
          map: mapInstance,
          draggable: true,
        });

        // Update coordinates when marker is dragged
        markerInstance.addListener("dragend", () => {
          const position = markerInstance.getPosition();
          if (position) {
            onLatitudeChange(position.lat().toString());
            onLongitudeChange(position.lng().toString());
            reverseGeocode(position.lat(), position.lng());
          }
        });

        mapInstanceRef.current = mapInstance;
        markerInstanceRef.current = markerInstance;

        // Initialize autocomplete
        if (addressInputRef.current) {
          const autocompleteInstance = new google.maps.places.Autocomplete(
            addressInputRef.current,
            {
              fields: [
                "formatted_address",
                "geometry",
                "address_components",
                "place_id",
                "name",
              ],
              types: ["establishment", "geocode"],
              componentRestrictions: {
                country: ["co", "us", "mx", "ve", "ec", "pe"],
              },
            }
          );

          autocompleteInstance.addListener("place_changed", () => {
            const place = autocompleteInstance.getPlace();
            if (place.geometry?.location) {
              const lat = place.geometry.location.lat();
              const lng = place.geometry.location.lng();

              onLatitudeChange(lat.toString());
              onLongitudeChange(lng.toString());
              mapInstance.setCenter({ lat, lng });
              markerInstance.setPosition({ lat, lng });

              // Extract address components
              if (place.address_components) {
                extractAddressComponents(
                  place.address_components,
                  place.formatted_address || ""
                );
              }
            }
          });

          autocompleteInstanceRef.current = autocompleteInstance;
        }

        setIsMapLoaded(true);
      } catch (e) {
        console.error("Failed to load Google Maps:", e);
      }
    };

    initialize();

    return () => {
      isCancelled = true;
      if (markerInstanceRef.current && window.google) {
        google.maps.event.clearInstanceListeners(markerInstanceRef.current);
      }
      if (autocompleteInstanceRef.current && window.google) {
        google.maps.event.clearInstanceListeners(
          autocompleteInstanceRef.current
        );
      }
    };
    // Dependencies intentionally exclude latitude/longitude to avoid re-init
    // We include latitude/longitude to satisfy exhaustive-deps, but initialization
    // is idempotent and further coordinate changes are handled by the separate effect below.
  }, [
    latitude,
    longitude,
    onLatitudeChange,
    onLongitudeChange,
    reverseGeocode,
    extractAddressComponents,
  ]);

  // Update map when coordinates change externally
  useEffect(() => {
    if (isMapLoaded && mapInstanceRef.current && markerInstanceRef.current) {
      const lat = parseFloat(latitude);
      const lng = parseFloat(longitude);
      if (!isNaN(lat) && !isNaN(lng)) {
        const position = { lat, lng };
        mapInstanceRef.current.setCenter(position);
        markerInstanceRef.current.setPosition(position);
      }
    }
  }, [latitude, longitude, isMapLoaded]);

  // Get current location
  const getCurrentLocation = () => {
    setIsLoadingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          onLatitudeChange(lat.toString());
          onLongitudeChange(lng.toString());
          if (mapInstanceRef.current && markerInstanceRef.current) {
            mapInstanceRef.current.setCenter({ lat, lng });
            markerInstanceRef.current.setPosition({ lat, lng });
          }
          reverseGeocode(lat, lng);
          setIsLoadingLocation(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setIsLoadingLocation(false);
        }
      );
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Dirección *</h2>
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
        {/* Google Maps */}
        <div className="space-y-2">
          <Label className="text-muted-foreground">Mapa</Label>
          <div
            ref={mapRef}
            className="w-full h-64 rounded-lg border bg-muted"
            style={{ minHeight: "256px" }}
          />
          <p className="text-xs text-muted-foreground">
            Arrastra el marcador para ajustar la ubicación exacta o edita las
            coordenadas manualmente
          </p>
        </div>

        <div className="space-y-2">
          <Label className="text-muted-foreground" htmlFor="address">
            Dirección
          </Label>
          <Input
            ref={addressInputRef}
            id="address"
            placeholder="Buscar dirección..."
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
              onChange={(e) => {
                onLatitudeChange(e.target.value);
                updateMapFromCoordinates(e.target.value, longitude);
              }}
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
              onChange={(e) => {
                onLongitudeChange(e.target.value);
                updateMapFromCoordinates(latitude, e.target.value);
              }}
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

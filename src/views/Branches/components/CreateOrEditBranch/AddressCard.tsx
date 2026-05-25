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

  // Keep latest callbacks in refs to avoid re-initializing the map when
  // the parent re-renders and creates new inline arrow functions.
  const onAddressChangeRef = useRef(onAddressChange);
  const onCityChangeRef = useRef(onCityChange);
  const onCountryChangeRef = useRef(onCountryChange);
  const onLatitudeChangeRef = useRef(onLatitudeChange);
  const onLongitudeChangeRef = useRef(onLongitudeChange);

  useEffect(() => {
    onAddressChangeRef.current = onAddressChange;
  }, [onAddressChange]);
  useEffect(() => {
    onCityChangeRef.current = onCityChange;
  }, [onCityChange]);
  useEffect(() => {
    onCountryChangeRef.current = onCountryChange;
  }, [onCountryChange]);
  useEffect(() => {
    onLatitudeChangeRef.current = onLatitudeChange;
  }, [onLatitudeChange]);
  useEffect(() => {
    onLongitudeChangeRef.current = onLongitudeChange;
  }, [onLongitudeChange]);

  // Keep latest coordinate values in refs so the dragend/place_changed
  // closures can read them without being re-created on every render.
  const latitudeRef = useRef(latitude);
  const longitudeRef = useRef(longitude);
  useEffect(() => {
    latitudeRef.current = latitude;
  }, [latitude]);
  useEffect(() => {
    longitudeRef.current = longitude;
  }, [longitude]);

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

      onAddressChangeRef.current(streetAddress.trim() || formattedAddress);
      if (cityName) onCityChangeRef.current(cityName);
      if (countryName) onCountryChangeRef.current(countryName);
    },
    [] // stable — reads callbacks via refs
  );

  // Reverse geocode to get address from coordinates
  const reverseGeocode = useCallback(
    (lat: number, lng: number) => {
      if (!window.google) return;

      const geocoder = new google.maps.Geocoder();
      geocoder.geocode(
        { location: { lat, lng } },
        (results, status) => {
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

  // Initialize Google Maps once — no coordinate props in deps to prevent
  // re-mounting the map when lat/lng change after a place is selected.
  useEffect(() => {
    let isCancelled = false;

    const initialize = async () => {
      try {
        await loadGoogleMaps();
        if (isCancelled || !mapRef.current || !window.google) return;

        // Read initial coordinates from refs so this effect doesn't need
        // latitude/longitude as dependencies.
        const lat = parseFloat(latitudeRef.current) || 6.244203;
        const lng = parseFloat(longitudeRef.current) || -75.581215;

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
            onLatitudeChangeRef.current(position.lat().toString());
            onLongitudeChangeRef.current(position.lng().toString());
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
              const placeLat = place.geometry.location.lat();
              const placeLng = place.geometry.location.lng();

              onLatitudeChangeRef.current(placeLat.toString());
              onLongitudeChangeRef.current(placeLng.toString());
              mapInstance.setCenter({ lat: placeLat, lng: placeLng });
              markerInstance.setPosition({ lat: placeLat, lng: placeLng });

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
    // Intentionally empty deps: the map is initialized once on mount.
    // Coordinate changes are handled by the effect below via isMapLoaded.
    // Callbacks are accessed via stable refs, not captured in closures.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update map when coordinates change externally (e.g. after place selection
  // updates the form state, or when editing an existing branch).
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
          onLatitudeChangeRef.current(lat.toString());
          onLongitudeChangeRef.current(lng.toString());
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

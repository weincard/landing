/**
 * Google Maps REST API Service
 * Uses Google Maps Platform REST APIs instead of JavaScript SDK
 */

/**
 * Google Maps REST API Service
 * Uses Google Maps Platform REST APIs instead of JavaScript SDK
 */

const GOOGLE_PLACES_API_KEY =
  process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY || "";

const GOOGLE_MAPS_API_KEY = "AIzaSyCdlSGLxIHphwSa8T2M_p4hZk5473_Luug";

// Debug logs for API keys (only show first 10 chars for security)
if (typeof window !== "undefined") {
  console.log(
    "[Google Maps Service] Places API Key:",
    GOOGLE_PLACES_API_KEY
      ? `${GOOGLE_PLACES_API_KEY.substring(0, 10)}...`
      : "NOT SET"
  );
  console.log(
    "[Google Maps Service] Maps API Key:",
    GOOGLE_MAPS_API_KEY
      ? `${GOOGLE_MAPS_API_KEY.substring(0, 10)}...`
      : "NOT SET"
  );
}

export interface GoogleAddressPrediction {
  placeId: string;
  description: string;
  mainText: string;
  secondaryText: string;
}

export interface GooglePlaceDetails {
  placeId: string;
  formattedAddress: string;
  latitude: number;
  longitude: number;
  street?: string;
  locality?: string;
  administrativeArea?: string;
  postalCode?: string;
  country?: string;
  countryCode?: string;
}

export interface ReverseGeocodeResult {
  formattedAddress: string;
  latitude: number;
  longitude: number;
  street?: string;
  locality?: string;
  administrativeArea?: string;
  postalCode?: string;
  country?: string;
  components: Array<{
    types: string[];
    longName: string;
    shortName: string;
  }>;
}

/**
 * Get autocomplete predictions for an address query
 */
export async function getAddressPredictions(
  query: string
): Promise<GoogleAddressPrediction[]> {
  if (!query || query.trim().length < 3) {
    return [];
  }

  if (!GOOGLE_PLACES_API_KEY) {
    console.error("[getAddressPredictions] Places API Key is not configured");
    return [];
  }

  const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
    query
  )}&key=${GOOGLE_PLACES_API_KEY}&types=geocode`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === "OK" && data.predictions) {
      return data.predictions.map((prediction: any) => ({
        placeId: prediction.place_id,
        description: prediction.description,
        mainText: prediction.structured_formatting?.main_text || "",
        secondaryText: prediction.structured_formatting?.secondary_text || "",
      }));
    }

    return [];
  } catch (error) {
    console.error("Error fetching address predictions:", error);
    return [];
  }
}

/**
 * Get detailed information about a place using its place_id
 */
export async function getPlaceDetails(
  placeId: string
): Promise<GooglePlaceDetails | null> {
  if (!GOOGLE_PLACES_API_KEY) {
    console.error("[getPlaceDetails] Places API Key is not configured");
    return null;
  }

  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${GOOGLE_PLACES_API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === "OK" && data.result) {
      const result = data.result;
      const location = result.geometry?.location;
      const addressComponents = result.address_components || [];

      // Extract address components
      let street = "";
      let locality = "";
      let administrativeArea = "";
      let postalCode = "";
      let country = "";
      let countryCode = "";

      addressComponents.forEach((component: any) => {
        const types = component.types || [];

        if (types.includes("street_number") || types.includes("route")) {
          street += component.long_name + " ";
        }
        if (types.includes("locality")) {
          locality = component.long_name;
        }
        if (types.includes("administrative_area_level_1")) {
          administrativeArea = component.long_name;
        }
        if (types.includes("postal_code")) {
          postalCode = component.long_name;
        }
        if (types.includes("country")) {
          country = component.long_name;
          countryCode = component.short_name;
        }
      });

      return {
        placeId,
        formattedAddress: result.formatted_address || "",
        latitude: location?.lat || 0,
        longitude: location?.lng || 0,
        street: street.trim(),
        locality,
        administrativeArea,
        postalCode,
        country,
        countryCode,
      };
    }

    return null;
  } catch (error) {
    console.error("Error fetching place details:", error);
    return null;
  }
}

/**
 * Reverse geocode coordinates to get address information
 */
export async function reverseGeocode(
  latitude: number,
  longitude: number
): Promise<ReverseGeocodeResult | null> {
  if (!GOOGLE_MAPS_API_KEY) {
    console.error("[reverseGeocode] Maps API Key is not configured");
    return null;
  }

  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === "OK" && data.results && data.results.length > 0) {
      const result = data.results[0];
      const addressComponents = result.address_components || [];

      // Extract components
      let street = "";
      let locality = "";
      let administrativeArea = "";
      let postalCode = "";
      let country = "";

      const components = addressComponents.map((component: any) => ({
        types: component.types || [],
        longName: component.long_name || "",
        shortName: component.short_name || "",
      }));

      components.forEach(
        (component: {
          types: string[];
          longName: string;
          shortName: string;
        }) => {
          if (
            component.types.includes("street_number") ||
            component.types.includes("route")
          ) {
            street += component.longName + " ";
          }
          if (component.types.includes("locality")) {
            locality = component.longName;
          }
          if (component.types.includes("administrative_area_level_1")) {
            administrativeArea = component.longName;
          }
          if (component.types.includes("postal_code")) {
            postalCode = component.longName;
          }
          if (component.types.includes("country")) {
            country = component.longName;
          }
        }
      );

      return {
        formattedAddress: result.formatted_address || "",
        latitude,
        longitude,
        street: street.trim(),
        locality,
        administrativeArea,
        postalCode,
        country,
        components,
      };
    }

    return null;
  } catch (error) {
    console.error("Error reverse geocoding:", error);
    return null;
  }
}

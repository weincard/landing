// Default browse coordinates — Medellín center. Mirrors the Flutter app's
// `AppConst.defaultLocation` (LatLng(6.2085, -75.5658)). Used when the browser
// doesn't grant geolocation, so /branches/tiles always receives lat/lng (the
// endpoint's no-geo path is not used by Flutter and isn't reliable).
export const DEFAULT_LOCATION = { lat: 6.2085, lng: -75.5658 } as const;

export interface Coords {
  lat: number;
  lng: number;
}

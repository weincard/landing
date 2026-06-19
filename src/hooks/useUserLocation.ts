import { useState, useEffect } from "react";
import { DEFAULT_LOCATION, type Coords } from "@/lib/location";

// Returns the user's coordinates for distance-sorted browsing. Starts at the
// Medellín default and upgrades to the device location if the browser grants
// geolocation — exactly like Flutter (real location when available, else the
// app's default coords). Never blocks: on denial/error/timeout it stays default.
export function useUserLocation(): Coords {
  const [coords, setCoords] = useState<Coords>(DEFAULT_LOCATION);

  useEffect(() => {
    if (typeof navigator === "undefined" || !("geolocation" in navigator)) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => {
        /* denied / unavailable — keep the default coords */
      },
      { timeout: 8000, maximumAge: 5 * 60 * 1000 },
    );
  }, []);

  return coords;
}

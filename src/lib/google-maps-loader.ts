export function loadGoogleMaps(): Promise<typeof google> {
  if (typeof window === "undefined") {
    return Promise.reject(
      new Error("Google Maps can only be loaded in the browser")
    );
  }

  // If already loaded
  if (window.google && (window.google as any).maps) {
    return Promise.resolve(window.google);
  }

  // If a load is in progress, reuse it
  if (window.__googleMapsScriptLoadingPromise) {
    return window.__googleMapsScriptLoadingPromise;
  }

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    return Promise.reject(new Error("Missing NEXT_PUBLIC_GOOGLE_MAPS_API_KEY"));
  }

  window.__googleMapsScriptLoadingPromise = new Promise((resolve, reject) => {
    // Check if a script already exists in DOM to avoid duplicates
    const existing = document.querySelector(
      'script[data-google-maps-loader="true"]'
    ) as HTMLScriptElement | null;

    if (existing) {
      existing.addEventListener("load", () => resolve(window.google!));
      existing.addEventListener("error", () =>
        reject(new Error("Failed to load Google Maps script"))
      );
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.dataset.googleMapsLoader = "true";

    script.onload = () => {
      resolve(window.google!);
    };
    script.onerror = () => {
      reject(new Error("Failed to load Google Maps script"));
    };

    document.head.appendChild(script);
  });

  return window.__googleMapsScriptLoadingPromise;
}

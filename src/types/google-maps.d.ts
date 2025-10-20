/// <reference types="google.maps" />

declare global {
  interface Window {
    google: typeof google;
    __googleMapsScriptLoadingPromise?: Promise<typeof google>;
  }
}

export {};

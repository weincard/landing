import { useSyncExternalStore } from "react";

// The user's chosen delivery pin — where the order should arrive. Distinct
// from useUserLocation (the GPS point used for distance sorting): the pin is
// explicit, persisted, and can be somewhere else ("pedir para la casa desde
// la oficina"). Null = not chosen yet → the deliveries listing stays
// unfiltered, exactly like clients that predate coverage.
export interface DeliveryPin {
  lat: number;
  lng: number;
  address: string;
  label?: string | null;
}

const STORAGE_KEY = "wc_delivery_pin";

let current: DeliveryPin | null = readStorage();
const listeners = new Set<() => void>();

function readStorage(): DeliveryPin | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as DeliveryPin;
    if (
      typeof parsed?.lat !== "number" ||
      typeof parsed?.lng !== "number" ||
      typeof parsed?.address !== "string"
    )
      return null;
    return parsed;
  } catch {
    return null;
  }
}

export function setDeliveryPin(pin: DeliveryPin | null) {
  current = pin;
  try {
    if (pin) localStorage.setItem(STORAGE_KEY, JSON.stringify(pin));
    else localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* storage unavailable — keep the in-memory value */
  }
  listeners.forEach((l) => l());
}

export function getDeliveryPin(): DeliveryPin | null {
  return current;
}

export function useDeliveryPin(): DeliveryPin | null {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => current,
  );
}

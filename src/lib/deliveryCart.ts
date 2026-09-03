import { useSyncExternalStore } from "react";

// The delivery cart (Phase B) — one cart, scoped to ONE branch at a time
// (ordering spans a single restaurant). Persisted like the delivery pin so a
// reload/login round-trip doesn't lose it. Same useSyncExternalStore pattern
// as lib/deliveryLocation.ts.

export interface CartItem {
  masterProductId: number;
  name: string;
  price: number;
  imageUrl: string | null;
  quantity: number;
  // Customer observation for this line ("sin queso") — optional.
  notes?: string | null;
}

export interface DeliveryCart {
  branchId: number;
  branchName: string;
  items: CartItem[];
}

const STORAGE_KEY = "wc_delivery_cart";

let current: DeliveryCart | null = readStorage();
const listeners = new Set<() => void>();

function readStorage(): DeliveryCart | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as DeliveryCart;
    if (
      typeof parsed?.branchId !== "number" ||
      !Array.isArray(parsed?.items) ||
      parsed.items.length === 0
    )
      return null;
    return parsed;
  } catch {
    return null;
  }
}

function write(cart: DeliveryCart | null) {
  current = cart;
  try {
    if (cart) localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    else localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* storage unavailable — keep the in-memory value */
  }
  listeners.forEach((l) => l());
}

export function getDeliveryCart(): DeliveryCart | null {
  return current;
}

export function clearDeliveryCart() {
  write(null);
}

/** Set/clear the observation of a cart line (kept while quantities change). */
export function setCartItemNote(masterProductId: number, notes: string) {
  if (!current) return;
  write({
    ...current,
    items: current.items.map((i) =>
      i.masterProductId === masterProductId
        ? { ...i, notes: notes.trim() ? notes : null }
        : i,
    ),
  });
}

/**
 * Set an item's quantity (0 removes it; an empty cart clears itself).
 * A different branchId REPLACES the cart — call sites confirm with the user
 * first when a cart from another branch exists.
 */
export function setCartItem(
  branch: { branchId: number; branchName: string },
  item: Omit<CartItem, "quantity">,
  quantity: number,
) {
  const base: DeliveryCart =
    current && current.branchId === branch.branchId
      ? { ...current, items: [...current.items] }
      : { branchId: branch.branchId, branchName: branch.branchName, items: [] };
  const idx = base.items.findIndex(
    (i) => i.masterProductId === item.masterProductId,
  );
  if (quantity <= 0) {
    if (idx >= 0) base.items.splice(idx, 1);
  } else if (idx >= 0) {
    base.items[idx] = { ...base.items[idx], ...item, quantity };
  } else {
    base.items.push({ ...item, quantity });
  }
  write(base.items.length ? base : null);
}

export const cartQuantity = (
  cart: DeliveryCart | null,
  masterProductId: number,
): number =>
  cart?.items.find((i) => i.masterProductId === masterProductId)?.quantity ?? 0;

export const cartCount = (cart: DeliveryCart | null): number =>
  cart?.items.reduce((sum, i) => sum + i.quantity, 0) ?? 0;

export const cartSubtotal = (cart: DeliveryCart | null): number =>
  cart?.items.reduce((sum, i) => sum + i.price * i.quantity, 0) ?? 0;

export function useDeliveryCart(): DeliveryCart | null {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => current,
  );
}

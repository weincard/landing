import { useSyncExternalStore } from "react";

// The delivery cart (Phase B) — one cart, scoped to ONE branch at a time
// (ordering spans a single restaurant). Persisted like the delivery pin so a
// reload/login round-trip doesn't lose it. Same useSyncExternalStore pattern
// as lib/deliveryLocation.ts.
//
// Catalog v2: lines are keyed by `lineId` (NOT by product) — the same product
// with different selections or a different note is a distinct line. `price`
// is the COMPOSED unit price (base + Σ selection priceDelta) so every total
// formula downstream (cart bar, checkout, discount rounding) reads one number.

export interface CartSelection {
  modifierOptionId: number;
  name: string;
  priceDelta: number;
  /** Always 1 in v2 (options are on/off). */
  quantity: number;
}

export interface CartLine {
  lineId: string;
  masterProductId: number;
  name: string;
  /** Composed unit price: base + Σ priceDelta. */
  price: number;
  imageUrl: string | null;
  quantity: number;
  selections: CartSelection[];
  // Customer observation for this line ("sin queso") — optional.
  notes?: string | null;
}

export interface DeliveryCart {
  branchId: number;
  branchName: string;
  items: CartLine[];
}

const STORAGE_KEY = "wc_delivery_cart";

let current: DeliveryCart | null = readStorage();
const listeners = new Set<() => void>();

// Pre-v2 carts (no lineId) are simply dropped — no migration.
function readStorage(): DeliveryCart | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as DeliveryCart;
    if (
      typeof parsed?.branchId !== "number" ||
      !Array.isArray(parsed?.items) ||
      parsed.items.length === 0 ||
      parsed.items.some(
        (i) =>
          typeof i?.lineId !== "string" ||
          typeof i?.masterProductId !== "number" ||
          !Array.isArray(i?.selections),
      )
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

function newLineId(): string {
  try {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  } catch {
    /* fall through */
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export function getDeliveryCart(): DeliveryCart | null {
  return current;
}

export function clearDeliveryCart() {
  write(null);
}

const selectionKey = (sel: CartSelection[]) =>
  sel
    .map((s) => s.modifierOptionId)
    .sort((a, b) => a - b)
    .join("+");

const sameLine = (a: CartLine, b: Omit<CartLine, "lineId" | "quantity">) =>
  a.masterProductId === b.masterProductId &&
  selectionKey(a.selections) === selectionKey(b.selections) &&
  (a.notes ?? "").trim() === (b.notes ?? "").trim();

/**
 * Add a line (merges into an existing line only when product + selections +
 * note all match — then increments). A different branchId REPLACES the cart
 * — call sites confirm with the user first when another branch's cart exists.
 */
export function addCartLine(
  branch: { branchId: number; branchName: string },
  line: Omit<CartLine, "lineId" | "quantity">,
  quantity: number,
) {
  if (quantity <= 0) return;
  const base: DeliveryCart =
    current && current.branchId === branch.branchId
      ? { ...current, items: [...current.items] }
      : { branchId: branch.branchId, branchName: branch.branchName, items: [] };
  const idx = base.items.findIndex((i) => sameLine(i, line));
  if (idx >= 0) {
    const merged = base.items[idx];
    base.items[idx] = { ...merged, quantity: Math.min(50, merged.quantity + quantity) };
  } else {
    base.items.push({
      ...line,
      notes: line.notes?.trim() ? line.notes : null,
      lineId: newLineId(),
      quantity: Math.min(50, quantity),
    });
  }
  write(base);
}

/** Set a line's quantity (0 removes it; an empty cart clears itself). */
export function setLineQuantity(lineId: string, quantity: number) {
  if (!current) return;
  const items = current.items
    .map((i) => (i.lineId === lineId ? { ...i, quantity: Math.min(50, quantity) } : i))
    .filter((i) => i.quantity > 0);
  write(items.length ? { ...current, items } : null);
}

/** Aggregate quantity of a product across all its lines (tile badge). */
export const productQuantity = (
  cart: DeliveryCart | null,
  masterProductId: number,
): number =>
  cart?.items
    .filter((i) => i.masterProductId === masterProductId)
    .reduce((sum, i) => sum + i.quantity, 0) ?? 0;

export const cartCount = (cart: DeliveryCart | null): number =>
  cart?.items.reduce((sum, i) => sum + i.quantity, 0) ?? 0;

export const cartSubtotal = (cart: DeliveryCart | null): number =>
  cart?.items.reduce((sum, i) => sum + i.price * i.quantity, 0) ?? 0;

/** "Cascos · +Queso extra" for a cart line. */
export const describeSelections = (sel: CartSelection[]): string =>
  sel.map((s) => `${s.priceDelta > 0 ? "+" : ""}${s.name}`).join(" · ");

export function useDeliveryCart(): DeliveryCart | null {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => current,
  );
}

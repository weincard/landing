import { honoClient } from "./honoClient";

// Structured delivery orders (Phase B — Armi). The backend re-validates and
// re-prices everything server-side; the quote here is display-only.

export type DeliveryOrderStatus =
  | "pending_confirmation"
  | "confirmed"
  | "dispatched"
  | "delivered"
  | "cancelled_by_user"
  | "cancelled_by_ally"
  | "cancelled_no_response"
  | "cancelled_by_partner"
  | "failed_dispatch";

export type OrderPaymentMethod = "cash" | "card_terminal";

export interface OrderItemInput {
  masterProductId: number;
  quantity: number;
  notes?: string | null;
  // Catalog v2 — one entry per selected option (on/off, quantity 1).
  selections?: { modifierOptionId: number }[];
}

// Snapshot of a selected modifier on an order line (names/prices at order time).
export interface OrderItemModifier {
  modifierOptionId: number;
  groupName: string;
  name: string;
  priceDelta: number;
  quantity: number;
}

/** "Cascos · +Queso extra" — free choices by name, priced add-ons with "+". */
export const describeModifiers = (mods?: OrderItemModifier[] | null): string =>
  (mods ?? [])
    .map((m) => `${m.priceDelta > 0 ? "+" : ""}${m.name}`)
    .join(" · ");

export interface OrderQuote {
  subtotal: number;
  discountPct: number;
  discountAmount: number;
  deliveryFee: number;
  total: number;
  distanceKm: number | null;
  hadActiveMembership: boolean;
  membershipPlanKey: string | null;
  offer: { masterOfferId: number; title: string; pct: number } | null;
  usageLimitReached: boolean;
  minimumOrder: number | null;
}

export interface DeliveryOrderItem {
  deliveryOrderItemId: number;
  masterProductId: number | null;
  name: string;
  description: string | null;
  imageUrl: string | null;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
  notes?: string | null;
  /** Catalog v2 selections; unitPrice is the COMPOSED price (base + deltas). */
  modifiers?: OrderItemModifier[];
}

export interface DeliveryOrder {
  deliveryOrderId: number;
  status: DeliveryOrderStatus;
  branchId: number | null;
  branchName: string | null;
  branchLogoUrl: string | null;
  customerName: string;
  customerPhone: string;
  address: string;
  addressDetails: string | null;
  notes: string | null;
  subtotal: number;
  discountPct: number;
  discountAmount: number;
  deliveryFee: number;
  total: number;
  paymentMethod: OrderPaymentMethod;
  hadActiveMembership: boolean;
  offer: { masterOfferId: number; title: string } | null;
  // Armi courier progress, verbatim (see lib/orderStatus.ts for labels).
  armiStatusCode: number | null;
  armiStatusText: string | null;
  armiStatusAt: string | null;
  confirmExpiresAt: string;
  confirmedAt: string | null;
  dispatchedAt: string | null;
  deliveredAt: string | null;
  cancelledAt: string | null;
  cancelledBy: string | null;
  cancelReason: string | null;
  createdAt: string;
  updatedAt: string;
  items: DeliveryOrderItem[];
}

export const TERMINAL_ORDER_STATUSES: DeliveryOrderStatus[] = [
  "delivered",
  "cancelled_by_user",
  "cancelled_by_ally",
  "cancelled_no_response",
  "cancelled_by_partner",
];

export const isTerminalOrder = (order: Pick<DeliveryOrder, "status">) =>
  TERMINAL_ORDER_STATUSES.includes(order.status);

export const quoteOrder = (payload: {
  branchId: number;
  items: OrderItemInput[];
  lat: number;
  lng: number;
  paymentMethod: OrderPaymentMethod;
}) => honoClient.post<OrderQuote>("/deliveries/orders/quote", payload);

export const createOrder = (payload: {
  branchId: number;
  items: OrderItemInput[];
  address: { address: string; details?: string | null; lat: number; lng: number };
  paymentMethod: OrderPaymentMethod;
  notes?: string | null;
}) => honoClient.post<{ order: DeliveryOrder }>("/deliveries/orders/create", payload);

export const getMyOrders = () =>
  honoClient.get<{ data: DeliveryOrder[]; count: number }>(
    "/deliveries/orders/mine",
  );

export const getOrder = (orderId: number) =>
  honoClient.get<{ order: DeliveryOrder }>(`/deliveries/orders/${orderId}`);

export const cancelOrder = (orderId: number) =>
  honoClient.post<{ order: DeliveryOrder }>(
    `/deliveries/orders/${orderId}/cancel`,
    {},
  );

// ── Ally signed-link routes (public — the token IS the auth) ────────────────

export interface AllyOrderView {
  deliveryOrderId: number;
  status: DeliveryOrderStatus;
  expired: boolean;
  branchName: string | null;
  customerName: string;
  customerPhone: string;
  address: string;
  addressDetails: string | null;
  notes: string | null;
  subtotal: number;
  discountPct: number;
  discountAmount: number;
  deliveryFee: number;
  total: number;
  paymentMethod: OrderPaymentMethod;
  confirmExpiresAt: string;
  createdAt: string;
  items: {
    name: string;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
    notes?: string | null;
    modifiers?: OrderItemModifier[];
  }[];
}

export const getAllyOrderByToken = (token: string) =>
  honoClient.get<{ order: AllyOrderView }>(`/deliveries/ally/confirm/${token}`);

export const actOnAllyOrder = (
  token: string,
  action: "confirm" | "reject",
  reason?: string,
) =>
  honoClient.post<{ order?: unknown; message?: string }>(
    `/deliveries/ally/confirm/${token}`,
    { action, ...(reason ? { reason } : {}) },
  );

// Display metadata for delivery orders (Phase B). Armi's courier lifecycle is
// stored verbatim (armiStatusCode/Text) — these labels mirror the backend's
// ARMI_STATUS_LABELS (packages/core/src/utils/armi.ts).
import type { DeliveryOrder, DeliveryOrderStatus } from "@/api/orders";

export const ORDER_STATUS_META: Record<
  DeliveryOrderStatus,
  { label: string; color: string }
> = {
  pending_confirmation: { label: "Esperando confirmación", color: "yellow" },
  confirmed: { label: "Confirmado", color: "blue" },
  dispatched: { label: "En curso", color: "indigo" },
  delivered: { label: "Entregado", color: "green" },
  cancelled_by_user: { label: "Cancelado por ti", color: "gray" },
  cancelled_by_ally: { label: "El restaurante no pudo tomarlo", color: "gray" },
  cancelled_no_response: { label: "El restaurante no confirmó", color: "orange" },
  cancelled_by_partner: { label: "Cancelado por la mensajería", color: "red" },
  failed_dispatch: { label: "Procesando con el restaurante", color: "yellow" },
};

export const ARMI_STATUS_LABELS: Record<number, string> = {
  0: "Recibido por la mensajería",
  1: "Emitido",
  2: "En camino hacia ti",
  3: "Mensajero asignado",
  4: "Mensajero recogiendo tu pedido",
  6: "Entregado",
  7: "Entregado",
  14: "Cancelado por la mensajería",
  33: "El mensajero llegó",
  37: "Pedido recogido",
  39: "Pedido recogido",
};

// The user-facing timeline: coarse steps derived from OUR status + the
// verbatim Armi code (the sequence 0→1→3→[4→37→39]→2→33→6→7).
export interface TimelineStep {
  key: string;
  label: string;
  done: boolean;
  current: boolean;
}

export function orderTimeline(order: DeliveryOrder): TimelineStep[] {
  const armi = order.armiStatusCode;
  const stage = (() => {
    if (order.status === "delivered") return 4;
    if (order.status === "dispatched") {
      if (armi === 2 || armi === 33) return 3; // en camino / en tu puerta
      if (armi != null && [3, 4, 37, 39].includes(armi)) return 2; // mensajero
      return 2;
    }
    if (order.status === "confirmed" || order.status === "failed_dispatch") return 1;
    return 0; // pending_confirmation (and cancelled — timeline hidden then)
  })();
  const labels = [
    "Pedido enviado",
    "Confirmado por el restaurante",
    "Mensajero en camino al restaurante",
    armi === 33 ? "El mensajero llegó a tu puerta" : "Tu pedido va en camino",
    "Entregado",
  ];
  return labels.map((label, i) => ({
    key: String(i),
    label,
    done: i < stage || (i === 4 && stage === 4),
    current: i === stage && stage < 4,
  }));
}

export const PAYMENT_METHOD_LABELS: Record<string, string> = {
  cash: "Efectivo",
  card_terminal: "Datáfono",
};

export const formatCop = (n: number) =>
  `$${Math.round(Number(n)).toLocaleString("es-CO")}`;

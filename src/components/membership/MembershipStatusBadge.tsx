import { Badge } from "@mantine/core";

interface Props {
  status: string;
}

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  active:         { label: "Activa",               color: "green" },
  pending_cancel: { label: "Cancelación pendiente", color: "yellow" },
  trialing:       { label: "Prueba gratuita",       color: "blue" },
  unpaid:         { label: "Pago pendiente",        color: "orange" },
  canceled:       { label: "Cancelada",             color: "gray" },
  ended:          { label: "Finalizada",            color: "gray" },
};

export function MembershipStatusBadge({ status }: Props) {
  const cfg = STATUS_CONFIG[status] ?? { label: status, color: "gray" };
  return (
    <Badge color={cfg.color} variant="filled" size="sm" radius="xl">
      {cfg.label}
    </Badge>
  );
}

import { useState } from "react";
import { useParams } from "react-router-dom";
import {
  Alert,
  Badge,
  Button,
  Center,
  Divider,
  Group,
  Loader,
  Paper,
  Stack,
  Text,
  Textarea,
  Title,
} from "@mantine/core";
import { AlertCircle, Check, Clock, X } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { actOnAllyOrder, getAllyOrderByToken } from "@/api/orders";
import { PAYMENT_METHOD_LABELS, formatCop } from "@/lib/orderStatus";
import { PageMeta } from "@/components/layout/PageMeta";

type ApiErr = { response?: { data?: { message?: string; code?: string } } };

// Ally order confirmation via signed link (Phase B — no login: the token in
// the URL is the auth). Reached from the "nuevo pedido" WhatsApp template.
// Confirming here dispatches the Armi courier.
export function PedidoAliadoPage() {
  const { token = "" } = useParams<{ token: string }>();
  const qc = useQueryClient();
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState("");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["ally-order", token],
    enabled: token.length > 10,
    retry: false,
    queryFn: () => getAllyOrderByToken(token).then((r) => r.data.order),
  });

  const act = useMutation({
    mutationFn: (action: "confirm" | "reject") =>
      actOnAllyOrder(token, action, reason.trim() || undefined),
    onSuccess: (_res, action) => {
      toast.success(
        action === "confirm"
          ? "¡Pedido confirmado! Armi asignará un mensajero."
          : "Pedido rechazado.",
      );
      setRejecting(false);
      qc.invalidateQueries({ queryKey: ["ally-order", token] });
    },
    onError: (e: ApiErr) => {
      toast.error(e.response?.data?.message ?? "No se pudo procesar.");
      qc.invalidateQueries({ queryKey: ["ally-order", token] });
    },
  });

  const order = data;
  const pending =
    order && !order.expired && order.status === "pending_confirmation";
  const retryable = order && order.status === "failed_dispatch";

  return (
    <>
      <PageMeta
        title="Confirmar pedido"
        description="Confirma el pedido de tu cliente Weincard."
        path="/pedido-aliado"
      />
      <Stack gap="lg" py="xl" maw={480} mx="auto" px="md">
        <Title order={2} ta="center" style={{ fontFamily: '"Clash Grotesk", sans-serif' }}>
          Pedido Weincard
        </Title>

        {isLoading && (
          <Center py={60}>
            <Loader color="dark" />
          </Center>
        )}
        {(isError || (!isLoading && !order)) && (
          <Alert icon={<AlertCircle size={16} />} color="red" variant="light">
            Enlace inválido o vencido. Revisa el panel de pedidos de tu
            dashboard.
          </Alert>
        )}

        {order && (
          <Paper withBorder radius="lg" p="lg">
            <Stack gap="sm">
              <Group justify="space-between">
                <Text fw={700}>#{order.deliveryOrderId}</Text>
                <Text size="xs" c="dimmed">
                  {new Date(order.createdAt).toLocaleString("es-CO")}
                </Text>
              </Group>
              {order.branchName && (
                <Text size="sm" c="dimmed">
                  {order.branchName}
                </Text>
              )}

              <Divider />
              {order.items.map((item, idx) => (
                <Group key={idx} justify="space-between">
                  <Text size="sm">
                    {item.quantity}× {item.name}
                  </Text>
                  <Text size="sm">{formatCop(item.lineTotal)}</Text>
                </Group>
              ))}
              {order.discountAmount > 0 && (
                <Group justify="space-between">
                  <Text size="sm" c="green">
                    Descuento Weincard {order.discountPct}%
                  </Text>
                  <Text size="sm" c="green">
                    -{formatCop(order.discountAmount)}
                  </Text>
                </Group>
              )}
              <Group justify="space-between">
                <Text size="sm">Domicilio (Armi)</Text>
                <Text size="sm">{formatCop(order.deliveryFee)}</Text>
              </Group>
              <Divider />
              <Group justify="space-between">
                <Text fw={700}>
                  Cobrar {PAYMENT_METHOD_LABELS[order.paymentMethod]}
                </Text>
                <Text fw={700}>{formatCop(order.total)}</Text>
              </Group>

              <Divider />
              <Stack gap={2}>
                <Text size="sm" fw={600}>
                  {order.customerName}
                </Text>
                <Text size="sm">
                  <a href={`tel:${order.customerPhone}`}>{order.customerPhone}</a>
                </Text>
                <Text size="sm">{order.address}</Text>
                {order.addressDetails && (
                  <Text size="sm" c="dimmed">
                    {order.addressDetails}
                  </Text>
                )}
                {order.notes && (
                  <Text size="sm" c="dimmed">
                    Notas: {order.notes}
                  </Text>
                )}
              </Stack>

              {pending || retryable ? (
                <>
                  {retryable && (
                    <Alert color="yellow" variant="light">
                      El envío a la mensajería falló — confirma de nuevo para
                      reintentarlo.
                    </Alert>
                  )}
                  {!rejecting ? (
                    <Group grow mt="sm">
                      <Button
                        color="green"
                        radius="xl"
                        leftSection={<Check size={16} />}
                        loading={act.isPending}
                        onClick={() => act.mutate("confirm")}
                      >
                        {retryable ? "Reintentar envío" : "Confirmar"}
                      </Button>
                      <Button
                        color="red"
                        variant="outline"
                        radius="xl"
                        leftSection={<X size={16} />}
                        onClick={() => setRejecting(true)}
                      >
                        Rechazar
                      </Button>
                    </Group>
                  ) : (
                    <Stack gap="xs" mt="sm">
                      <Textarea
                        label="Motivo (se le muestra al cliente)"
                        placeholder="Ej: nos quedamos sin ese producto"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                      />
                      <Group grow>
                        <Button variant="default" radius="xl" onClick={() => setRejecting(false)}>
                          Volver
                        </Button>
                        <Button
                          color="red"
                          radius="xl"
                          loading={act.isPending}
                          onClick={() => act.mutate("reject")}
                        >
                          Rechazar pedido
                        </Button>
                      </Group>
                    </Stack>
                  )}
                </>
              ) : order.expired && order.status === "pending_confirmation" ? (
                <Alert icon={<Clock size={16} />} color="orange" variant="light">
                  Este pedido venció sin confirmación y fue cancelado.
                </Alert>
              ) : (
                <Badge
                  size="lg"
                  variant="light"
                  color={
                    order.status === "dispatched" || order.status === "delivered"
                      ? "green"
                      : "gray"
                  }
                  style={{ alignSelf: "flex-start" }}
                >
                  {order.status === "dispatched"
                    ? "Confirmado — mensajero en camino"
                    : order.status === "delivered"
                      ? "Entregado"
                      : "Ya no está pendiente"}
                </Badge>
              )}
            </Stack>
          </Paper>
        )}
        <Text size="xs" c="dimmed" ta="center">
          También puedes gestionar tus pedidos en el dashboard de aliados de
          Weincard.
        </Text>
      </Stack>
    </>
  );
}

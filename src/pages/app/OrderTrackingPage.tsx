import { Link, useParams } from "react-router-dom";
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
  Timeline,
  Title,
} from "@mantine/core";
import { AlertCircle, ArrowLeft, Check, Clock } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { cancelOrder, getOrder, isTerminalOrder } from "@/api/orders";
import {
  ORDER_STATUS_META,
  PAYMENT_METHOD_LABELS,
  formatCop,
  orderTimeline,
} from "@/lib/orderStatus";
import { PageMeta } from "@/components/layout/PageMeta";

type ApiErr = { response?: { data?: { message?: string } } };

// Live order tracking (Phase B). Polls every 15s while the order is in
// flight; push notifications also point here (route /orders?orderId=N in the
// app — this is the web twin).
export function OrderTrackingPage() {
  const { orderId: orderIdParam } = useParams<{ orderId: string }>();
  const orderId = Number(orderIdParam ?? "0");
  const qc = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["order", orderId],
    enabled: orderId > 0,
    queryFn: () => getOrder(orderId).then((r) => r.data.order),
    refetchInterval: (query) =>
      query.state.data && !isTerminalOrder(query.state.data) ? 15_000 : false,
  });

  const cancel = useMutation({
    mutationFn: () => cancelOrder(orderId),
    onSuccess: () => {
      toast.success("Pedido cancelado.");
      qc.invalidateQueries({ queryKey: ["order", orderId] });
      qc.invalidateQueries({ queryKey: ["my-orders"] });
    },
    onError: (e: ApiErr) =>
      toast.error(e.response?.data?.message ?? "No se pudo cancelar."),
  });

  const order = data;
  const meta = order ? ORDER_STATUS_META[order.status] : null;
  const cancelled =
    order &&
    ["cancelled_by_user", "cancelled_by_ally", "cancelled_no_response", "cancelled_by_partner"].includes(
      order.status,
    );
  const pendingMinutes = order
    ? Math.max(
        0,
        Math.round(
          (new Date(order.confirmExpiresAt).getTime() - Date.now()) / 60000,
        ),
      )
    : 0;
  const steps = order && !cancelled ? orderTimeline(order) : [];
  const activeStep = steps.filter((s) => s.done).length;

  return (
    <>
      <PageMeta
        title={order ? `Pedido #${order.deliveryOrderId}` : "Pedido"}
        description="Seguimiento de tu pedido a domicilio."
        path={`/app/orders/${orderId}`}
      />
      <Stack gap="lg" py="lg" maw={560} mx="auto">
        <Button
          variant="subtle"
          color="dark"
          size="xs"
          leftSection={<ArrowLeft size={14} />}
          component={Link}
          to="/app/orders"
          style={{ alignSelf: "flex-start" }}
        >
          Mis pedidos
        </Button>

        {isLoading && (
          <Center py={60}>
            <Loader color="dark" />
          </Center>
        )}
        {isError && (
          <Alert icon={<AlertCircle size={16} />} color="red" variant="light">
            No encontramos este pedido.
          </Alert>
        )}

        {order && meta && (
          <>
            <Group justify="space-between" align="flex-start">
              <Stack gap={2}>
                <Title order={2} style={{ fontFamily: '"Clash Grotesk", sans-serif' }}>
                  {order.branchName ?? "Pedido"}
                </Title>
                <Text size="xs" c="dimmed">
                  Pedido #{order.deliveryOrderId} ·{" "}
                  {new Date(order.createdAt).toLocaleString("es-CO")}
                </Text>
              </Stack>
              <Badge color={meta.color} variant="light" size="lg">
                {meta.label}
              </Badge>
            </Group>

            {order.status === "pending_confirmation" && (
              <Alert icon={<Clock size={16} />} color="yellow" variant="light">
                El restaurante tiene {pendingMinutes} min para confirmar tu
                pedido. Si no lo hace, se cancela solo y no se te cobra nada.
              </Alert>
            )}
            {order.status === "failed_dispatch" && (
              <Alert icon={<Clock size={16} />} color="yellow" variant="light">
                Estamos coordinando tu pedido con el restaurante. Te avisamos
                en cuanto salga.
              </Alert>
            )}
            {cancelled && (
              <Alert icon={<AlertCircle size={16} />} color="gray" variant="light">
                {order.cancelReason
                  ? `Motivo: ${order.cancelReason}`
                  : "Este pedido fue cancelado. No se te cobró nada."}
              </Alert>
            )}

            {steps.length > 0 && (
              <Paper withBorder radius="lg" p="md">
                <Timeline
                  active={activeStep - 1}
                  bulletSize={22}
                  lineWidth={2}
                  color="dark"
                >
                  {steps.map((step) => (
                    <Timeline.Item
                      key={step.key}
                      title={step.label}
                      bullet={step.done ? <Check size={12} /> : undefined}
                    />
                  ))}
                </Timeline>
              </Paper>
            )}

            <Paper withBorder radius="lg" p="md">
              <Stack gap={6}>
                {order.items.map((item) => (
                  <Group key={item.deliveryOrderItemId} justify="space-between">
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
                  <Text size="sm">Costo de envío</Text>
                  <Text size="sm">{formatCop(order.deliveryFee)}</Text>
                </Group>
                <Divider my={4} />
                <Group justify="space-between">
                  <Text fw={700}>
                    Total ({PAYMENT_METHOD_LABELS[order.paymentMethod]})
                  </Text>
                  <Text fw={700}>{formatCop(order.total)}</Text>
                </Group>
              </Stack>
            </Paper>

            <Paper withBorder radius="lg" p="md">
              <Stack gap={4}>
                <Text fw={600} size="sm">
                  Entrega
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
            </Paper>

            {order.status === "pending_confirmation" && (
              <Button
                variant="outline"
                color="red"
                radius="xl"
                loading={cancel.isPending}
                onClick={() => {
                  if (window.confirm("¿Cancelar este pedido?")) cancel.mutate();
                }}
              >
                Cancelar pedido
              </Button>
            )}
          </>
        )}
      </Stack>
    </>
  );
}

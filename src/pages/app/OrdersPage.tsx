import { Link } from "react-router-dom";
import {
  Badge,
  Center,
  Group,
  Image,
  Loader,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getMyOrders, isTerminalOrder } from "@/api/orders";
import { ORDER_STATUS_META, formatCop } from "@/lib/orderStatus";
import { PageMeta } from "@/components/layout/PageMeta";

// "Mis pedidos" (Phase B) — the user's structured delivery orders. Polls
// while any order is still in flight so the list stays live.
export function OrdersPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["my-orders"],
    queryFn: () => getMyOrders().then((r) => r.data),
    refetchInterval: (query) =>
      query.state.data?.data.some((o) => !isTerminalOrder(o)) ? 15_000 : false,
  });

  const orders = data?.data ?? [];

  return (
    <>
      <PageMeta
        title="Mis pedidos"
        description="Tus pedidos a domicilio."
        path="/app/orders"
      />
      <Stack gap="lg" py="lg" maw={640} mx="auto">
        <Title order={2} style={{ fontFamily: '"Clash Grotesk", sans-serif' }}>
          Mis pedidos
        </Title>

        {isLoading && (
          <Center py={60}>
            <Loader color="dark" />
          </Center>
        )}
        {!isLoading && orders.length === 0 && (
          <Paper withBorder radius="lg" p="lg">
            <Text c="dimmed" size="sm">
              Aún no has hecho pedidos a domicilio. Explora los restaurantes en{" "}
              <Link to="/app/explore">Explorar</Link>.
            </Text>
          </Paper>
        )}

        {orders.map((order) => {
          const meta = ORDER_STATUS_META[order.status];
          return (
            <Paper
              key={order.deliveryOrderId}
              withBorder
              radius="lg"
              p="md"
              component={Link}
              to={`/app/orders/${order.deliveryOrderId}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <Group justify="space-between" wrap="nowrap">
                <Group wrap="nowrap" gap="sm">
                  {order.branchLogoUrl && (
                    <Image
                      src={order.branchLogoUrl}
                      w={44}
                      h={44}
                      radius="md"
                      fit="contain"
                    />
                  )}
                  <Stack gap={2}>
                    <Text fw={600} size="sm">
                      {order.branchName ?? "Pedido"} · #{order.deliveryOrderId}
                    </Text>
                    <Text size="xs" c="dimmed">
                      {new Date(order.createdAt).toLocaleString("es-CO", {
                        day: "2-digit",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}{" "}
                      · {formatCop(order.total)}
                    </Text>
                    <Badge size="xs" color={meta.color} variant="light">
                      {meta.label}
                    </Badge>
                  </Stack>
                </Group>
                <ChevronRight size={16} />
              </Group>
            </Paper>
          );
        })}
      </Stack>
    </>
  );
}

import { useNavigate, useParams, Link } from "react-router-dom";
import { ActionIcon, Alert, Anchor, Badge, Box, Button, Center, Group, Image, Loader, Paper, Stack, Text, Title } from "@mantine/core";
import {
  AlertCircle,
  ArrowLeft,
  Bike,
  Clock,
  MapPinOff,
  Minus,
  Plus,
  ShoppingBag,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getBranchCatalog } from "@/api/deliveries";
import { useBranchDetail } from "@/hooks/useBranches";
import { useDeliveryPin } from "@/lib/deliveryLocation";
import {
  cartCount,
  cartQuantity,
  cartSubtotal,
  clearDeliveryCart,
  setCartItem,
  useDeliveryCart,
} from "@/lib/deliveryCart";
import { DeliveryLocationBar } from "@/components/delivery/DeliveryLocationBar";
import { PageMeta } from "@/components/layout/PageMeta";

const formatCop = (n: number) =>
  `$${Math.round(Number(n)).toLocaleString("es-CO")}`;

// Branch delivery menu (deliveries v2). Two modes:
//  - partner (Phase B, catalog.partnerEnabled): items get quantity steppers
//    and the sticky cart bar leads to /app/checkout/:branchId.
//  - contact: browse-only, the CTA keeps today's hand-off flow
//    (/app/delivery/:branchId). openNow / inCoverage are re-checked here (the
//    race guard: the branch may close, or the pin move, while browsing).
export function MenuPage() {
  const { branchId: branchIdParam } = useParams<{ branchId: string }>();
  const branchId = Number(branchIdParam ?? "0");
  const navigate = useNavigate();
  const pin = useDeliveryPin();
  const cart = useDeliveryCart();

  const { data: branch } = useBranchDetail(branchId, []);
  const {
    data: catalog,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["branch-catalog", branchId, pin],
    enabled: branchId > 0,
    queryFn: () => getBranchCatalog(branchId, pin).then((r) => r.data),
  });

  const closed = catalog ? !catalog.openNow : false;
  const outOfCoverage = catalog?.inCoverage === false;
  const canOrder = !!catalog && !closed && !outOfCoverage;
  const partnerEnabled = catalog?.partnerEnabled === true;

  const branchCart = cart && cart.branchId === branchId ? cart : null;
  const itemsInCart = cartCount(branchCart);
  const subtotal = cartSubtotal(branchCart);
  const minimumOrder = catalog?.minimumOrder ?? null;
  const belowMinimum = minimumOrder != null && subtotal < minimumOrder;

  // Mirror of the backend's discountedUnitPrice — slashed menu prices must
  // equal checkout to the peso.
  const discountPct = catalog?.discount?.pct ?? 0;
  const discounted = (p: number) => Math.round((p * (100 - discountPct)) / 100);

  const changeQty = (
    item: { masterProductId: number; name: string; price: number; imageUrl: string | null },
    qty: number,
  ) => {
    // One cart, one branch: replacing another restaurant's cart is explicit.
    if (cart && cart.branchId !== branchId && qty > 0) {
      const ok = window.confirm(
        `Tienes un pedido empezado en ${cart.branchName}. ¿Vaciarlo y empezar uno aquí?`,
      );
      if (!ok) return;
      clearDeliveryCart();
    }
    setCartItem(
      { branchId, branchName: branch?.name ?? catalog?.armiCity ?? "" },
      item,
      qty,
    );
  };

  return (
    <>
      <PageMeta
        title={branch ? `Menú — ${branch.name}` : "Menú"}
        description="Menú de domicilios del aliado."
        path={`/menu/${branchId}`}
      />
      <Stack gap="lg" py="lg" maw={640} mx="auto" px="md">
        <Button
          variant="subtle"
          color="dark"
          size="xs"
          leftSection={<ArrowLeft size={14} />}
          onClick={() => navigate(-1)}
          style={{ alignSelf: "flex-start" }}
        >
          Volver
        </Button>

        {discountPct > 0 && (
          <Paper radius="md" p="xs" bg="green.0">
            <Text size="sm" c="green.9" fw={600}>
              Tu descuento Weincard del {discountPct}% ya está aplicado en estos
              precios.
            </Text>
          </Paper>
        )}
        {!catalog?.discount && catalog?.upsellPct != null && (
          <Paper radius="md" p="xs" bg="green.0">
            <Text size="sm" c="green.9" fw={600}>
              Con Weincard este menú tendría {catalog.upsellPct}% de descuento.{" "}
              <Anchor component={Link} to="/planes" size="sm" fw={700}>
                Conoce los planes
              </Anchor>
            </Text>
          </Paper>
        )}
        <Group justify="space-between" align="flex-start">
          <Stack gap={2}>
            <Title order={2} style={{ fontFamily: '"Clash Grotesk", sans-serif' }}>
              {branch?.name ?? "Menú"}
            </Title>
            {branch?.deliveryConfig?.estimatedTime && (
              <Group gap={6}>
                <Clock size={13} />
                <Text size="xs" c="dimmed">
                  {branch.deliveryConfig.estimatedTime}
                </Text>
              </Group>
            )}
          </Stack>
          <DeliveryLocationBar />
        </Group>

        {closed && (
          <Alert
            icon={<Clock size={16} />}
            color="yellow"
            variant="light"
            title="Cerrado en este momento"
          >
            Esta sucursal no está recibiendo domicilios ahora. Puedes mirar el
            menú y volver en su horario.
          </Alert>
        )}
        {outOfCoverage && (
          <Alert
            icon={<MapPinOff size={16} />}
            color="red"
            variant="light"
            title="Fuera de cobertura"
          >
            Esta sucursal no llega a la ubicación que elegiste. Cambia la
            ubicación de entrega o explora otros domicilios.
          </Alert>
        )}

        {isLoading && (
          <Center py={60}>
            <Loader color="dark" />
          </Center>
        )}
        {isError && (
          <Alert icon={<AlertCircle size={16} />} color="red" variant="light">
            No pudimos cargar el menú. Intenta de nuevo.
          </Alert>
        )}
        {catalog && !catalog.sections.length && (
          <Text c="dimmed" size="sm">
            Este aliado aún no tiene menú publicado.
          </Text>
        )}

        {(catalog?.sections ?? []).map((section) => (
          <Stack key={section.name} gap="xs">
            <Title order={4} style={{ fontFamily: '"Clash Grotesk", sans-serif' }}>
              {section.name}
            </Title>
            {section.items.map((item) => {
              const qty = cartQuantity(branchCart, item.masterProductId);
              return (
                <Paper
                  key={item.masterProductId}
                  withBorder
                  radius="lg"
                  p="sm"
                  style={{ opacity: item.isAvailable ? 1 : 0.55 }}
                >
                  <Group wrap="nowrap" align="flex-start" justify="space-between">
                    <Box style={{ flex: 1 }}>
                      <Group gap="xs">
                        <Text fw={600} size="sm">
                          {item.name}
                        </Text>
                        {!item.isAvailable && (
                          <Badge size="xs" color="gray">
                            Agotado
                          </Badge>
                        )}
                      </Group>
                      {item.description && (
                        <Text size="xs" c="dimmed" mt={2} lineClamp={2}>
                          {item.description}
                        </Text>
                      )}
                      {discountPct > 0 ? (
                        <Group gap={6} mt={4}>
                          <Text fw={700} size="sm" c="green.8">
                            {formatCop(discounted(item.price))}
                          </Text>
                          <Text size="xs" c="dimmed" td="line-through">
                            {formatCop(item.price)}
                          </Text>
                        </Group>
                      ) : (
                        <Text fw={700} size="sm" mt={4}>
                          {formatCop(item.price)}
                        </Text>
                      )}
                      {partnerEnabled && item.isAvailable && canOrder && (
                        <Group gap="xs" mt={6}>
                          {qty > 0 ? (
                            <>
                              <ActionIcon
                                variant="light"
                                color="dark"
                                radius="xl"
                                onClick={() =>
                                  changeQty(
                                    {
                                      masterProductId: item.masterProductId,
                                      name: item.name,
                                      price: item.price,
                                      imageUrl: item.imageUrl,
                                    },
                                    qty - 1,
                                  )
                                }
                              >
                                <Minus size={14} />
                              </ActionIcon>
                              <Text fw={700} size="sm" w={20} ta="center">
                                {qty}
                              </Text>
                              <ActionIcon
                                variant="filled"
                                color="dark"
                                radius="xl"
                                onClick={() =>
                                  changeQty(
                                    {
                                      masterProductId: item.masterProductId,
                                      name: item.name,
                                      price: item.price,
                                      imageUrl: item.imageUrl,
                                    },
                                    Math.min(50, qty + 1),
                                  )
                                }
                              >
                                <Plus size={14} />
                              </ActionIcon>
                            </>
                          ) : (
                            <Button
                              size="xs"
                              variant="light"
                              color="dark"
                              radius="xl"
                              leftSection={<Plus size={13} />}
                              onClick={() =>
                                changeQty(
                                  {
                                    masterProductId: item.masterProductId,
                                    name: item.name,
                                    price: item.price,
                                    imageUrl: item.imageUrl,
                                  },
                                  1,
                                )
                              }
                            >
                              Agregar
                            </Button>
                          )}
                        </Group>
                      )}
                    </Box>
                    {item.imageUrl && (
                      <Image
                        src={item.imageUrl}
                        w={72}
                        h={72}
                        radius="md"
                        fit="cover"
                      />
                    )}
                  </Group>
                </Paper>
              );
            })}
          </Stack>
        ))}

        {/* Contact-flow CTA (non-partner branches keep the hand-off flow). */}
        {!partnerEnabled && catalog && catalog.sections.length > 0 && (
          <Button
            color="dark"
            radius="xl"
            size="md"
            leftSection={<Bike size={16} />}
            disabled={!canOrder}
            onClick={() => navigate(`/app/delivery/${branchId}`)}
          >
            {canOrder ? "Pedir domicilio" : closed ? "Cerrado ahora" : "Fuera de cobertura"}
          </Button>
        )}
      </Stack>

      {/* Sticky cart bar (partner branches). */}
      {partnerEnabled && itemsInCart > 0 && (
        <Paper
          shadow="lg"
          p="md"
          style={{ position: "sticky", bottom: 0, zIndex: 20 }}
          bg="white"
        >
          <Stack gap={6} maw={640} mx="auto">
            {belowMinimum && (
              <Text size="xs" c="orange" ta="center">
                Pedido mínimo: {formatCop(minimumOrder!)} — te faltan{" "}
                {formatCop(minimumOrder! - subtotal)}
              </Text>
            )}
            <Button
              color="dark"
              radius="xl"
              size="md"
              fullWidth
              leftSection={<ShoppingBag size={16} />}
              disabled={!canOrder || belowMinimum}
              onClick={() => navigate(`/app/checkout/${branchId}`)}
            >
              {`Continuar (${itemsInCart}) · ${formatCop(subtotal)}`}
            </Button>
          </Stack>
        </Paper>
      )}
    </>
  );
}

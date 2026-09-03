import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Alert, Button, Divider, Group, Paper, SegmentedControl, Stack, Text, TextInput, Textarea, Title } from "@mantine/core";
import { AlertCircle, ArrowLeft, Bike, Sparkles } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createOrder,
  quoteOrder,
  type OrderPaymentMethod,
} from "@/api/orders";
import { clearDeliveryCart, useDeliveryCart, setCartItemNote } from "@/lib/deliveryCart";
import { useDeliveryPin } from "@/lib/deliveryLocation";
import { formatCop } from "@/lib/orderStatus";
import { DeliveryLocationBar } from "@/components/delivery/DeliveryLocationBar";
import { PageMeta } from "@/components/layout/PageMeta";

type ApiErr = { response?: { data?: { message?: string; code?: string } } };

// Checkout (Phase B): delivery pin + payment method + live server quote
// (Armi validate-distance + delivery-cost with the ally's credentials) →
// pending order awaiting the ally's confirmation. Pay on delivery.
export function CheckoutPage() {
  const { branchId: branchIdParam } = useParams<{ branchId: string }>();
  const branchId = Number(branchIdParam ?? "0");
  const navigate = useNavigate();
  const cart = useDeliveryCart();
  const pin = useDeliveryPin();

  const [paymentMethod, setPaymentMethod] = useState<OrderPaymentMethod>("cash");
  const [details, setDetails] = useState("");
  const [notes, setNotes] = useState("");

  const branchCart = cart && cart.branchId === branchId ? cart : null;

  // No cart for this branch → back to its menu.
  useEffect(() => {
    if (!branchCart) navigate(`/menu/${branchId}`, { replace: true });
  }, [branchCart, branchId, navigate]);

  const items = (branchCart?.items ?? []).map((i) => ({
    masterProductId: i.masterProductId,
    quantity: i.quantity,
    notes: i.notes ?? null,
  }));
  const itemsKey = items.map((i) => `${i.masterProductId}x${i.quantity}`).join(",");

  const quote = useQuery({
    queryKey: ["order-quote", branchId, itemsKey, pin?.lat, pin?.lng, paymentMethod],
    enabled: !!branchCart && !!pin,
    retry: false,
    queryFn: () =>
      quoteOrder({
        branchId,
        items,
        lat: pin!.lat,
        lng: pin!.lng,
        paymentMethod,
      }).then((r) => r.data),
  });

  const place = useMutation({
    mutationFn: () =>
      createOrder({
        branchId,
        items,
        address: {
          address: pin!.address,
          details: details.trim() || null,
          lat: pin!.lat,
          lng: pin!.lng,
        },
        paymentMethod,
        notes: notes.trim() || null,
      }).then((r) => r.data),
    onSuccess: (data) => {
      clearDeliveryCart();
      toast.success("¡Pedido enviado! Te avisamos cuando el restaurante confirme.");
      navigate(`/app/orders/${data.order.deliveryOrderId}`, { replace: true });
    },
    onError: (e: ApiErr) => {
      toast.error(e.response?.data?.message ?? "No pudimos crear el pedido.");
      quote.refetch();
    },
  });

  if (!branchCart) return null;

  const quoteError = quote.error as ApiErr | null;
  const quoteErrorMsg = quoteError?.response?.data?.message;
  const q = quote.data;

  return (
    <>
      <PageMeta
        title="Confirmar pedido"
        description="Confirma tu pedido a domicilio."
        path={`/app/checkout/${branchId}`}
      />
      <Stack gap="lg" py="lg" maw={560} mx="auto" px="md">
        <Button
          variant="subtle"
          color="dark"
          size="xs"
          leftSection={<ArrowLeft size={14} />}
          component={Link}
          to={`/menu/${branchId}`}
          style={{ alignSelf: "flex-start" }}
        >
          Volver al menú
        </Button>

        <Title order={2} style={{ fontFamily: '"Clash Grotesk", sans-serif' }}>
          Tu pedido en {branchCart.branchName}
        </Title>

        {/* Items */}
        <Paper withBorder radius="lg" p="md">
          <Stack gap={6}>
            {branchCart.items.map((item) => (
              <Stack key={item.masterProductId} gap={4}>
                <Group justify="space-between">
                  <Text size="sm">
                    {item.quantity}× {item.name}
                  </Text>
                  <Text size="sm" fw={600}>
                    {formatCop(item.price * item.quantity)}
                  </Text>
                </Group>
                <TextInput
                  size="xs"
                  placeholder="Observación (ej. sin queso, sin salsas)"
                  maxLength={200}
                  value={item.notes ?? ""}
                  onChange={(e) =>
                    setCartItemNote(item.masterProductId, e.currentTarget.value)
                  }
                />
              </Stack>
            ))}
            <Button
              variant="subtle"
              color="dark"
              size="xs"
              component={Link}
              to={`/menu/${branchId}`}
              style={{ alignSelf: "flex-start" }}
            >
              Editar pedido
            </Button>
          </Stack>
        </Paper>

        {/* Delivery location */}
        <Stack gap="xs">
          <Text fw={600} size="sm">
            ¿Dónde te lo llevamos?
          </Text>
          <DeliveryLocationBar />
          {!pin && (
            <Text size="xs" c="orange">
              Elige la ubicación de entrega para cotizar el envío.
            </Text>
          )}
          <TextInput
            label="Detalles de la dirección"
            placeholder="Apto, torre, indicaciones para el mensajero"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
          />
          <Textarea
            label="Notas para el restaurante"
            placeholder="Ej: sin cebolla"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </Stack>

        {/* Payment (on delivery) */}
        <Stack gap="xs">
          <Text fw={600} size="sm">
            ¿Cómo pagas al recibir?
          </Text>
          <SegmentedControl
            value={paymentMethod}
            onChange={(v) => setPaymentMethod(v as OrderPaymentMethod)}
            data={[
              { value: "cash", label: "Efectivo" },
              { value: "card_terminal", label: "Datáfono" },
            ]}
          />
        </Stack>

        {/* Quote */}
        {quoteErrorMsg && (
          <Alert icon={<AlertCircle size={16} />} color="red" variant="light">
            {quoteErrorMsg}
          </Alert>
        )}
        {q && (
          <Paper withBorder radius="lg" p="md">
            <Stack gap={6}>
              <Group justify="space-between">
                <Text size="sm">Subtotal</Text>
                <Text size="sm">{formatCop(q.subtotal)}</Text>
              </Group>
              {q.discountAmount > 0 && (
                <Group justify="space-between">
                  <Text size="sm" c="green">
                    Descuento Weincard {q.discountPct}%
                  </Text>
                  <Text size="sm" c="green">
                    -{formatCop(q.discountAmount)}
                  </Text>
                </Group>
              )}
              <Group justify="space-between">
                <Text size="sm">Costo de envío</Text>
                <Text size="sm">{formatCop(q.deliveryFee)}</Text>
              </Group>
              <Divider my={4} />
              <Group justify="space-between">
                <Text fw={700}>Total al recibir</Text>
                <Text fw={700}>{formatCop(q.total)}</Text>
              </Group>
              {!q.hadActiveMembership && (
                <Group gap={6}>
                  <Sparkles size={13} />
                  <Text size="xs" c="dimmed">
                    Con la membresía Weincard este pedido tendría descuento.{" "}
                    <Link to="/planes">Conócela</Link>
                  </Text>
                </Group>
              )}
              {q.usageLimitReached && (
                <Text size="xs" c="dimmed">
                  Ya usaste el descuento disponible de esta oferta por ahora.
                </Text>
              )}
            </Stack>
          </Paper>
        )}

        <Button
          color="dark"
          radius="xl"
          size="md"
          leftSection={<Bike size={16} />}
          loading={place.isPending || quote.isFetching}
          disabled={!pin || !q || !!quoteErrorMsg}
          onClick={() => place.mutate()}
        >
          Realizar pedido
        </Button>
        <Text size="xs" c="dimmed" ta="center">
          El restaurante confirma tu pedido y un mensajero de Armi lo lleva.
          Pagas al recibir.
        </Text>
      </Stack>
    </>
  );
}

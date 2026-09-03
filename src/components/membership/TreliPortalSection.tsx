import { Button, Stack, Text } from "@mantine/core";
import { CreditCard } from "lucide-react";
import { toast } from "sonner";
import { useCreatePortalSession } from "@/hooks/useMembership";

/**
 * "Gestionar método de pago" — opens the Treli customer portal in a new tab.
 * Treli has no update-payment-method API, so the hosted portal is the only
 * place a member can change the card behind their subscription. Render only
 * when `user.hasTreliCustomer` is true (the portal is scoped to that customer).
 */
export function TreliPortalSection() {
  const portalMutation = useCreatePortalSession();

  async function openPortal() {
    try {
      const data = await portalMutation.mutateAsync();
      if (!data?.url) throw new Error("No se recibió URL del portal.");
      // Same pattern as checkout: keep the Weincard app open in this tab.
      window.open(data.url, "_blank", "noopener,noreferrer");
    } catch (err: unknown) {
      const res = (err as { response?: { data?: { code?: string; message?: string } } })
        ?.response?.data;
      toast.error(
        res?.code === "no_treli_customer"
          ? "Aún no tienes un método de pago registrado."
          : (res?.message ?? "No se pudo abrir el portal de pagos."),
      );
    }
  }

  return (
    <Stack gap="xs" align="flex-start">
      <Text fw={700} size="sm">
        Método de pago
      </Text>
      <Text size="xs" c="dimmed">
        Actualiza la tarjeta o el medio de pago de tu suscripción desde el
        portal de Treli, nuestro procesador de pagos. Se abre en una pestaña
        nueva.
      </Text>
      <Button
        variant="light"
        color="dark"
        size="xs"
        leftSection={<CreditCard size={14} />}
        onClick={openPortal}
        loading={portalMutation.isPending}
      >
        Gestionar método de pago
      </Button>
    </Stack>
  );
}

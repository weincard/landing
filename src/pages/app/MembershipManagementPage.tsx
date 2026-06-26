import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Stack,
  Title,
  Text,
  Paper,
  Group,
  Button,
  Badge,
  Alert,
  Progress,
  TextInput,
  Divider,
  SimpleGrid,
  Loader,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { toast } from "sonner";
import { AlertCircle, CheckCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
  useMembershipPlans,
  useCancelMembership,
  useCreateCheckout,
  useRedeemCoupon,
} from "@/hooks/useMembership";
import { MembershipStatusBadge } from "@/components/membership/MembershipStatusBadge";
import { PageMeta } from "@/components/layout/PageMeta";
import { useShowCouponInput } from "@/hooks/useAppConfig";
import { useEmailVerificationGate } from "@/hooks/useEmailVerificationGate";
import type { PlanKey } from "@/types";

const PLAN_DESCRIPTIONS: Record<string, string> = {
  monthly:
    "Accede a descuentos y beneficios exclusivos mes a mes. Cancela cuando quieras.",
  yearly:
    "El mejor precio para quienes salen seguido. Dos meses gratis frente al plan mensual.",
  quarterly: "Tres meses de beneficios exclusivos con un precio especial.",
};

function formatDate(dateStr: string | null) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("es-CO", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function MembershipManagementPage() {
  const navigate = useNavigate();
  const {
    user,
    membership,
    membershipActiveUntil,
    hasMembership,
    refreshMembership,
  } = useAuth();
  const showCouponInput = useShowCouponInput();
  const gate = useEmailVerificationGate();
  const { data: plans = [], isLoading: loadingPlans } = useMembershipPlans();
  const cancelMutation = useCancelMembership();
  const checkoutMutation = useCreateCheckout();
  const redeemMutation = useRedeemCoupon();

  const [checkoutInitiated, setCheckoutInitiated] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [pendingEmail, setPendingEmail] = useState("");
  const [emailNeeded, setEmailNeeded] = useState<PlanKey | null>(null);

  // Poll for membership activation after checkout
  useEffect(() => {
    if (!checkoutInitiated || membership?.status === "active") return;

    const interval = setInterval(() => {
      refreshMembership();
    }, 4000);

    const timeout = setTimeout(() => clearInterval(interval), 180000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [checkoutInitiated, membership?.status, refreshMembership]);

  useEffect(() => {
    if (checkoutInitiated && membership?.status === "active") {
      toast.success("¡Membresía activada! Bienvenido a Weincard.");
      setCheckoutInitiated(false);
    }
  }, [membership?.status, checkoutInitiated]);

  async function startCheckout(planKey: PlanKey, email: string) {
    // Treli checkout requires a verified email — gate opens the verify modal
    // (resuming into checkout) and we stop here when it does.
    if (gate(planKey)) {
      setEmailNeeded(null);
      return;
    }
    try {
      const data = await checkoutMutation.mutateAsync({ email, plan: planKey });
      if (data?.url) {
        window.open(data.url, "_blank", "noopener,noreferrer");
        setCheckoutInitiated(true);
        setEmailNeeded(null);
      } else {
        throw new Error("No se recibió URL de pago.");
      }
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })
        ?.response?.data?.message;
      toast.error(msg ?? "No se pudo iniciar el pago.");
    }
  }

  async function handleSelectPlan(planKey: PlanKey) {
    if (!user?.email) {
      setEmailNeeded(planKey);
      return;
    }
    await startCheckout(planKey, user.email);
  }

  async function handleRedeemCoupon() {
    if (!couponCode.trim()) return;
    try {
      await redeemMutation.mutateAsync(couponCode);
      toast.success("¡Código activado! Tu prueba gratuita está lista.");
      setCouponCode("");
      navigate("/app/card");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })
        ?.response?.data?.message;
      toast.error(msg ?? "Código inválido o ya utilizado.");
    }
  }

  function handleCancel() {
    if (!membership) return;
    modals.openConfirmModal({
      title: "¿Cancelar membresía?",
      children: (
        <Text size="sm">
          Tu acceso continúa hasta el {formatDate(membershipActiveUntil)}. No se
          realizarán más cobros.
        </Text>
      ),
      labels: { confirm: "Sí, cancelar", cancel: "Mantener membresía" },
      confirmProps: { color: "red" },
      onConfirm: async () => {
        try {
          await cancelMutation.mutateAsync(membership.membershipId);
          toast.info(
            `Membresía cancelada. Tienes acceso hasta el ${formatDate(membershipActiveUntil)}.`,
          );
        } catch {
          toast.error("No se pudo cancelar. Intenta de nuevo.");
        }
      },
    });
  }

  return (
    <>
      <PageMeta
        title="Membresía"
        description="Gestiona tu membresía Weincard."
        path="/app/membership"
      />
      <Stack gap="xl" maw={700} mx="auto" py="lg">
        <Title order={2} style={{ fontFamily: '"Clash Grotesk", sans-serif' }}>
          Membresía
        </Title>

        {/* Active membership status card */}
        {hasMembership && membership && (
          <Paper radius="xl" p="xl" withBorder>
            <Group justify="space-between" align="flex-start" mb="md">
              <Stack gap={4}>
                <Text
                  fw={700}
                  size="lg"
                  style={{ fontFamily: '"Clash Grotesk", sans-serif' }}
                >
                  {membership.membershipPlanName}
                </Text>
                <MembershipStatusBadge status={membership.status} />
              </Stack>
            </Group>

            {membershipActiveUntil && (
              <Text size="sm" c="dimmed">
                Válido hasta{" "}
                <Text span fw={700} c="dark">
                  {formatDate(membershipActiveUntil)}
                </Text>
              </Text>
            )}

            {/* Polling progress */}
            {checkoutInitiated && membership.status !== "active" && (
              <Alert
                mt="md"
                icon={<Loader size={16} />}
                title="Verificando pago..."
                color="blue"
                variant="light"
              >
                Estamos confirmando tu pago. Puede tardar unos segundos.
                <Progress mt="sm" size="xs" value={100} animated color="blue" />
              </Alert>
            )}

            <Divider my="md" />

            {membership.status === "active" && (
              <Button
                variant="subtle"
                color="red"
                size="xs"
                onClick={handleCancel}
                loading={cancelMutation.isPending}
              >
                Cancelar suscripción
              </Button>
            )}
            {membership.status === "pending_cancel" && (
              <Alert
                icon={<AlertCircle size={16} />}
                color="yellow"
                variant="light"
              >
                Tu membresía está en cancelación. Conservas el acceso hasta el{" "}
                {formatDate(membershipActiveUntil)}.
              </Alert>
            )}
          </Paper>
        )}

        {/* Post-checkout activation confirmation */}
        {checkoutInitiated && !hasMembership && (
          <Alert
            icon={<Loader size={16} />}
            title="Verificando pago..."
            color="blue"
            variant="light"
          >
            Estamos confirmando tu pago. Puede tardar unos segundos.
            <Progress mt="sm" size="xs" value={100} animated color="blue" />
          </Alert>
        )}

        {!hasMembership && (
          <>
            {/* Plan cards */}
            {loadingPlans ? (
              <SimpleGrid cols={{ base: 1, sm: 2 }}>
                {Array.from({ length: 2 }).map((_, i) => (
                  <Paper
                    key={i}
                    radius="xl"
                    p="xl"
                    withBorder
                    style={{ height: 200 }}
                  />
                ))}
              </SimpleGrid>
            ) : (
              <SimpleGrid cols={{ base: 1, sm: 2 }}>
                {plans.map((plan) => {
                  const planKey = plan.duration as PlanKey;
                  return (
                    <Paper
                      key={plan.membershipPlanId}
                      radius="xl"
                      p="xl"
                      withBorder
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 16,
                        background:
                          plan.duration === "yearly"
                            ? "linear-gradient(135deg, #1B1A1A 0%, #2d2c2c 100%)"
                            : undefined,
                        color: plan.duration === "yearly" ? "#fff" : undefined,
                        borderColor:
                          plan.duration === "yearly"
                            ? "transparent"
                            : undefined,
                      }}
                    >
                      {plan.duration === "yearly" && (
                        <Badge
                          color="red"
                          variant="filled"
                          size="sm"
                          radius="xl"
                        >
                          RECOMENDADO
                        </Badge>
                      )}
                      <Stack gap={4}>
                        <Text
                          fw={900}
                          size="xl"
                          style={{ fontFamily: '"Clash Grotesk", sans-serif' }}
                        >
                          {plan.name}
                        </Text>
                        <Text fw={700} size="lg">
                          ${plan.price.toLocaleString("es-CO")} COP
                        </Text>
                        <Text
                          size="xs"
                          style={{
                            opacity: 0.6,
                            fontFamily: '"Hepta Slab", serif',
                          }}
                        >
                          {plan.duration === "monthly"
                            ? "por mes"
                            : plan.duration === "yearly"
                              ? "por año"
                              : "por periodo"}
                        </Text>
                      </Stack>
                      <Text
                        size="sm"
                        style={{
                          flex: 1,
                          opacity: 0.8,
                          fontFamily: '"Hepta Slab", serif',
                          lineHeight: 1.6,
                        }}
                      >
                        {PLAN_DESCRIPTIONS[plan.duration] ?? plan.description}
                      </Text>
                      <Button
                        onClick={() => handleSelectPlan(planKey)}
                        loading={checkoutMutation.isPending}
                        color={plan.duration === "yearly" ? "white" : "dark"}
                        variant={
                          plan.duration === "yearly" ? "white" : "filled"
                        }
                        fullWidth
                      >
                        Suscribirme
                      </Button>
                    </Paper>
                  );
                })}
              </SimpleGrid>
            )}

            {/* Email capture */}
            {emailNeeded && (
              <Paper
                radius="xl"
                p="xl"
                withBorder
                style={{ background: "#fffbeb", borderColor: "#fde68a" }}
              >
                <Text fw={700} size="sm" mb="xs">
                  Necesitamos tu correo electrónico
                </Text>
                <Text size="xs" c="dimmed" mb="md">
                  Para procesar el pago necesitamos un correo.
                </Text>
                <Group gap="sm">
                  <TextInput
                    flex={1}
                    type="email"
                    placeholder="tu@correo.com"
                    value={pendingEmail}
                    onChange={(e) => setPendingEmail(e.currentTarget.value)}
                  />
                  <Button
                    onClick={() => startCheckout(emailNeeded, pendingEmail)}
                    disabled={!pendingEmail.trim()}
                    loading={checkoutMutation.isPending}
                    color="dark"
                  >
                    Continuar
                  </Button>
                  <Button
                    variant="subtle"
                    color="gray"
                    onClick={() => setEmailNeeded(null)}
                  >
                    Cancelar
                  </Button>
                </Group>
              </Paper>
            )}

            {/* Coupon redemption — gated by the showCouponInput app_config flag */}
            {showCouponInput && (
              <>
                <Divider label="¿Tienes un código?" labelPosition="center" />
                <Paper radius="xl" p="lg" withBorder>
                  <Text fw={700} size="sm" mb="xs">
                    Activar código de prueba
                  </Text>
                  <Group gap="sm">
                    <TextInput
                      flex={1}
                      placeholder="CÓDIGO"
                      value={couponCode}
                      onChange={(e) =>
                        setCouponCode(e.currentTarget.value.toUpperCase())
                      }
                      style={{ textTransform: "uppercase" }}
                    />
                    <Button
                      onClick={handleRedeemCoupon}
                      disabled={!couponCode.trim()}
                      loading={redeemMutation.isPending}
                      color="dark"
                      leftSection={<CheckCircle size={14} />}
                    >
                      Activar
                    </Button>
                  </Group>
                </Paper>
              </>
            )}
          </>
        )}
      </Stack>
    </>
  );
}

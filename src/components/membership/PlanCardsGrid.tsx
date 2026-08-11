import { Badge, Button, Paper, SimpleGrid, Stack, Text } from "@mantine/core";
import type { MembershipPlan, PlanKey } from "@/types";

// Marketing copy per checkout key — DB descriptions are internal-facing, so the
// cards prefer these and fall back to plan.description for unknown keys.
const PLAN_DESCRIPTIONS: Record<string, string> = {
  monthly:
    "Accede a descuentos y beneficios exclusivos mes a mes. Cancela cuando quieras.",
  yearly:
    "El mejor precio para quienes salen seguido. Dos meses gratis frente al plan mensual.",
  quarterly: "Tres meses de beneficios exclusivos con un precio especial.",
  family_monthly:
    "Un solo pago mensual cubre al titular y hasta 3 beneficiarios. Invítalos por su celular.",
  family_yearly:
    "Un solo pago anual cubre al titular y hasta 3 beneficiarios. El mejor precio por persona.",
  duo_monthly:
    "Un solo pago mensual para dos: tú y la persona que elijas. Invítala por su celular.",
  duo_yearly:
    "Un solo pago anual para dos: tú y la persona que elijas. El mejor precio por pareja.",
};

/** Checkout key for a plan. The DB stores durations UPPERCASE — normalize
 *  before any comparison. Shared plans get a prefix: `duo_` when they carry
 *  exactly 1 beneficiary seat, `family_` otherwise. */
function planKeyFor(plan: MembershipPlan): PlanKey {
  const dur = plan.duration.toLowerCase();
  if (plan.maxBeneficiaries == null) return dur as PlanKey;
  return (
    plan.maxBeneficiaries === 1 ? `duo_${dur}` : `family_${dur}`
  ) as PlanKey;
}

interface PlanCardsGridProps {
  plans: MembershipPlan[];
  loading?: boolean;
  onSelect: (planKey: PlanKey) => void;
  /** Checkout request in flight — shows the button spinner. */
  pending?: boolean;
  /** Disables every card's CTA (e.g. the user already has a membership). */
  disabled?: boolean;
  /** Plan the user currently holds — its CTA becomes "Plan actual". */
  activePlanKey?: string | null;
}

/** Shared plan cards for /planes and /app/membership — single source of the
 *  pricing UI so the two pages can't drift apart visually. */
export function PlanCardsGrid({
  plans,
  loading = false,
  onSelect,
  pending = false,
  disabled = false,
  activePlanKey = null,
}: PlanCardsGridProps) {
  // Family plans with price <= 0 aren't sellable yet (rollout guard) — hide
  // them until real prices are configured in the DB.
  const visiblePlans = plans.filter(
    (p) => p.maxBeneficiaries == null || Number(p.price) > 0,
  );

  if (loading) {
    return (
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
    );
  }

  return (
    <SimpleGrid cols={{ base: 1, sm: 2 }}>
      {visiblePlans.map((plan) => {
        const dur = plan.duration.toLowerCase();
        const isFamily = plan.maxBeneficiaries != null;
        const planKey = planKeyFor(plan);
        const isCurrent = activePlanKey === planKey;
        return (
          <Paper
            key={plan.membershipPlanId}
            radius="xl"
            p="xl"
            withBorder
            style={{ display: "flex", flexDirection: "column", gap: 16 }}
          >
            {/* {dur === "yearly" && !isFamily && (
              <Badge color="red" variant="filled" size="sm" radius="xl">
                RECOMENDADO
              </Badge>
            )} */}
            {isFamily && (
              <Badge color="dark" variant="light" size="sm" radius="xl">
                {plan.maxBeneficiaries === 1
                  ? "PARA DOS"
                  : `TÚ + ${plan.maxBeneficiaries} BENEFICIARIOS`}
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
                {/* price arrives as a Postgres numeric string ("19900.000") —
                    Number() first or toLocaleString is a no-op */}
                $
                {Number(plan.price).toLocaleString("es-CO", {
                  maximumFractionDigits: 0,
                })}{" "}
                COP
              </Text>
              <Text
                size="xs"
                style={{ opacity: 0.6, fontFamily: '"Hepta Slab", serif' }}
              >
                {dur === "monthly"
                  ? "por mes"
                  : dur === "yearly"
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
              {PLAN_DESCRIPTIONS[planKey] ?? plan.description}
            </Text>
            <Button
              onClick={() => onSelect(planKey)}
              loading={pending}
              disabled={disabled || isCurrent}
              color="dark"
              fullWidth
            >
              {isCurrent ? "Plan actual" : "Suscribirme"}
            </Button>
          </Paper>
        );
      })}
    </SimpleGrid>
  );
}

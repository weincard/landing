import {
  Stack,
  Title,
  Text,
  Paper,
  Group,
  Badge,
  Skeleton,
  Center,
  Progress,
  Button,
  ThemeIcon,
} from "@mantine/core";
import { Link } from "react-router-dom";
import { Stamp, Gift, Check, Lock } from "lucide-react";
import { useMilestoneMe } from "@/hooks/useLoyalty";
import type { LoyaltyMilestoneRung } from "@/api/loyalty";
import { PageMeta } from "@/components/layout/PageMeta";

const ACCENT = "#14B8A6"; // teal — the "sellos" (punch-card) accent

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("es-CO", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function MilestonePage() {
  const { data, isLoading } = useMilestoneMe();
  const milestones = data?.milestones ?? [];
  const topThreshold = milestones.reduce((max, m) => Math.max(max, m.threshold), 0);
  const current = data?.currentUses ?? 0;
  const pct = topThreshold > 0 ? Math.min(100, (current / topThreshold) * 100) : 0;

  return (
    <>
      <PageMeta
        title="Tarjeta de sellos"
        description="Suma usos y gana premios en cada hito con Weincard."
        path="/app/loyalty/milestones"
      />
      <Stack gap="xl" maw={640} mx="auto" py="lg">
        <Group gap="xs">
          <Stamp size={26} />
          <Title order={2} style={{ fontFamily: '"Clash Grotesk", sans-serif' }}>
            Tarjeta de sellos
          </Title>
        </Group>

        {isLoading ? (
          <Skeleton height={160} radius="xl" />
        ) : !data?.season ? (
          <Paper radius="xl" p="xl" withBorder>
            <Center>
              <Stack align="center" gap="xs">
                <Stamp size={40} color="#B8BCC4" />
                <Text fw={600}>No hay tarjeta activa</Text>
                <Text size="sm" c="dimmed" ta="center">
                  Cuando empiece una nueva tarjeta de sellos, cada canje que hagas sumará para
                  desbloquear premios en restaurantes aliados.
                </Text>
              </Stack>
            </Center>
          </Paper>
        ) : (
          <>
            {/* Hero: my progress */}
            <Paper
              radius="xl"
              p="xl"
              style={{ background: "#1B1A1A", color: "#fff", textAlign: "center" }}
            >
              <Text size="xs" fw={700} tt="uppercase" style={{ letterSpacing: 1, opacity: 0.7 }}>
                {data.season.name}
              </Text>
              <Text style={{ fontSize: 48, fontWeight: 800, lineHeight: 1.1 }}>{current}</Text>
              <Text size="sm" style={{ opacity: 0.85 }}>
                {current === 1 ? "uso" : "usos"} en esta tarjeta
              </Text>
              <Progress
                value={pct}
                mt="md"
                radius="xl"
                size="lg"
                color="teal"
                style={{ background: "rgba(255,255,255,0.15)" }}
              />
              {data.usesToNext != null && data.nextThreshold != null ? (
                <Text size="sm" mt="sm" style={{ opacity: 0.85 }}>
                  Te {data.usesToNext === 1 ? "falta" : "faltan"} {data.usesToNext}{" "}
                  {data.usesToNext === 1 ? "uso" : "usos"} para el próximo premio ({data.nextThreshold}{" "}
                  usos).
                </Text>
              ) : (
                <Text size="sm" mt="sm" style={{ opacity: 0.85 }}>
                  ¡Completaste todos los hitos de esta tarjeta! 🎉
                </Text>
              )}
              <Text size="xs" mt="md" style={{ opacity: 0.6 }}>
                Termina el {formatDate(data.season.endsAt)}
              </Text>
            </Paper>

            {/* Ladder */}
            <Stack gap="sm">
              <Text fw={600}>Tus hitos</Text>
              {milestones.length === 0 ? (
                <Text size="sm" c="dimmed">
                  Esta tarjeta aún no tiene hitos configurados.
                </Text>
              ) : (
                milestones.map((m) => <RungCard key={m.milestoneId} rung={m} current={current} />)
              )}
            </Stack>

            <Button
              component={Link}
              to="/app/gifts"
              variant="light"
              leftSection={<Gift size={16} />}
              radius="xl"
            >
              Ver mis premios
            </Button>
          </>
        )}
      </Stack>
    </>
  );
}

function RungCard({ rung, current }: { rung: LoyaltyMilestoneRung; current: number }) {
  const reached = rung.reached;
  // A reached rung is claimable until the user picks an option (pending_selection);
  // once claimable/redeemed it lives on the Gifts page.
  const needsSelection = reached && rung.giftStatus === "pending_selection";
  const remaining = Math.max(0, rung.threshold - current);

  return (
    <Paper
      withBorder
      radius="lg"
      p="md"
      style={{ opacity: reached ? 1 : 0.75, borderColor: reached ? ACCENT : undefined }}
    >
      <Group justify="space-between" wrap="nowrap" align="flex-start">
        <Group gap="sm" wrap="nowrap" align="flex-start">
          <ThemeIcon
            radius="xl"
            size={38}
            variant={reached ? "filled" : "light"}
            color={reached ? "teal" : "gray"}
          >
            {reached ? <Check size={20} /> : <Lock size={18} />}
          </ThemeIcon>
          <div style={{ minWidth: 0 }}>
            <Group gap="xs">
              <Text fw={700}>{rung.label}</Text>
              <Badge variant="light" color={reached ? "teal" : "gray"}>
                {rung.threshold} usos
              </Badge>
            </Group>
            {rung.options.length > 0 ? (
              <Text size="sm" c="dimmed">
                {rung.options.map((o) => o.label).join(" · ")}
              </Text>
            ) : (
              <Text size="sm" c="dimmed">
                Premio por definir
              </Text>
            )}
            {!reached && (
              <Text size="xs" c="dimmed" mt={4}>
                Te {remaining === 1 ? "falta" : "faltan"} {remaining} {remaining === 1 ? "uso" : "usos"}
              </Text>
            )}
          </div>
        </Group>
        {needsSelection && (
          <Button component={Link} to="/app/gifts" size="xs" radius="xl" color="teal">
            Reclamar
          </Button>
        )}
      </Group>
    </Paper>
  );
}

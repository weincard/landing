import {
  Stack,
  Title,
  Text,
  Paper,
  Group,
  Badge,
  Skeleton,
  Center,
  ActionIcon,
} from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { Trophy, ArrowLeft } from "lucide-react";
import { useSeasonPrizes } from "@/hooks/useLoyalty";
import type { LoyaltyTierPrizes } from "@/api/loyalty";
import { PageMeta } from "@/components/layout/PageMeta";

const TIER_COLOR: Record<string, string> = {
  Diamante: "#1CD9EB",
  Oro: "#F89E0A",
  Plata: "#B8BCC4",
  Bronce: "#C77B3B",
};

export function PrizesPage() {
  const { data, isLoading } = useSeasonPrizes();
  const navigate = useNavigate();
  const tiers = data?.tiers ?? [];

  return (
    <>
      <PageMeta
        title="Premios disponibles"
        description="Premios por nivel de la temporada de fidelidad Weincard."
        path="/app/loyalty/prizes"
      />
      <Stack gap="lg" maw={640} mx="auto" py="lg">
        <Group gap="xs">
          <ActionIcon
            variant="subtle"
            color="gray"
            aria-label="Volver a clasificación"
            onClick={() => navigate("/app/loyalty")}
          >
            <ArrowLeft size={20} />
          </ActionIcon>
          <Trophy size={26} />
          <Title order={2} style={{ fontFamily: '"Clash Grotesk", sans-serif' }}>
            Premios disponibles
          </Title>
        </Group>

        <Text c="dimmed" size="sm">
          Estos son los premios que puede elegir el ganador de cada nivel al terminar la
          temporada.
        </Text>

        {isLoading ? (
          <Skeleton height={160} radius="xl" />
        ) : tiers.length === 0 ? (
          <Paper radius="xl" p="xl" withBorder>
            <Center>
              <Stack align="center" gap="xs">
                <Trophy size={40} color="#B8BCC4" />
                <Text fw={600}>No hay premios disponibles</Text>
                <Text size="sm" c="dimmed" ta="center">
                  Cuando haya una temporada activa con premios configurados, aparecerán aquí.
                </Text>
              </Stack>
            </Center>
          </Paper>
        ) : (
          tiers.map((t) => <TierSection key={t.tierId} tier={t} />)
        )}
      </Stack>
    </>
  );
}

function TierSection({ tier }: { tier: LoyaltyTierPrizes }) {
  const color = TIER_COLOR[tier.name] ?? "#9F82FF";
  return (
    <Stack gap="xs">
      <Group
        justify="space-between"
        p="xs"
        style={{ background: `${color}24`, borderRadius: 12 }}
      >
        <Group gap="xs">
          <Badge
            variant="filled"
            style={{ backgroundColor: color, color: "#1B1A1A" }}
          >
            {tier.name}
          </Badge>
        </Group>
        <Text size="sm" c="dimmed">
          {tier.capacity} ganadores
        </Text>
      </Group>

      {tier.options.length === 0 ? (
        <Text size="sm" c="dimmed" pl={4}>
          Aún no hay premios definidos para este nivel.
        </Text>
      ) : (
        tier.options.map((o) => (
          <Paper key={o.optionId} withBorder radius="lg" p="md">
            <Text fw={600}>{o.label}</Text>
            {o.description && (
              <Text size="sm" c="dimmed">
                {o.description}
              </Text>
            )}
            {o.merchants.length > 0 && (
              <Group gap={6} mt="xs">
                {o.merchants.map((m) => (
                  <Badge key={m.merchantId} size="sm" variant="outline">
                    {m.name}
                  </Badge>
                ))}
              </Group>
            )}
          </Paper>
        ))
      )}
    </Stack>
  );
}

import {
  Stack,
  Title,
  Text,
  Paper,
  Group,
  Badge,
  Skeleton,
  Center,
  SimpleGrid,
  Button,
} from "@mantine/core";
import { Trophy, Gift, Award } from "lucide-react";
import { Link } from "react-router-dom";
import { useMyRank } from "@/hooks/useLoyalty";
import { PageMeta } from "@/components/layout/PageMeta";

const TIER_COLOR: Record<string, string> = {
  Diamante: "#1CD9EB",
  Oro: "#F89E0A",
  Plata: "#B8BCC4",
  Bronce: "#C77B3B",
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("es-CO", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function LoyaltyPage() {
  const { data, isLoading } = useMyRank();

  return (
    <>
      <PageMeta
        title="Clasificación"
        description="Tu posición en la temporada de fidelidad Weincard."
        path="/app/loyalty"
      />
      <Stack gap="xl" maw={640} mx="auto" py="lg">
        <Group gap="xs">
          <Trophy size={26} />
          <Title order={2} style={{ fontFamily: '"Clash Grotesk", sans-serif' }}>
            Clasificación
          </Title>
        </Group>

        {isLoading ? (
          <Skeleton height={160} radius="xl" />
        ) : !data?.season ? (
          <Paper radius="xl" p="xl" withBorder>
            <Center>
              <Stack align="center" gap="xs">
                <Trophy size={40} color="#B8BCC4" />
                <Text fw={600}>No hay temporada activa</Text>
                <Text size="sm" c="dimmed" ta="center">
                  Cuando empiece una nueva temporada, cada canje que hagas sumará para escalar en la
                  tabla y ganar premios en restaurantes aliados.
                </Text>
              </Stack>
            </Center>
          </Paper>
        ) : (
          <>
            {/* Hero: my standing */}
            <Paper
              radius="xl"
              p="xl"
              style={{ background: "#1B1A1A", color: "#fff", textAlign: "center" }}
            >
              <Text size="xs" fw={700} tt="uppercase" style={{ letterSpacing: 1, opacity: 0.7 }}>
                {data.season.name}
              </Text>
              {data.ranked ? (
                <>
                  <Text style={{ fontSize: 48, fontWeight: 800, lineHeight: 1.1 }}>
                    #{data.rank}
                  </Text>
                  <Group justify="center" gap="xs" mt={4}>
                    <Text size="sm" style={{ opacity: 0.85 }}>
                      {data.redemptionCount} canjes
                    </Text>
                    {data.tierName && (
                      <Badge
                        variant="filled"
                        style={{ backgroundColor: TIER_COLOR[data.tierName] ?? "#9F82FF", color: "#1B1A1A" }}
                      >
                        {data.tierName}
                      </Badge>
                    )}
                    {!data.tierName && (
                      <Badge variant="outline" color="gray">
                        Fuera de premios
                      </Badge>
                    )}
                  </Group>
                </>
              ) : (
                <Stack gap={4} mt="sm">
                  <Text fw={600}>Aún no estás en la tabla</Text>
                  <Text size="sm" style={{ opacity: 0.8 }}>
                    Haz tu primer canje para entrar en la clasificación.
                  </Text>
                </Stack>
              )}
              <Text size="xs" mt="md" style={{ opacity: 0.6 }}>
                Termina el {formatDate(data.season.endsAt)}
              </Text>
            </Paper>

            {/* Tier cutoffs */}
            <div>
              <Text fw={600} mb="xs">
                Niveles de esta temporada
              </Text>
              <SimpleGrid cols={{ base: 2, sm: 4 }}>
                {(data.tiers ?? []).map((t) => (
                  <Paper key={t.tierId} withBorder radius="lg" p="md">
                    <Badge
                      variant="filled"
                      mb="xs"
                      style={{ backgroundColor: TIER_COLOR[t.name] ?? "#9F82FF", color: "#1B1A1A" }}
                    >
                      {t.name}
                    </Badge>
                    <Text size="xs" c="dimmed">
                      {t.capacity} {t.capacity === 1 ? "persona" : "personas"}
                    </Text>
                  </Paper>
                ))}
              </SimpleGrid>
              <Text size="xs" c="dimmed" mt="sm">
                Los cupos se llenan de arriba hacia abajo. En empate, gana quien llegó primero a ese
                número de canjes.
              </Text>
            </div>

            <Button
              component={Link}
              to="/app/loyalty/prizes"
              variant="outline"
              leftSection={<Award size={16} />}
              radius="xl"
            >
              Ver premios disponibles
            </Button>
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

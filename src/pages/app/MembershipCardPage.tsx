import { Link } from "react-router-dom";
import {
  Stack,
  Title,
  Text,
  Paper,
  Group,
  Button,
  Skeleton,
  SimpleGrid,
  Center,
  Box,
} from "@mantine/core";
import { CreditCard } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useMyRedemptions } from "@/hooks/useRedemptions";
import { MembershipCard } from "@/components/membership/MembershipCard";
import { PageMeta } from "@/components/layout/PageMeta";

function StatPill({ label, value }: { label: string; value: string }) {
  return (
    <Paper radius="xl" px="lg" py="sm" withBorder style={{ textAlign: "center" }}>
      <Text size="xs" c="dimmed" fw={700} tt="uppercase" style={{ letterSpacing: "0.08em" }}>
        {label}
      </Text>
      <Text fw={900} size="lg" style={{ fontFamily: '"Clash Grotesk", sans-serif' }}>
        {value}
      </Text>
    </Paper>
  );
}

export function MembershipCardPage() {
  const { user, membership, membershipActiveUntil, hasMembership } = useAuth();
  const { data: redemptions = [], isLoading: loadingRedemptions } = useMyRedemptions();

  const totalSavings = redemptions.reduce((sum, r) => sum + (r.discountAmount ?? 0), 0);
  const daysLeft = membershipActiveUntil
    ? Math.max(0, Math.ceil((new Date(membershipActiveUntil).getTime() - Date.now()) / 86400000))
    : null;

  return (
    <>
      <PageMeta title="Mi tarjeta" description="Tu membresía Weincard." path="/app/card" />
      <Stack gap="xl" maw={600} mx="auto" py="lg">
        <Title order={2} style={{ fontFamily: '"Clash Grotesk", sans-serif' }}>
          Mi tarjeta
        </Title>

        {hasMembership && user && membership ? (
          <>
            {/* Card */}
            <Center>
              <MembershipCard
                user={user}
                membership={membership}
                activeUntil={membershipActiveUntil}
              />
            </Center>

            {/* Stats */}
            <SimpleGrid cols={3}>
              {loadingRedemptions ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} height={72} radius="xl" />
                ))
              ) : (
                <>
                  <StatPill label="Canjes" value={String(redemptions.length)} />
                  <StatPill
                    label="Ahorros"
                    value={
                      totalSavings > 0
                        ? `$${totalSavings.toLocaleString("es-CO")}`
                        : "—"
                    }
                  />
                  <StatPill
                    label="Días restantes"
                    value={daysLeft !== null ? String(daysLeft) : "—"}
                  />
                </>
              )}
            </SimpleGrid>

            {/* Quick links */}
            <Group gap="sm">
              <Button
                component={Link}
                to="/app/explore"
                variant="filled"
                color="dark"
                size="sm"
              >
                Explorar restaurantes
              </Button>
              <Button
                component={Link}
                to="/app/membership"
                variant="subtle"
                color="dark"
                size="sm"
              >
                Gestionar membresía
              </Button>
            </Group>
          </>
        ) : (
          /* No membership state */
          <Paper
            radius="xl"
            p="xl"
            withBorder
            style={{
              borderStyle: "dashed",
              borderColor: "var(--mantine-color-gray-3)",
              textAlign: "center",
            }}
          >
            <Box mb="md">
              <CreditCard size={48} strokeWidth={1} style={{ opacity: 0.3 }} />
            </Box>
            <Title order={4} mb="xs" style={{ fontFamily: '"Clash Grotesk", sans-serif' }}>
              No tienes una membresía activa
            </Title>
            <Text c="dimmed" size="sm" mb="lg">
              Obtén tu Weincard y accede a descuentos exclusivos en los mejores restaurantes.
            </Text>
            <Button component={Link} to="/app/membership" color="dark">
              Obtener membresía
            </Button>
          </Paper>
        )}
      </Stack>
    </>
  );
}

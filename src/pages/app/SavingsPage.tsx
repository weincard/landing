import { Link } from "react-router-dom";
import {
  Stack,
  Title,
  Text,
  Paper,
  Timeline,
  Avatar,
  Skeleton,
  Center,
  Button,
  Group,
} from "@mantine/core";
import { Wine } from "lucide-react";
import { useMyRedemptions } from "@/hooks/useRedemptions";
import { PageMeta } from "@/components/layout/PageMeta";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("es-CO", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function SavingsPage() {
  const { data: redemptions = [], isLoading } = useMyRedemptions();

  const totalSavings = redemptions.reduce((sum, r) => sum + (r.discountAmount ?? 0), 0);

  return (
    <>
      <PageMeta title="Mis ahorros" description="Historial de canjes y ahorros Weincard." path="/app/savings" />
      <Stack gap="xl" maw={600} mx="auto" py="lg">
        <Title order={2} style={{ fontFamily: '"Clash Grotesk", sans-serif' }}>
          Mis ahorros
        </Title>

        {/* Hero stat */}
        {isLoading ? (
          <Skeleton height={100} radius="xl" />
        ) : (
          <Paper
            radius="xl"
            p="xl"
            style={{
              background: "#1B1A1A",
              color: "#fff",
              textAlign: "center",
            }}
          >
            <Text
              size="xs"
              fw={700}
              tt="uppercase"
              style={{
                letterSpacing: "0.12em",
                color: "rgba(255,255,255,0.5)",
                fontFamily: '"Clash Grotesk", sans-serif',
              }}
            >
              Total ahorrado
            </Text>
            <Text
              fw={900}
              style={{
                fontSize: "clamp(32px, 6vw, 48px)",
                fontFamily: '"Clash Grotesk", sans-serif',
                marginTop: 4,
                lineHeight: 1,
              }}
            >
              {totalSavings > 0
                ? `$${totalSavings.toLocaleString("es-CO")} COP`
                : "—"}
            </Text>
            <Text size="xs" mt="xs" style={{ color: "rgba(255,255,255,0.4)" }}>
              {redemptions.length} canje{redemptions.length !== 1 ? "s" : ""} realizados
            </Text>
          </Paper>
        )}

        {/* Timeline */}
        {isLoading ? (
          <Stack gap="md">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} height={60} radius="xl" />
            ))}
          </Stack>
        ) : redemptions.length === 0 ? (
          <Center py={80}>
            <Stack align="center" gap="sm">
              <Wine size={48} strokeWidth={1} style={{ opacity: 0.3 }} />
              <Text c="dimmed" size="sm">
                Aún no tienes canjes
              </Text>
              <Button component={Link} to="/app/explore" variant="subtle" color="dark" size="xs">
                Explorar restaurantes
              </Button>
            </Stack>
          </Center>
        ) : (
          <Timeline active={-1} bulletSize={36} lineWidth={2}>
            {redemptions.map((r) => {
              const branchName = r.branchName ?? r.branch?.name ?? "Restaurante";
              const offerTitle = r.offerTitle ?? r.offer?.title ?? "Beneficio";
              const initials = branchName[0]?.toUpperCase() ?? "W";
              const logoUrl = r.branch?.logoUrl;

              return (
                <Timeline.Item
                  key={r.redemptionId}
                  bullet={
                    <Avatar size={32} src={logoUrl || undefined} radius="xl" color="dark">
                      {!logoUrl && initials}
                    </Avatar>
                  }
                  title={
                    <Group gap="xs" align="center">
                      <Text size="sm" fw={700}>
                        {offerTitle}
                      </Text>
                      {r.discountAmount && r.discountAmount > 0 && (
                        <Text
                          size="xs"
                          fw={700}
                          style={{
                            background: "#dcfce7",
                            color: "#15803d",
                            borderRadius: 9999,
                            padding: "1px 8px",
                          }}
                        >
                          −${r.discountAmount.toLocaleString("es-CO")}
                        </Text>
                      )}
                    </Group>
                  }
                >
                  <Text size="xs" c="dimmed">
                    {branchName} · {formatDate(r.createdAt)}
                  </Text>
                </Timeline.Item>
              );
            })}
          </Timeline>
        )}
      </Stack>
    </>
  );
}

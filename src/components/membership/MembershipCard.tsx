import { Group, Stack, Text, Box } from "@mantine/core";
import type { MembershipInfo, AuthUser } from "@/types";
import { MembershipStatusBadge } from "./MembershipStatusBadge";

interface Props {
  user: AuthUser;
  membership: MembershipInfo;
  activeUntil: string | null;
}

export function MembershipCard({ user, membership, activeUntil }: Props) {
  const fullName = user.name ?? [user.firstName, user.lastName].filter(Boolean).join(" ");
  const memberId = String(membership.membershipId).padStart(4, "0");

  const formattedDate = activeUntil
    ? new Date(activeUntil).toLocaleDateString("es-CO", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "—";

  return (
    <Box
      style={{
        width: "100%",
        maxWidth: 420,
        aspectRatio: "420/260",
        borderRadius: 20,
        background: "linear-gradient(135deg, #1B1A1A 0%, #2d2c2c 60%, #1B1A1A 100%)",
        padding: "28px 32px",
        position: "relative",
        overflow: "hidden",
        color: "#fff",
        boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
      }}
    >
      {/* Decorative circles */}
      <Box
        style={{
          position: "absolute",
          top: -60,
          right: -60,
          width: 200,
          height: 200,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.04)",
          pointerEvents: "none",
        }}
      />
      <Box
        style={{
          position: "absolute",
          bottom: -40,
          left: -40,
          width: 150,
          height: 150,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.03)",
          pointerEvents: "none",
        }}
      />

      {/* Header: logo + status */}
      <Group justify="space-between" align="flex-start" mb="auto">
        <img
          src="/logo-weincard.png"
          alt="Weincard"
          style={{ height: 16, width: "auto", filter: "brightness(0) invert(1)", opacity: 0.9 }}
        />
        <MembershipStatusBadge status={membership.status} />
      </Group>

      {/* Plan name */}
      <Stack gap={2} mt={28}>
        <Text
          style={{
            fontFamily: '"Clash Grotesk", sans-serif',
            fontWeight: 900,
            fontSize: 22,
            letterSpacing: "0.06em",
            color: "#fff",
            lineHeight: 1,
          }}
        >
          {membership.membershipPlanName.toUpperCase()}
        </Text>

        {/* Member name */}
        <Text
          style={{
            fontFamily: '"Hepta Slab", serif',
            fontWeight: 300,
            fontSize: 15,
            color: "rgba(255,255,255,0.75)",
            fontStyle: "italic",
            marginTop: 4,
          }}
        >
          {fullName}
        </Text>
      </Stack>

      {/* Footer: expiry + card number */}
      <Group justify="space-between" align="flex-end" mt={20}>
        <Stack gap={2}>
          <Text
            style={{
              fontFamily: '"Clash Grotesk", sans-serif',
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: "0.1em",
              color: "rgba(255,255,255,0.5)",
              textTransform: "uppercase",
            }}
          >
            Válido hasta
          </Text>
          <Text
            style={{
              fontFamily: '"Clash Grotesk", sans-serif',
              fontWeight: 700,
              fontSize: 13,
              color: "rgba(255,255,255,0.9)",
            }}
          >
            {formattedDate}
          </Text>
        </Stack>
        <Text
          style={{
            fontFamily: '"Clash Grotesk", sans-serif',
            fontWeight: 700,
            fontSize: 13,
            color: "rgba(255,255,255,0.5)",
            letterSpacing: "0.15em",
          }}
        >
          ••• {memberId}
        </Text>
      </Group>
    </Box>
  );
}

import { useState } from "react";
import {
  Stack,
  Text,
  Paper,
  Group,
  Button,
  Badge,
  Alert,
  TextInput,
  Divider,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { toast } from "sonner";
import { Users, UserPlus, Mail } from "lucide-react";
import { sharedPlanLabel } from "@/types";
import {
  useFamily,
  useInviteFamilyMember,
  useAcceptFamilyInvite,
  useDeclineFamilyInvite,
  useRemoveFamilyMember,
  useLeaveFamily,
} from "@/hooks/useMembership";

function apiMessage(err: unknown, fallback: string): string {
  return (
    (err as { response?: { data?: { message?: string } } })?.response?.data
      ?.message ?? fallback
  );
}

// Family-plan panel on /app/membership (spec: context/family-plans-design.md).
// Renders nothing unless the user owns a family plan, is a beneficiary, or has
// a pending invite — so it's invisible to everyone else.
export function FamilySection() {
  const { data: family, isLoading } = useFamily();
  const invite = useInviteFamilyMember();
  const accept = useAcceptFamilyInvite();
  const decline = useDeclineFamilyInvite();
  const removeMember = useRemoveFamilyMember();
  const leave = useLeaveFamily();

  const [phone, setPhone] = useState("");

  if (isLoading || !family) return null;
  const { role, pendingInvites, group, beneficiary } = family;
  if (role === null && pendingInvites.length === 0) return null;

  const seatsLeft =
    group != null ? Math.max(0, (group.seatsTotal ?? 0) - group.seatsUsed) : 0;

  function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    if (!phone.trim()) return;
    invite.mutate(phone.trim(), {
      onSuccess: () => {
        toast.success("Invitación enviada. La persona debe aceptarla desde su cuenta.");
        setPhone("");
      },
      onError: (err) =>
        toast.error(apiMessage(err, "No se pudo enviar la invitación.")),
    });
  }

  function handleRemove(userId: number, name: string | null) {
    modals.openConfirmModal({
      title: "¿Retirar beneficiario?",
      children: (
        <Text size="sm">
          {name ?? "Esta persona"} perderá su membresía del plan de inmediato
          y el cupo quedará libre.
        </Text>
      ),
      labels: { confirm: "Sí, retirar", cancel: "Mantener" },
      confirmProps: { color: "red" },
      onConfirm: () =>
        removeMember.mutate(userId, {
          onError: (err) =>
            toast.error(apiMessage(err, "No se pudo retirar al beneficiario.")),
        }),
    });
  }

  function handleLeave() {
    modals.openConfirmModal({
      title: "¿Salir del plan?",
      children: (
        <Text size="sm">
          Perderás tu membresía de inmediato. Podrás adquirir un plan propio o
          ser invitado de nuevo.
        </Text>
      ),
      labels: { confirm: "Sí, salir", cancel: "Quedarme" },
      confirmProps: { color: "red" },
      onConfirm: () =>
        leave.mutate(undefined, {
          onSuccess: () => toast.info("Saliste del plan."),
          onError: (err) =>
            toast.error(apiMessage(err, "No se pudo salir del plan.")),
        }),
    });
  }

  return (
    <Stack gap="md">
      {/* Incoming invites — visible even without any membership */}
      {pendingInvites.map((inv) => (
        <Alert
          key={inv.familyBeneficiaryId}
          icon={<Mail size={16} />}
          color="green"
          variant="light"
          title={`Te invitaron a un ${sharedPlanLabel(inv.seatsTotal)}`}
        >
          <Text size="sm">
            <strong>{inv.ownerName ?? "Un usuario"}</strong> te invitó a su{" "}
            {inv.planName ?? "plan familiar"}. Al aceptar, tu membresía se
            activa sin costo para ti.
          </Text>
          <Group gap="xs" mt="sm">
            <Button
              size="xs"
              color="dark"
              loading={accept.isPending && accept.variables === inv.familyBeneficiaryId}
              onClick={() =>
                accept.mutate(inv.familyBeneficiaryId, {
                  onSuccess: () =>
                    toast.success("¡Bienvenido! Tu membresía está activa."),
                  onError: (err) =>
                    toast.error(apiMessage(err, "No se pudo aceptar la invitación.")),
                })
              }
            >
              Aceptar invitación
            </Button>
            <Button
              size="xs"
              variant="subtle"
              color="gray"
              loading={decline.isPending && decline.variables === inv.familyBeneficiaryId}
              onClick={() =>
                decline.mutate(inv.familyBeneficiaryId, {
                  onError: (err) =>
                    toast.error(apiMessage(err, "No se pudo rechazar la invitación.")),
                })
              }
            >
              Rechazar
            </Button>
          </Group>
        </Alert>
      ))}

      {/* Owner view */}
      {role === "owner" && group && (
        <Paper radius="xl" p="xl" withBorder>
          <Group justify="space-between" align="flex-start" mb="xs">
            <Group gap="xs">
              <Users size={18} />
              <Text fw={700} style={{ fontFamily: '"Clash Grotesk", sans-serif' }}>
                Tu {sharedPlanLabel(group.seatsTotal)}
              </Text>
            </Group>
            <Badge color="dark" variant="light" radius="xl">
              {group.seatsUsed}/{group.seatsTotal ?? 0} cupos usados
            </Badge>
          </Group>
          <Text size="sm" c="dimmed" mb="md">
            {group.seatsTotal === 1
              ? "Invita a tu beneficiario por su número de celular. Debe tener cuenta Weincard, no pertenecer a una organización y no tener otra membresía activa."
              : `Invita hasta ${group.seatsTotal ?? 0} beneficiarios por su número de celular. Deben tener cuenta Weincard, no pertenecer a una organización y no tener otra membresía activa.`}
          </Text>

          {group.members.length > 0 && (
            <Stack gap="xs" mb="md">
              {group.members.map((m) => (
                <Group key={m.familyBeneficiaryId} justify="space-between" wrap="nowrap">
                  <Stack gap={0}>
                    <Text size="sm" fw={600}>
                      {m.name ?? m.phone ?? "—"}
                    </Text>
                    <Text size="xs" c="dimmed">
                      {m.phone ?? ""}
                    </Text>
                  </Stack>
                  <Group gap="xs" wrap="nowrap">
                    <Badge
                      size="sm"
                      radius="xl"
                      variant="light"
                      color={m.status === "active" ? "green" : "yellow"}
                    >
                      {m.status === "active" ? "Activo" : "Invitación pendiente"}
                    </Badge>
                    <Button
                      size="compact-xs"
                      variant="subtle"
                      color="red"
                      loading={removeMember.isPending && removeMember.variables === m.userId}
                      onClick={() => handleRemove(m.userId, m.name)}
                    >
                      {m.status === "active" ? "Retirar" : "Cancelar invitación"}
                    </Button>
                  </Group>
                </Group>
              ))}
            </Stack>
          )}

          {seatsLeft > 0 ? (
            <>
              <Divider my="sm" />
              <form onSubmit={handleInvite}>
                <Group gap="sm">
                  <TextInput
                    flex={1}
                    type="tel"
                    placeholder="Celular del beneficiario (ej. 3001234567)"
                    value={phone}
                    onChange={(e) => setPhone(e.currentTarget.value)}
                  />
                  <Button
                    type="submit"
                    color="dark"
                    disabled={!phone.trim()}
                    loading={invite.isPending}
                    leftSection={<UserPlus size={14} />}
                  >
                    Invitar
                  </Button>
                </Group>
              </form>
            </>
          ) : (
            <Text size="xs" c="dimmed">
              No te quedan cupos disponibles. Retira un beneficiario para
              liberar uno.
            </Text>
          )}
        </Paper>
      )}

      {/* Beneficiary view */}
      {role === "beneficiary" && beneficiary && (
        <Paper radius="xl" p="xl" withBorder>
          <Group gap="xs" mb="xs">
            <Users size={18} />
            <Text
              fw={700}
              style={{ fontFamily: '"Clash Grotesk", sans-serif' }}
              tt="capitalize"
            >
              {sharedPlanLabel(beneficiary.seatsTotal)}
            </Text>
          </Group>
          <Text size="sm" c="dimmed" mb="md">
            Tu membresía hace parte del{" "}
            {sharedPlanLabel(beneficiary.seatsTotal)} de{" "}
            <strong>{beneficiary.ownerName ?? "otro usuario"}</strong>. No tiene
            costo para ti y se gestiona desde la cuenta del titular.
          </Text>
          <Button
            variant="subtle"
            color="red"
            size="xs"
            loading={leave.isPending}
            onClick={handleLeave}
          >
            Salir del plan
          </Button>
        </Paper>
      )}
    </Stack>
  );
}

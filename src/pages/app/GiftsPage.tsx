import { useState } from "react";
import {
  Stack,
  Title,
  Text,
  Paper,
  Group,
  Badge,
  Skeleton,
  Center,
  Button,
  Modal,
  Radio,
  Select,
  Divider,
  CopyButton,
  ActionIcon,
  Tooltip,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { Gift as GiftIcon, Copy, Check, ArrowLeft } from "lucide-react";
import { notifications } from "@mantine/notifications";
import { useMyGifts, useSelectGift } from "@/hooks/useLoyalty";
import type { LoyaltyGift, LoyaltyGiftStatus } from "@/api/loyalty";
import { PageMeta } from "@/components/layout/PageMeta";

const STATUS_META: Record<LoyaltyGiftStatus, { label: string; color: string }> = {
  pending_selection: { label: "Elige tu premio", color: "grape" },
  claimable: { label: "Por reclamar", color: "teal" },
  redeemed: { label: "Reclamado", color: "green" },
  expired: { label: "Expirado", color: "orange" },
  voided: { label: "Anulado", color: "red" },
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("es-CO", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function GiftsPage() {
  const { data: gifts = [], isLoading } = useMyGifts();
  const navigate = useNavigate();

  return (
    <>
      <PageMeta
        title="Mis premios"
        description="Premios ganados en la temporada de fidelidad Weincard."
        path="/app/gifts"
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
          <GiftIcon size={26} />
          <Title order={2} style={{ fontFamily: '"Clash Grotesk", sans-serif' }}>
            Mis premios
          </Title>
        </Group>

        {isLoading ? (
          <Skeleton height={140} radius="xl" />
        ) : gifts.length === 0 ? (
          <Paper radius="xl" p="xl" withBorder>
            <Center>
              <Stack align="center" gap="xs">
                <GiftIcon size={40} color="#B8BCC4" />
                <Text fw={600}>Todavía no tienes premios</Text>
                <Text size="sm" c="dimmed" ta="center">
                  Los premios se entregan al terminar cada temporada a quienes quedan en los
                  primeros puestos. ¡Sigue canjeando para subir en la tabla!
                </Text>
              </Stack>
            </Center>
          </Paper>
        ) : (
          gifts.map((g) => <GiftCard key={g.giftId} gift={g} />)
        )}
      </Stack>
    </>
  );
}

function GiftCard({ gift }: { gift: LoyaltyGift }) {
  const meta = STATUS_META[gift.status];
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <Paper radius="xl" p="lg" withBorder>
      <Group justify="space-between" mb="xs">
        <Badge size="lg" variant="light" color="dark">
          {gift.tierName}
        </Badge>
        <Badge variant="light" color={meta.color}>
          {meta.label}
        </Badge>
      </Group>

      {gift.status === "pending_selection" && (
        <>
          <Text c="dimmed" size="sm" mb="sm">
            ¡Felicitaciones! Elige qué premio quieres y en qué restaurante lo vas a reclamar.
          </Text>
          <Button onClick={open} radius="xl" fullWidth>
            Elegir premio
          </Button>
          <SelectPrizeModal gift={gift} opened={opened} onClose={close} />
        </>
      )}

      {gift.status === "claimable" && <ClaimableGift gift={gift} />}

      {gift.status === "redeemed" && (
        <Stack gap={2}>
          <Text fw={600}>{gift.chosenItemLabel}</Text>
          <Text size="sm" c="dimmed">
            {gift.chosenMerchantName}
          </Text>
          <Text size="xs" c="dimmed">
            Reclamado el {gift.redeemedAt ? formatDate(gift.redeemedAt) : "—"}
          </Text>
        </Stack>
      )}

      {(gift.status === "expired" || gift.status === "voided") && (
        <Stack gap={2}>
          <Text fw={600} c="dimmed">
            {gift.chosenItemLabel ?? "Premio no reclamado"}
          </Text>
          <Text size="sm" c="dimmed">
            {gift.status === "expired"
              ? "Este premio venció sin reclamarse."
              : "Este premio fue anulado."}
          </Text>
        </Stack>
      )}
    </Paper>
  );
}

function ClaimableGift({ gift }: { gift: LoyaltyGift }) {
  const qrValue = gift.qrToken
    ? `${window.location.origin}/validar-regalo?token=${gift.qrToken}`
    : "";
  return (
    <Stack gap="sm" align="center">
      <Stack gap={0} align="center">
        <Text fw={700} size="lg">
          {gift.chosenItemLabel}
        </Text>
        <Text size="sm" c="dimmed">
          en {gift.chosenMerchantName}
        </Text>
      </Stack>

      {qrValue && (
        <Paper p="md" radius="lg" withBorder>
          <QRCodeSVG value={qrValue} size={168} />
        </Paper>
      )}

      <Group gap="xs" align="center">
        <Text size="xs" c="dimmed">
          Código:
        </Text>
        <Text fw={700} style={{ fontFamily: "monospace", letterSpacing: 2, fontSize: 20 }}>
          {gift.code}
        </Text>
        {gift.code && (
          <CopyButton value={gift.code}>
            {({ copied, copy }) => (
              <Tooltip label={copied ? "Copiado" : "Copiar"}>
                <ActionIcon variant="subtle" onClick={copy}>
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                </ActionIcon>
              </Tooltip>
            )}
          </CopyButton>
        )}
      </Group>

      <Divider w="100%" />
      <Text size="xs" c="dimmed" ta="center">
        Muestra este código (o el QR) al personal del restaurante para reclamar tu premio.
        {gift.expiresAt ? ` Válido hasta el ${formatDate(gift.expiresAt)}.` : ""}
      </Text>
    </Stack>
  );
}

function SelectPrizeModal({
  gift,
  opened,
  onClose,
}: {
  gift: LoyaltyGift;
  opened: boolean;
  onClose: () => void;
}) {
  const select = useSelectGift();
  const [optionId, setOptionId] = useState<string | null>(null);
  const [merchantId, setMerchantId] = useState<string | null>(null);

  const chosenOption = gift.options.find((o) => String(o.optionId) === optionId);
  const merchantData =
    chosenOption?.merchants.map((m) => ({ value: String(m.merchantId), label: m.name })) ?? [];

  const submit = async () => {
    if (!optionId || !merchantId) return;
    try {
      await select.mutateAsync({
        giftId: gift.giftId,
        optionId: Number(optionId),
        merchantId: Number(merchantId),
      });
      notifications.show({ title: "¡Premio listo para reclamar!", color: "teal", message: "" });
      onClose();
    } catch {
      notifications.show({
        title: "No se pudo guardar",
        color: "red",
        message: "Inténtalo de nuevo.",
      });
    }
  };

  return (
    <Modal opened={opened} onClose={onClose} title="Elige tu premio" centered>
      <Stack gap="md">
        <div>
          <Text fw={600} size="sm" mb="xs">
            1. ¿Qué quieres?
          </Text>
          <Radio.Group
            value={optionId}
            onChange={(v) => {
              setOptionId(v);
              setMerchantId(null);
            }}
          >
            <Stack gap="xs">
              {gift.options.map((o) => (
                <Radio
                  key={o.optionId}
                  value={String(o.optionId)}
                  label={
                    <div>
                      <Text fw={500}>{o.label}</Text>
                      {o.description && (
                        <Text size="xs" c="dimmed">
                          {o.description}
                        </Text>
                      )}
                    </div>
                  }
                />
              ))}
            </Stack>
          </Radio.Group>
        </div>

        {chosenOption && (
          <div>
            <Text fw={600} size="sm" mb="xs">
              2. ¿En qué restaurante?
            </Text>
            <Select
              placeholder="Selecciona un aliado"
              data={merchantData}
              value={merchantId}
              onChange={setMerchantId}
              searchable
            />
          </div>
        )}

        <Text size="xs" c="dimmed">
          Una vez confirmes, tu premio queda ligado a ese restaurante y no podrás cambiarlo.
        </Text>

        <Group justify="flex-end">
          <Button variant="default" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={submit} loading={select.isPending} disabled={!optionId || !merchantId}>
            Confirmar
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}

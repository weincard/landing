import { useEffect, useState } from "react";
import { Modal, Button, Stack, Center, Image, Text } from "@mantine/core";
import { Wifi } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import type { PublicAppConfig } from "@/api/config";

interface Props {
  opened: boolean;
  onClose: () => void;
  somosPromo: NonNullable<PublicAppConfig["somosPromo"]>;
}

function canContactWhatsApp(
  somosPromo: Props["somosPromo"],
  membershipPlanId: number | null,
  isActive: boolean,
): boolean {
  return (
    somosPromo.whatsappEnabled &&
    somosPromo.whatsappNumber.length > 0 &&
    isActive &&
    membershipPlanId !== null &&
    somosPromo.allowedPlanIds.includes(membershipPlanId)
  );
}

export function SomosPromoModal({ opened, onClose, somosPromo }: Props) {
  const { membership, user } = useAuth();
  const [whatsappUrl, setWhatsappUrl] = useState<string>("");

  const isActive =
    membership &&
    ["active", "pending_cancel", "unpaid", "trialing"].includes(
      membership.status,
    );
  const eligible = canContactWhatsApp(
    somosPromo,
    membership?.membershipPlanId ?? null,
    !!isActive,
  );

  useEffect(() => {
    if (!eligible || !user) {
      setWhatsappUrl("");
      return;
    }

    const message =
      somosPromo.verificationCode.length > 0
        ? `${somosPromo.whatsappMessage}\n\nCódigo: ${somosPromo.verificationCode}-${user.userId}`
        : somosPromo.whatsappMessage;

    const encodedMessage = encodeURIComponent(message);
    setWhatsappUrl(
      `https://wa.me/${somosPromo.whatsappNumber}?text=${encodedMessage}`,
    );
  }, [eligible, user, somosPromo]);

  const buttonLabel = eligible
    ? somosPromo.whatsappButtonLabel
    : somosPromo.buttonLabel;
  const buttonOnClick = eligible
    ? () => {
        window.open(whatsappUrl, "_blank");
      }
    : onClose;

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      size="lg"
      centered
      radius="lg"
      withCloseButton={false}
      styles={{
        content: {
          maxHeight: "90vh",
          overflow: "auto",
        },
      }}
    >
      <Stack gap="lg" align="center" pb="lg">
        {/* Icon */}
        <Center
          w={72}
          h={72}
          style={{
            background: "#FF69B4",
            borderRadius: "20px",
            flexShrink: 0,
          }}
        >
          {somosPromo.iconUrl ? (
            <Image
              src={somosPromo.iconUrl}
              alt="Somos"
              w={72}
              h={72}
              style={{ borderRadius: "20px", objectFit: "cover" }}
            />
          ) : (
            <Wifi size={40} color="white" strokeWidth={1.5} />
          )}
        </Center>

        {/* Title */}
        <Text fw={700} size="lg" ta="center" style={{ marginBottom: "-8px" }}>
          {somosPromo.modalTitle}
        </Text>

        {/* Subtitle */}
        <Text size="sm" c="dimmed" ta="center">
          {somosPromo.modalSubtitle}
        </Text>

        {/* Body text */}
        <Stack gap="sm" w="100%">
          <Text size="sm">{somosPromo.modalBody1}</Text>
          <Text size="xs" c="dimmed">
            {somosPromo.modalBody2}
          </Text>
        </Stack>

        {/* Action button */}
        <Button fullWidth onClick={buttonOnClick} size="md" radius="xl">
          {buttonLabel}
        </Button>
      </Stack>
    </Modal>
  );
}

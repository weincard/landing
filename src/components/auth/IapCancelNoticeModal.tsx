import { useEffect, useRef, useState } from "react";
import { Modal, Button, Stack, Text, Anchor } from "@mantine/core";
import { useAuth } from "@/context/AuthContext";
import { useAppConfig } from "@/hooks/useAppConfig";
import { recheckIapIssues } from "@/api/users";

// Flutter-parity defaults — used per-field when the remote copy is missing.
const FALLBACK = {
  title: "Tu membresía corporativa está activa",
  body1:
    "Fuiste agregado a la organización {orgName} en WeinCard, así que ya no necesitas tu suscripción personal pagada a través del App Store de Apple.",
  body2:
    "Apple seguirá cobrándote esa suscripción hasta que la canceles tú mismo desde tu cuenta. Cancelarla no afecta tus beneficios: tu membresía corporativa seguirá activa.",
  ctaLabel: "Cancelar en el App Store",
  alreadyCancelledLabel: "Ya la cancelé",
  dismissLabel: "Entendido",
};

const APPLE_SUBSCRIPTIONS_URL = "https://apps.apple.com/account/subscriptions";

// Once per tab session — the web analog of Flutter's once-per-app-open gate.
const SESSION_FLAG = "wc_iap_notice_evaluated";

/**
 * "Cancel your Apple IAP subscription" notice (Flutter IapCancelNoticeGate +
 * IapCancelNoticeModal parity): shown to users whose `/users/status` carries
 * open `pendingIapIssues` (imported into a b2b org while still paying Apple).
 *
 * Before showing, it silently rechecks the issues against the backend: if the
 * user already cancelled and Apple's webhook reached us, the issues
 * auto-resolve and the modal never appears. Gated by the remote
 * `iapCancelNotice.enabled` kill switch, shown once per tab session, and
 * mounted globally next to ConsentGateModal (dismissible, unlike consent).
 */
export function IapCancelNoticeModal() {
  const { isLoggedIn, pendingIapIssues, organizationName, refreshUser } = useAuth();
  const { data: appConfig } = useAppConfig();

  const [opened, setOpened] = useState(false);
  const [rechecking, setRechecking] = useState(false);
  const [stillActive, setStillActive] = useState(false);
  const evaluating = useRef(false);

  const config = appConfig?.iapCancelNotice;
  const enabled = config?.enabled ?? false;
  const hasIssues = isLoggedIn && pendingIapIssues.length > 0;

  useEffect(() => {
    if (!enabled || !hasIssues) return;
    if (sessionStorage.getItem(SESSION_FLAG)) return;
    if (evaluating.current) return;
    evaluating.current = true;
    sessionStorage.setItem(SESSION_FLAG, "1");

    // Silent pre-check: the user may have cancelled since the issue was
    // recorded. On recheck failure fall through to showing the notice — the
    // status endpoint said the issue is open, and hiding it on a transient
    // error would silently postpone a notice about real money.
    (async () => {
      try {
        const res = await recheckIapIssues();
        if (res.data.stillOpen === 0) {
          // Refresh so the session stops carrying the now-resolved issues.
          await refreshUser();
          return;
        }
      } catch {
        // fall through to showing the notice
      }
      setOpened(true);
    })();
  }, [enabled, hasIssues, refreshUser]);

  if (!enabled || !hasIssues) return null;

  const orgName =
    pendingIapIssues[0]?.orgName ?? organizationName ?? "";
  const text = (key: keyof typeof FALLBACK) => {
    const value = config?.[key];
    const raw = value && value.length > 0 ? value : FALLBACK[key];
    return raw.replaceAll("{orgName}", orgName);
  };

  const onAlreadyCancelled = async () => {
    setRechecking(true);
    setStillActive(false);
    try {
      const res = await recheckIapIssues();
      if (res.data.stillOpen === 0) {
        // All clear — refresh the session and close for good.
        await refreshUser();
        setOpened(false);
        return;
      }
      setStillActive(true);
    } catch {
      setStillActive(true);
    } finally {
      setRechecking(false);
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={() => setOpened(false)}
      centered
      radius="lg"
      title={text("title")}
    >
      <Stack gap="md">
        <Text size="sm">{text("body1")}</Text>
        <Text size="sm" c="dimmed">
          {text("body2")}
        </Text>

        {stillActive && (
          <Text size="sm" c="orange">
            Tu suscripción aún aparece activa. Apple puede tardar unos minutos
            en reflejar la cancelación — intenta de nuevo más tarde.
          </Text>
        )}

        <Button
          color="dark"
          radius="xl"
          fullWidth
          component="a"
          href={APPLE_SUBSCRIPTIONS_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          {text("ctaLabel")}
        </Button>

        <Button
          variant="outline"
          color="dark"
          radius="xl"
          fullWidth
          loading={rechecking}
          onClick={onAlreadyCancelled}
        >
          {text("alreadyCancelledLabel")}
        </Button>

        <Anchor
          component="button"
          type="button"
          size="xs"
          c="dimmed"
          ta="center"
          onClick={() => setOpened(false)}
        >
          {text("dismissLabel")}
        </Anchor>
      </Stack>
    </Modal>
  );
}

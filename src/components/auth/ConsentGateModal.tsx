import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Modal, Button, Checkbox, Stack, Text, Anchor } from "@mantine/core";
import { useAuth } from "@/context/AuthContext";
import { acceptConsent } from "@/api/users";

function apiError(err: unknown, fallback: string): string {
  return (
    (err as { response?: { data?: { message?: string } } })?.response?.data
      ?.message ?? fallback
  );
}

// Routes where the gate must NOT block even with a pending consent:
// - /registro: the wizard has its own consent step (blocking it would double-
//   prompt a brand-new user mid-registration).
// - legal pages: the modal links to them (target=_blank) — the user must be
//   able to read what they're accepting.
const EXEMPT_PATHS = [
  "/registro",
  "/terminos-y-condiciones",
  "/politica-de-privacidad",
  "/politica-de-cookies",
];

const legalLinkStyle = { color: "#FF3B47", textDecoration: "underline" } as const;

/**
 * Blocking consent gate (Flutter CompleteProfileView parity, consent only).
 * Mounted at the router root: whenever a session exists and the backend says
 * the current T&C version hasn't been accepted (`consentRequired` from
 * GET /users/status — first consent or a version bump), this modal blocks the
 * whole app until the user accepts or logs out. Required for Colombian
 * personal-data (habeas data) compliance, so it covers every route, not just
 * the /app shell.
 */
export function ConsentGateModal() {
  const { user, isLoggedIn, consentRequired, refreshUser, logout } = useAuth();
  const { pathname } = useLocation();
  const [checked, setChecked] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const opened =
    isLoggedIn && consentRequired && !EXEMPT_PATHS.includes(pathname);

  const onAccept = async () => {
    if (!user || !checked) return;
    setError(null);
    setSaving(true);
    try {
      await acceptConsent(user.userId);
      // Refetching /users/status flips consentRequired → false, closing us.
      await refreshUser();
    } catch (err) {
      setError(apiError(err, "No pudimos guardar tu aceptación. Intenta de nuevo."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={() => {}}
      withCloseButton={false}
      closeOnClickOutside={false}
      closeOnEscape={false}
      centered
      radius="lg"
      title="Actualización de términos"
    >
      <Stack gap="md">
        <Text size="sm" c="dimmed">
          Para seguir usando Weincard necesitamos que aceptes nuestros términos
          y el tratamiento de tus datos personales.
        </Text>

        <Checkbox
          checked={checked}
          onChange={(e) => setChecked(e.currentTarget.checked)}
          color="dark"
          label={
            <Text size="sm">
              Acepto los{" "}
              <Link to="/terminos-y-condiciones" target="_blank" style={legalLinkStyle}>
                Términos y Condiciones
              </Link>
              , la{" "}
              <Link to="/politica-de-privacidad" target="_blank" style={legalLinkStyle}>
                Política de Privacidad
              </Link>{" "}
              y la{" "}
              <Link to="/politica-de-cookies" target="_blank" style={legalLinkStyle}>
                Política de Cookies
              </Link>
              .
            </Text>
          }
        />

        {error && (
          <Text size="sm" c="red">
            {error}
          </Text>
        )}

        <Button
          color="dark"
          radius="xl"
          fullWidth
          disabled={!checked}
          loading={saving}
          onClick={onAccept}
        >
          Aceptar y continuar
        </Button>

        <Anchor
          component="button"
          type="button"
          size="xs"
          c="dimmed"
          ta="center"
          onClick={logout}
        >
          Cerrar sesión
        </Anchor>
      </Stack>
    </Modal>
  );
}

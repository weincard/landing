import { useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { Modal, Button, Stack, Text, Group } from "@mantine/core";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import {
  emailSendCode,
  emailVerifyCode,
  phoneAttachRequestOtp,
  phoneAttachVerifyOtp,
} from "@/api/auth";
import { createCheckoutSession } from "@/api/memberships";
import { CodeInput } from "./CodeInput";
import { PhoneCountryInput } from "./PhoneCountryInput";
import {
  composePhone,
  splitPhone,
  type Country,
} from "@/lib/countries";
import type { PlanKey } from "@/types";

// One unified, URL-synced verification surface for both email and phone. It is
// mounted once at the router root and driven entirely by the query string:
//   ?verify=email        → verify the logged-in user's saved email
//   ?verify=phone        → attach + verify a phone onto the current account
//   &then=checkout&plan= → after success, open the Treli checkout for that plan
// Because the open/type/intent live in the URL, a reload re-opens the modal and
// resumes the same intent; closing it clears the params. The inner body is
// remounted per-open (conditional render), so its sub-flow state starts fresh
// without a reset effect.

type VerifyType = "email" | "phone";

function apiError(err: unknown, fallback: string): string {
  return (
    (err as { response?: { data?: { message?: string } } })?.response?.data
      ?.message ?? fallback
  );
}

export function VerifyContactModal() {
  const { user } = useAuth();
  const [params, setParams] = useSearchParams();

  const verifyParam = params.get("verify");
  const type: VerifyType | null =
    verifyParam === "email" || verifyParam === "phone" ? verifyParam : null;
  const open = type !== null && !!user;

  const close = useCallback(() => {
    setParams(
      (prev) => {
        const p = new URLSearchParams(prev);
        p.delete("verify");
        p.delete("then");
        p.delete("plan");
        return p;
      },
      { replace: true },
    );
  }, [setParams]);

  const title = type === "phone" ? "Verifica tu teléfono" : "Verifica tu correo";

  return (
    <Modal
      opened={open}
      onClose={close}
      title={title}
      centered
      radius="lg"
      overlayProps={{ backgroundOpacity: 0.55, blur: 2 }}
    >
      {open && type && <VerifyBody key={type} type={type} onClose={close} />}
    </Modal>
  );
}

function VerifyBody({
  type,
  onClose,
}: {
  type: VerifyType;
  onClose: () => void;
}) {
  const { user, refreshUser } = useAuth();
  const [params] = useSearchParams();

  const seed = splitPhone(user?.phone);
  const [stage, setStage] = useState<"start" | "code">("start");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [country, setCountry] = useState<Country>(seed.country);
  const [number, setNumber] = useState(seed.number);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // After a successful verification, run any pending intent (currently only the
  // Treli checkout continuation), then close.
  async function runThenAndClose(targetEmail: string | null) {
    const then = params.get("then");
    if (then === "checkout" && targetEmail) {
      const plan = (params.get("plan") as PlanKey | null) ?? "monthly";
      try {
        const res = await createCheckoutSession(targetEmail, plan);
        if (res.data?.url) {
          window.location.href = res.data.url;
          return; // navigating away — leave the URL as-is
        }
      } catch (err) {
        toast.error(apiError(err, "No pudimos iniciar el pago."));
      }
    }
    onClose();
  }

  // ── Email ──
  async function sendEmailCode() {
    if (!user?.email) return;
    setError("");
    setLoading(true);
    try {
      await emailSendCode(user.email);
      setCode(["", "", "", "", "", ""]);
      setStage("code");
      toast.success("Código enviado a tu correo.");
    } catch (err) {
      setError(apiError(err, "No pudimos enviar el código."));
    } finally {
      setLoading(false);
    }
  }

  async function verifyEmailCode() {
    if (!user?.email) return;
    if (code.join("").length !== 6) {
      setError("Ingresa el código de 6 dígitos completo.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await emailVerifyCode(user.email, code.join(""));
      await refreshUser();
      toast.success("Correo verificado.");
      await runThenAndClose(user.email);
    } catch (err) {
      setError(apiError(err, "Código incorrecto o expirado."));
      setLoading(false);
    }
  }

  // ── Phone ──
  async function sendPhoneCode() {
    if (number.trim().length < 7) {
      setError("Ingresa un número de teléfono válido.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await phoneAttachRequestOtp(composePhone(country, number));
      setCode(["", "", "", "", "", ""]);
      setStage("code");
      toast.success("Código enviado por WhatsApp.");
    } catch (err) {
      setError(apiError(err, "No pudimos enviar el código."));
    } finally {
      setLoading(false);
    }
  }

  async function verifyPhoneCode() {
    if (code.join("").length !== 6) {
      setError("Ingresa el código de 6 dígitos completo.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await phoneAttachVerifyOtp(composePhone(country, number), code.join(""));
      await refreshUser();
      toast.success("Teléfono verificado.");
      await runThenAndClose(user?.email ?? null);
    } catch (err) {
      setError(apiError(err, "Código incorrecto o expirado."));
      setLoading(false);
    }
  }

  if (type === "email") {
    return (
      <Stack gap="md">
        {stage === "start" ? (
          <>
            <Text size="sm" c="dimmed">
              Te enviaremos un código de 6 dígitos a{" "}
              <strong>{user?.email}</strong> para confirmar que es tuyo.
            </Text>
            {error && (
              <Text size="sm" c="red">
                {error}
              </Text>
            )}
            <Button color="dark" loading={loading} onClick={sendEmailCode}>
              Enviar código
            </Button>
          </>
        ) : (
          <>
            <Text size="sm" c="dimmed">
              Ingresa el código enviado a <strong>{user?.email}</strong>.
            </Text>
            <CodeInput value={code} onChange={setCode} />
            {error && (
              <Text size="sm" c="red">
                {error}
              </Text>
            )}
            <Group justify="space-between">
              <Button
                variant="subtle"
                color="gray"
                onClick={sendEmailCode}
                disabled={loading}
              >
                Reenviar
              </Button>
              <Button
                color="dark"
                loading={loading}
                disabled={code.join("").length !== 6}
                onClick={verifyEmailCode}
              >
                Verificar
              </Button>
            </Group>
          </>
        )}
      </Stack>
    );
  }

  // type === "phone"
  return (
    <Stack gap="md">
      {stage === "start" ? (
        <>
          <Text size="sm" c="dimmed">
            Te enviaremos un código por WhatsApp para confirmar tu número.
          </Text>
          <PhoneCountryInput
            country={country}
            number={number}
            onCountryChange={setCountry}
            onNumberChange={setNumber}
            required
            autoFocus
          />
          {error && (
            <Text size="sm" c="red">
              {error}
            </Text>
          )}
          <Button color="dark" loading={loading} onClick={sendPhoneCode}>
            Enviar código
          </Button>
        </>
      ) : (
        <>
          <Text size="sm" c="dimmed">
            Ingresa el código enviado al{" "}
            <strong>
              {country.dial} {number}
            </strong>
            .
          </Text>
          <CodeInput value={code} onChange={setCode} />
          {error && (
            <Text size="sm" c="red">
              {error}
            </Text>
          )}
          <Group justify="space-between">
            <Button
              variant="subtle"
              color="gray"
              onClick={() => {
                setStage("start");
                setError("");
              }}
              disabled={loading}
            >
              Cambiar número
            </Button>
            <Button
              color="dark"
              loading={loading}
              disabled={code.join("").length !== 6}
              onClick={verifyPhoneCode}
            >
              Verificar
            </Button>
          </Group>
        </>
      )}
    </Stack>
  );
}

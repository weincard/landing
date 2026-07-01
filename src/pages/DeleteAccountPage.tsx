import { useState } from "react";
import axios from "axios";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageMeta } from "@/components/layout/PageMeta";
import { type DeleteChannel } from "@/api/auth";
import {
  useRequestDeleteOtp,
  useConfirmDeleteAccount,
} from "@/hooks/useAccountActions";

type Step = "request" | "verify" | "done";

function apiError(err: unknown, fallback: string): string {
  if (axios.isAxiosError(err)) {
    return (err.response?.data as { message?: string })?.message ?? fallback;
  }
  return fallback;
}

export function DeleteAccountPage() {
  const [step, setStep] = useState<Step>("request");
  const [channel, setChannel] = useState<DeleteChannel>("phone");
  const [value, setValue] = useState(""); // 10-digit phone OR email
  const [code, setCode] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const requestOtpMutation = useRequestDeleteOtp();
  const confirmMutation = useConfirmDeleteAccount();

  const valueValid =
    channel === "phone"
      ? /^\d{10}$/.test(value.trim())
      : /^\S+@\S+\.\S+$/.test(value.trim());

  function resetChannel(next: DeleteChannel) {
    setChannel(next);
    setValue("");
    setError("");
  }

  async function handleRequest(e: React.FormEvent) {
    e.preventDefault();
    if (!valueValid || isLoading) return;
    setIsLoading(true);
    setError("");
    try {
      const data = await requestOtpMutation.mutateAsync({
        channel,
        value: value.trim(),
      });
      if (!data.found) {
        setError(
          channel === "phone"
            ? "No encontramos una cuenta activa con ese número de teléfono."
            : "No encontramos una cuenta activa con ese correo electrónico.",
        );
        return;
      }
      setStep("verify");
    } catch (err) {
      setError(apiError(err, "No pudimos enviar el código. Intenta de nuevo."));
    } finally {
      setIsLoading(false);
    }
  }

  async function handleConfirm(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim() || !confirmed || isLoading) return;
    setIsLoading(true);
    setError("");
    try {
      await confirmMutation.mutateAsync({
        channel,
        value: value.trim(),
        code: code.trim(),
      });
      setStep("done");
    } catch (err) {
      setError(apiError(err, "No pudimos eliminar tu cuenta. Intenta de nuevo."));
    } finally {
      setIsLoading(false);
    }
  }

  // ─────────────────────────────── Done ────────────────────────────────────
  if (step === "done") {
    return (
      <main style={{ minHeight: "100vh", background: "#f7f5f3" }}>
        <PageMeta title="Cuenta eliminada" description="Tu cuenta Weincard ha sido eliminada." path="/delete-account" />
        <Header />
        <div style={{ maxWidth: "560px", margin: "0 auto", padding: "80px 16px", textAlign: "center" }}>
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "50%",
              background: "#f0fdf4",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 24px",
            }}
          >
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="#15803d" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 style={{ fontFamily: '"Clash Grotesk", sans-serif', fontWeight: 900, fontSize: "28px", color: "#000", marginBottom: "12px" }}>
            Cuenta eliminada
          </h1>
          <p style={{ fontFamily: '"Hepta Slab", serif', color: "#6b7280", fontSize: "15px", lineHeight: 1.6 }}>
            Tu cuenta y tus datos personales (nombre, correo, teléfono y documento) han sido eliminados de forma permanente. Tu suscripción activa, si tenías una, fue cancelada.
          </p>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main style={{ minHeight: "100vh", background: "#f7f5f3" }}>
      <PageMeta title="Eliminar cuenta" description="Solicita la eliminación de tu cuenta Weincard." path="/delete-account" />
      <Header />

      <div style={{ maxWidth: "560px", margin: "0 auto", padding: "64px 16px" }}>
        <div style={{ marginBottom: "32px", textAlign: "center" }}>
          <h1
            style={{
              fontFamily: '"Clash Grotesk", sans-serif',
              fontWeight: 900,
              fontSize: "clamp(24px, 5vw, 36px)",
              color: "#000",
              letterSpacing: "-0.02em",
              marginBottom: "8px",
            }}
          >
            ELIMINAR CUENTA
          </h1>
          <p style={{ fontFamily: '"Hepta Slab", serif', color: "#6b7280", fontSize: "14px", lineHeight: 1.6 }}>
            Esta acción es irreversible. Tus datos personales serán eliminados permanentemente y tu suscripción activa será cancelada.
          </p>
        </div>

        <div style={{ background: "#fff", borderRadius: "20px", padding: "32px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
          {step === "request" ? (
            <form onSubmit={handleRequest} noValidate>
              <p style={{ fontFamily: '"Hepta Slab", serif', color: "#374151", fontSize: "14px", lineHeight: 1.6, marginBottom: "20px" }}>
                Para verificar que eres el titular, te enviaremos un código de un solo uso. Elige cómo identificar tu cuenta:
              </p>

              {/* Channel toggle */}
              <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
                {(["phone", "email"] as DeleteChannel[]).map((ch) => {
                  const active = channel === ch;
                  return (
                    <button
                      key={ch}
                      type="button"
                      onClick={() => resetChannel(ch)}
                      style={{
                        flex: 1,
                        padding: "10px",
                        borderRadius: "10px",
                        border: active ? "1px solid #000" : "1px solid #d1d5db",
                        background: active ? "#000" : "#fff",
                        color: active ? "#fff" : "#374151",
                        fontFamily: '"Clash Grotesk", sans-serif',
                        fontWeight: 600,
                        fontSize: "13px",
                        cursor: "pointer",
                      }}
                    >
                      {ch === "phone" ? "Teléfono" : "Correo"}
                    </button>
                  );
                })}
              </div>

              <div style={{ marginBottom: "24px" }}>
                <label style={labelStyle}>
                  {channel === "phone" ? "Número de teléfono" : "Correo electrónico"}{" "}
                  <span style={{ color: "#FF3B47" }}>*</span>
                </label>
                {channel === "phone" ? (
                  <div style={{ display: "flex", alignItems: "stretch" }}>
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        padding: "0 12px",
                        border: "1px solid #d1d5db",
                        borderRight: "none",
                        borderRadius: "10px 0 0 10px",
                        background: "#f9fafb",
                        color: "#374151",
                        fontSize: "14px",
                      }}
                    >
                      +57
                    </span>
                    <input
                      type="tel"
                      inputMode="numeric"
                      required
                      value={value}
                      onChange={(e) => setValue(e.target.value.replace(/\D/g, "").slice(0, 10))}
                      placeholder="3001234567"
                      style={{ ...inputStyle, borderRadius: "0 10px 10px 0" }}
                    />
                  </div>
                ) : (
                  <input
                    type="email"
                    required
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="tu@correo.com"
                    style={inputStyle}
                  />
                )}
              </div>

              {error && <ErrorBox>{error}</ErrorBox>}

              <SubmitBtn disabled={!valueValid || isLoading} loading={isLoading} label="Enviar código" />
            </form>
          ) : (
            <form onSubmit={handleConfirm} noValidate>
              <p style={{ fontFamily: '"Hepta Slab", serif', color: "#374151", fontSize: "14px", lineHeight: 1.6, marginBottom: "20px" }}>
                Enviamos un código de verificación a{" "}
                <strong>{channel === "phone" ? `+57 ${value}` : value}</strong>. Ingrésalo para confirmar la eliminación.
              </p>

              <div style={{ marginBottom: "20px" }}>
                <label style={labelStyle}>
                  Código de verificación <span style={{ color: "#FF3B47" }}>*</span>
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="123456"
                  style={{ ...inputStyle, letterSpacing: "0.3em", fontWeight: 600 }}
                />
              </div>

              <div style={{ marginBottom: "24px" }}>
                <label
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "10px",
                    cursor: "pointer",
                    fontSize: "13px",
                    fontFamily: '"Hepta Slab", serif',
                    color: "#374151",
                    lineHeight: 1.5,
                  }}
                >
                  <input
                    type="checkbox"
                    checked={confirmed}
                    onChange={(e) => setConfirmed(e.target.checked)}
                    style={{ marginTop: "2px", flexShrink: 0, width: "16px", height: "16px", accentColor: "#000" }}
                  />
                  Entiendo que esta acción es irreversible y mis datos personales serán eliminados permanentemente.
                </label>
              </div>

              {error && <ErrorBox>{error}</ErrorBox>}

              <SubmitBtn disabled={!code.trim() || !confirmed || isLoading} loading={isLoading} label="Eliminar mi cuenta" />

              <button
                type="button"
                onClick={() => {
                  setStep("request");
                  setCode("");
                  setConfirmed(false);
                  setError("");
                }}
                style={{
                  width: "100%",
                  marginTop: "12px",
                  padding: "10px",
                  background: "none",
                  border: "none",
                  color: "#6b7280",
                  fontFamily: '"Hepta Slab", serif',
                  fontSize: "13px",
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
              >
                Usar otro método
              </button>
            </form>
          )}
        </div>
      </div>

      <Footer />

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .spin { animation: spin 1s linear infinite; }
      `}</style>
    </main>
  );
}

function ErrorBox({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "16px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "10px", padding: "12px 16px" }}>
      <p style={{ fontFamily: '"Hepta Slab", serif', color: "#dc2626", fontSize: "13px" }}>{children}</p>
    </div>
  );
}

function SubmitBtn({ disabled, loading, label }: { disabled: boolean; loading: boolean; label: string }) {
  return (
    <button
      type="submit"
      disabled={disabled}
      style={{
        width: "100%",
        padding: "13px",
        borderRadius: "9999px",
        background: disabled ? "#d1d5db" : "#dc2626",
        color: "#fff",
        fontFamily: '"Clash Grotesk", sans-serif',
        fontWeight: 700,
        fontSize: "14px",
        border: "none",
        cursor: disabled ? "not-allowed" : "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
      }}
    >
      {loading && (
        <svg className="spin" width="16" height="16" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="4" />
          <path fill="#fff" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
      )}
      {loading ? "Procesando..." : label}
    </button>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "13px",
  fontWeight: 500,
  color: "#374151",
  marginBottom: "6px",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  border: "1px solid #d1d5db",
  borderRadius: "10px",
  fontSize: "14px",
  outline: "none",
  fontFamily: "inherit",
  boxSizing: "border-box",
  transition: "box-shadow 0.15s",
  background: "#fff",
};

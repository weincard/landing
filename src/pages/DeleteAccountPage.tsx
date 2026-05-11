import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageMeta } from "@/components/layout/PageMeta";

const REASONS = [
  "Ya no uso el servicio",
  "No me gustan los beneficios",
  "Es muy costoso",
  "Problemas técnicos",
  "Prefiero otra plataforma",
  "Otro motivo",
];

export function DeleteAccountPage() {
  const [email, setEmail] = useState("");
  const [reason, setReason] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !reason || !confirmed) return;

    setIsLoading(true);
    setError("");

    // TODO: wire to real delete-account API endpoint when available
    // Note: app uses OTP auth (no password) — consider using phone number instead of email+password
    await new Promise((r) => setTimeout(r, 1500));

    setIsLoading(false);
    setDone(true);
  }

  if (done) {
    return (
      <main style={{ minHeight: "100vh", background: "#f7f5f3" }}>
        <Header />
        <div
          style={{
            maxWidth: "560px",
            margin: "0 auto",
            padding: "80px 16px",
            textAlign: "center",
          }}
        >
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
            Solicitud enviada
          </h1>
          <p style={{ fontFamily: '"Hepta Slab", serif', color: "#6b7280", fontSize: "15px", lineHeight: 1.6 }}>
            Hemos recibido tu solicitud de eliminación de cuenta. Procesaremos tu solicitud en los próximos días hábiles.
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
            Esta acción es irreversible. Todos tus datos serán eliminados permanentemente.
          </p>
        </div>

        <div
          style={{
            background: "#fff",
            borderRadius: "20px",
            padding: "32px",
            boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
          }}
        >
          <form onSubmit={handleSubmit} noValidate>
            <div style={{ marginBottom: "16px" }}>
              <label style={labelStyle}>
                Correo electrónico <span style={{ color: "#FF3B47" }}>*</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@correo.com"
                style={inputStyle}
                onFocus={(e) => (e.currentTarget.style.boxShadow = "0 0 0 2px #FF3B47")}
                onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
              />
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label style={labelStyle}>
                Motivo <span style={{ color: "#FF3B47" }}>*</span>
              </label>
              <select
                required
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                style={{ ...inputStyle, appearance: "none", cursor: "pointer" }}
                onFocus={(e) => (e.currentTarget.style.boxShadow = "0 0 0 2px #FF3B47")}
                onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
              >
                <option value="">Selecciona un motivo...</option>
                {REASONS.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
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
                Entiendo que esta acción es irreversible y todos mis datos serán eliminados permanentemente.
              </label>
            </div>

            {error && (
              <div style={{ marginBottom: "16px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "10px", padding: "12px 16px" }}>
                <p style={{ fontFamily: '"Hepta Slab", serif', color: "#dc2626", fontSize: "13px" }}>{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !email.trim() || !reason || !confirmed}
              style={{
                width: "100%",
                padding: "13px",
                borderRadius: "9999px",
                background: isLoading || !email.trim() || !reason || !confirmed ? "#d1d5db" : "#dc2626",
                color: "#fff",
                fontFamily: '"Clash Grotesk", sans-serif',
                fontWeight: 700,
                fontSize: "14px",
                border: "none",
                cursor: isLoading || !email.trim() || !reason || !confirmed ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              {isLoading && (
                <svg className="spin" width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="4" />
                  <path fill="#fff" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
              )}
              {isLoading ? "Procesando..." : "Eliminar mi cuenta"}
            </button>
          </form>
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

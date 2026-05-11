import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageMeta } from "@/components/layout/PageMeta";
import { verifyCode } from "@/api/redemptions";
import { StatusCard } from "@/components/verificacion/StatusCard";
import type { RedemptionResult } from "@/types";

type Status = "idle" | "success" | "used" | "not_found" | "error";

export function VerificacionPage() {
  const [code, setCode] = useState("");
  const [totalPaid, setTotalPaid] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [result, setResult] = useState<RedemptionResult | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim()) return;

    setIsLoading(true);
    setStatus("idle");
    setResult(null);

    try {
      const paid = totalPaid.trim() ? parseFloat(totalPaid.replace(/\./g, "").replace(",", ".")) : undefined;
      const res = await verifyCode(code.trim(), paid);
      setStatus("success");
      setResult(res.data as RedemptionResult);
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number; data?: RedemptionResult } })?.response?.status;
      const data = (err as { response?: { data?: RedemptionResult } })?.response?.data;
      if (status === 400) {
        setStatus("used");
      } else if (status === 404) {
        setStatus("not_found");
      } else {
        setStatus("error");
      }
      setResult(data ?? null);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main style={{ minHeight: "100vh", background: "#f7f5f3" }}>
      <PageMeta title="Verificar código" description="Verifica un código de canje Weincard." path="/verificacion" />
      <Header />

      <div
        style={{
          maxWidth: "560px",
          margin: "0 auto",
          padding: "64px 16px",
        }}
      >
        <div style={{ marginBottom: "32px", textAlign: "center" }}>
          <h1
            style={{
              fontFamily: '"Clash Grotesk", sans-serif',
              fontWeight: 900,
              fontSize: "clamp(28px, 5vw, 40px)",
              color: "#000",
              letterSpacing: "-0.02em",
              marginBottom: "8px",
            }}
          >
            VERIFICAR CÓDIGO
          </h1>
          <p style={{ fontFamily: '"Hepta Slab", serif', color: "#6b7280", fontSize: "15px", lineHeight: 1.6 }}>
            Ingresa el código de canje para verificar si es válido.
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
                Código de canje <span style={{ color: "#FF3B47" }}>*</span>
              </label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="Ej: ABC123"
                style={inputStyle}
                onFocus={(e) => (e.currentTarget.style.boxShadow = "0 0 0 2px #FF3B47")}
                onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
              />
            </div>

            <div style={{ marginBottom: "24px" }}>
              <label style={labelStyle}>Total pagado (opcional)</label>
              <input
                type="text"
                inputMode="decimal"
                value={totalPaid}
                onChange={(e) => setTotalPaid(e.target.value)}
                placeholder="Ej: 50000"
                style={inputStyle}
                onFocus={(e) => (e.currentTarget.style.boxShadow = "0 0 0 2px #FF3B47")}
                onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !code.trim()}
              style={{
                width: "100%",
                padding: "13px",
                borderRadius: "9999px",
                background: isLoading || !code.trim() ? "#d1d5db" : "#000",
                color: "#fff",
                fontFamily: '"Clash Grotesk", sans-serif',
                fontWeight: 700,
                fontSize: "14px",
                border: "none",
                cursor: isLoading || !code.trim() ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              {isLoading && (
                <svg className="spin" width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="4" />
                  <path fill="#fff" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
              )}
              {isLoading ? "Verificando..." : "Verificar código"}
            </button>
          </form>

          {/* Status messages */}
          {status === "success" && (
            <StatusCard
              type="success"
              title="¡Código válido!"
              body="El código fue verificado exitosamente."
              detail={result}
            />
          )}
          {status === "used" && (
            <StatusCard type="warning" title="Código ya utilizado" body="Este código ya fue canjeado anteriormente." />
          )}
          {status === "not_found" && (
            <StatusCard type="error" title="Código no encontrado" body="No se encontró ningún código con ese valor." />
          )}
          {status === "error" && (
            <StatusCard type="error" title="Error" body={result?.message ?? "Ocurrió un error. Intenta de nuevo."} />
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
};


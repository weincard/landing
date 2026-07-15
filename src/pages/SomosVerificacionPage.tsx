import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageMeta } from "@/components/layout/PageMeta";
import { verifySomosCode, type SomosVerifyResult } from "@/api/memberships";

type Status = "idle" | "eligible" | "not_eligible" | "not_found" | "error";

/**
 * Verification page for the Somos partnership. The member's WhatsApp message
 * ends with "Código: <secret>-<userId>"; the Somos rep pastes that code here.
 * The check is stateless — the backend validates the shared secret and the
 * user's live plan eligibility, nothing is stored.
 */
export function SomosVerificacionPage() {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [result, setResult] = useState<SomosVerifyResult | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim()) return;

    setIsLoading(true);
    setStatus("idle");
    setResult(null);

    try {
      const { data } = await verifySomosCode(code.trim());
      setResult(data);
      setStatus(data.valid ? "eligible" : "not_eligible");
    } catch (err: unknown) {
      const httpStatus = (err as { response?: { status?: number } })?.response
        ?.status;
      setStatus(httpStatus === 404 ? "not_found" : "error");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main style={{ minHeight: "100vh", background: "#f7f5f3" }}>
      <PageMeta
        title="Verificación Somos"
        description="Verifica la elegibilidad de un miembro Weincard para el beneficio Somos."
        path="/verificacion-somos"
      />
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
            VERIFICACIÓN SOMOS
          </h1>
          <p
            style={{
              fontFamily: '"Hepta Slab", serif',
              color: "#6b7280",
              fontSize: "15px",
              lineHeight: 1.6,
            }}
          >
            Ingresa el código que aparece al final del mensaje de WhatsApp para
            verificar si el miembro es elegible para el beneficio.
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
          {status === "eligible" && result && (
            <ResultCard
              type="success"
              title="¡Miembro elegible!"
              body="Esta persona tiene una membresía activa con acceso al beneficio Somos."
              result={result}
            />
          )}
          {status === "not_eligible" && result && (
            <ResultCard
              type="warning"
              title="No elegible"
              body="Esta persona existe pero no tiene una membresía activa en un plan con acceso al beneficio."
              result={result}
            />
          )}
          {status === "not_found" && (
            <ResultCard
              type="error"
              title="Código no válido"
              body="No se encontró ningún código con ese valor. Verifica que lo copiaste completo."
            />
          )}
          {status === "error" && (
            <ResultCard
              type="error"
              title="Error"
              body="Ocurrió un error. Intenta de nuevo."
            />
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div style={{ marginBottom: "24px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: 500,
                  color: "#374151",
                  marginBottom: "6px",
                }}
              >
                Código <span style={{ color: "#FF3B47" }}>*</span>
              </label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  border: "1px solid #d1d5db",
                  borderRadius: "10px",
                  fontSize: "14px",
                  outline: "none",
                  fontFamily: "inherit",
                  boxSizing: "border-box",
                  transition: "box-shadow 0.15s",
                }}
                onFocus={(e) =>
                  (e.currentTarget.style.boxShadow = "0 0 0 2px #FF3B47")
                }
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
              }}
            >
              {isLoading ? "Verificando..." : "Verificar código"}
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </main>
  );
}

const resultColors = {
  success: {
    bg: "#f0fdf4",
    border: "#bbf7d0",
    title: "#166534",
    body: "#15803d",
  },
  warning: {
    bg: "#fffbeb",
    border: "#fde68a",
    title: "#92400e",
    body: "#78350f",
  },
  error: {
    bg: "#fef2f2",
    border: "#fecaca",
    title: "#991b1b",
    body: "#dc2626",
  },
};

function ResultCard({
  type,
  title,
  body,
  result,
}: {
  type: "success" | "warning" | "error";
  title: string;
  body: string;
  result?: SomosVerifyResult;
}) {
  const c = resultColors[type];
  return (
    <div
      style={{
        marginBottom: "20px",
        borderRadius: "12px",
        border: `1px solid ${c.border}`,
        background: c.bg,
        padding: "16px 20px",
      }}
    >
      <p
        style={{
          fontFamily: '"Clash Grotesk", sans-serif',
          fontWeight: 700,
          fontSize: "15px",
          color: c.title,
          marginBottom: "4px",
        }}
      >
        {title}
      </p>
      <p
        style={{
          fontFamily: '"Hepta Slab", serif',
          fontSize: "13px",
          color: c.body,
          lineHeight: 1.5,
        }}
      >
        {body}
      </p>
      {result && (
        <div
          style={{
            marginTop: "12px",
            fontFamily: '"Hepta Slab", serif',
            fontSize: "13px",
            color: c.title,
            lineHeight: 1.7,
          }}
        >
          {result.user.name && (
            <div>
              <strong>Miembro:</strong> {result.user.name}
            </div>
          )}
          {/* Compare against the WhatsApp sender's number to confirm the code
              belongs to the person messaging. */}
          {result.user.maskedPhone && (
            <div>
              <strong>Teléfono:</strong> {result.user.maskedPhone}
            </div>
          )}
          {result.plan && (
            <div>
              <strong>Plan:</strong> {result.plan.name}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

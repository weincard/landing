import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageMeta } from "@/components/layout/PageMeta";
import { type PlazaVerifyRedemption } from "@/api/plaza";
import { useVerifyPlazaCode } from "@/hooks/usePlazaActive";

type Status =
  | "loading"
  | "active" // verified now or already, user active
  | "inactive" // user membership not active
  | "expired"
  | "not_found"
  | "missing" // no ?code= in URL
  | "error";

// Public page the plaza stand opens from the user's QR. It auto-verifies the
// code in ?code= on mount (no staff input — "auto-create on scan"): a fresh code
// for an active member is completed immediately; reopening shows the prior result.
export function PlazaVerificacionPage() {
  const [params] = useSearchParams();
  const code = params.get("code")?.trim() ?? "";

  // `code` comes from the URL and never changes during the page's life, so the
  // "missing" state can be derived from the initial value — no setState-in-effect.
  const [status, setStatus] = useState<Status>(code ? "loading" : "missing");
  const [already, setAlready] = useState(false);
  const [redemption, setRedemption] = useState<PlazaVerifyRedemption | null>(
    null,
  );
  const verify = useVerifyPlazaCode();

  useEffect(() => {
    if (!code) return;
    let cancelled = false;
    verify
      .mutateAsync(code)
      .then((data) => {
        if (cancelled) return;
        setAlready(Boolean(data.alreadyVerified));
        setRedemption(data.redemption ?? null);
        setStatus(data.redemption && data.redemption.active ? "active" : "inactive");
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        const httpStatus = (
          err as {
            response?: { status?: number; data?: { expired?: boolean } };
          }
        )?.response?.status;
        const expired = (err as { response?: { data?: { expired?: boolean } } })
          ?.response?.data?.expired;
        if (expired) setStatus("expired");
        else if (httpStatus === 404) setStatus("not_found");
        else setStatus("error");
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  const accent =
    status === "active"
      ? "#16a34a"
      : status === "loading"
        ? "#6b7280"
        : "#FF3B47";

  return (
    <main style={{ minHeight: "100vh", background: "#f7f5f3" }}>
      <PageMeta
        title="Verificar Weincard — La Plaza"
        description="Verifica la membresía Weincard en La Plaza de Wein."
        path="/plaza/verificacion"
      />
      <Header />

      <div
        style={{ maxWidth: "560px", margin: "0 auto", padding: "64px 16px" }}
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
            LA PLAZA DE WEIN
          </h1>
          <p
            style={{
              fontFamily: '"Hepta Slab", serif',
              color: "#6b7280",
              fontSize: "15px",
              lineHeight: 1.6,
            }}
          >
            Verificación de membresía del usuario.
          </p>
        </div>

        <div
          style={{
            background: "#fff",
            borderRadius: "20px",
            padding: "32px",
            boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
            borderTop: `4px solid ${accent}`,
          }}
        >
          {status === "loading" && (
            <Centered>
              <Spinner />
              <Title>Verificando…</Title>
            </Centered>
          )}

          {status === "active" && (
            <Centered>
              <Badge color="#16a34a" symbol="✓" />
              <Title>{already ? "Usuario activo" : "Usuario activo"}</Title>
              <DetailRows redemption={redemption} />
            </Centered>
          )}

          {status === "inactive" && (
            <Centered>
              <Badge color="#FF3B47" symbol="✕" />
              <Title>Membresía no activa</Title>
              <Body>
                El usuario no tiene una membresía activa. No se registró el
                canje.
              </Body>
              <DetailRows redemption={redemption} />
            </Centered>
          )}

          {status === "expired" && (
            <Centered>
              <Badge color="#FF3B47" symbol="!" />
              <Title>Código expirado</Title>
              <Body>
                Pide al usuario que genere un código nuevo desde la app.
              </Body>
            </Centered>
          )}

          {status === "not_found" && (
            <Centered>
              <Badge color="#FF3B47" symbol="✕" />
              <Title>Código no encontrado</Title>
              <Body>El código del QR no es válido.</Body>
            </Centered>
          )}

          {status === "missing" && (
            <Centered>
              <Badge color="#FF3B47" symbol="?" />
              <Title>Falta el código</Title>
              <Body>
                Escanea el QR desde la app del usuario para verificar.
              </Body>
            </Centered>
          )}

          {status === "error" && (
            <Centered>
              <Badge color="#FF3B47" symbol="!" />
              <Title>Ocurrió un error</Title>
              <Body>Intenta de nuevo en un momento.</Body>
            </Centered>
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

function DetailRows({
  redemption,
}: {
  redemption: PlazaVerifyRedemption | null;
}) {
  if (!redemption) return null;
  return (
    <div
      style={{
        marginTop: "20px",
        width: "100%",
        borderTop: "1px solid #eee",
        paddingTop: "16px",
      }}
    >
      <Row label="Usuario" value={redemption.user?.name ?? "—"} />
      <Row label="Teléfono" value={redemption.user?.phone ?? "—"} />
      <Row label="Stand" value={redemption.merchant?.name ?? "—"} />
      {redemption.edition?.name && (
        <Row label="Feria" value={redemption.edition.name} />
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "6px 0",
        fontFamily: '"Hepta Slab", serif',
      }}
    >
      <span style={{ color: "#6b7280", fontSize: "13px" }}>{label}</span>
      <span style={{ color: "#000", fontSize: "14px", fontWeight: 600 }}>
        {value}
      </span>
    </div>
  );
}

function Centered({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      {children}
    </div>
  );
}

function Badge({ color, symbol }: { color: string; symbol: string }) {
  return (
    <div
      style={{
        width: 64,
        height: 64,
        borderRadius: "50%",
        background: color,
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "32px",
        fontWeight: 700,
        marginBottom: "16px",
      }}
    >
      {symbol}
    </div>
  );
}

function Title({ children }: { children: React.ReactNode }) {
  return (
    <h2
      style={{
        fontFamily: '"Clash Grotesk", sans-serif',
        fontWeight: 800,
        fontSize: "22px",
        color: "#000",
        margin: 0,
      }}
    >
      {children}
    </h2>
  );
}

function Body({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontFamily: '"Hepta Slab", serif',
        color: "#6b7280",
        fontSize: "14px",
        lineHeight: 1.6,
        marginTop: "8px",
      }}
    >
      {children}
    </p>
  );
}

function Spinner() {
  return (
    <svg
      className="spin"
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      style={{ marginBottom: "16px" }}
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="rgba(0,0,0,0.15)"
        strokeWidth="4"
      />
      <path fill="#000" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  );
}

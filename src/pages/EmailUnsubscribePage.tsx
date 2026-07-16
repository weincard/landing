import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageMeta } from "@/components/layout/PageMeta";
import { resubscribeEmail, unsubscribeEmail } from "@/api/notifications";

type Status = "idle" | "unsubscribed" | "resubscribed";

function extractMessage(err: unknown): string {
  const message = (err as { response?: { data?: { message?: string } } })
    ?.response?.data?.message;
  return message || "El enlace no es válido o expiró.";
}

/**
 * Email-unsubscribe landing page. The token comes from the unsubscribe link in
 * every notification email (?token=...). The unsubscribe is deliberately NOT
 * fired on page load — email scanners prefetch links, so it must require an
 * explicit button click.
 */
export function EmailUnsubscribePage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<Status>("idle");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleUnsubscribe() {
    if (!token) return;
    setIsLoading(true);
    setError(null);
    try {
      await unsubscribeEmail(token);
      setStatus("unsubscribed");
    } catch (err: unknown) {
      setError(extractMessage(err));
    } finally {
      setIsLoading(false);
    }
  }

  async function handleResubscribe() {
    if (!token) return;
    setIsLoading(true);
    setError(null);
    try {
      await resubscribeEmail(token);
      setStatus("resubscribed");
    } catch (err: unknown) {
      setError(extractMessage(err));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main style={{ minHeight: "100vh", background: "#f7f5f3" }}>
      <PageMeta
        title="Cancelar suscripción de correos"
        description="Administra tu suscripción a los correos de notificaciones de Weincard."
        path="/email/desuscribirse"
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
            CORREOS DE WEINCARD
          </h1>
        </div>

        <div
          style={{
            background: "#fff",
            borderRadius: "20px",
            padding: "32px",
            boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
            textAlign: "center",
          }}
        >
          {!token ? (
            <>
              <MessageCard
                type="error"
                title="Enlace inválido o incompleto"
                body="Este enlace no contiene la información necesaria. Abre el enlace directamente desde el correo que recibiste."
              />
              <Link
                to="/"
                style={{
                  display: "inline-block",
                  fontFamily: '"Clash Grotesk", sans-serif',
                  fontWeight: 700,
                  fontSize: "14px",
                  color: "#000",
                  textDecoration: "underline",
                }}
              >
                Volver al inicio
              </Link>
            </>
          ) : status === "unsubscribed" ? (
            <>
              <MessageCard
                type="success"
                title="Listo, no recibirás más correos de notificaciones."
                body="Puedes volver a suscribirte en cualquier momento. Las notificaciones dentro de la app no se ven afectadas."
              />
              {error && <MessageCard type="error" title="Error" body={error} />}
              <button
                type="button"
                onClick={handleResubscribe}
                disabled={isLoading}
                style={{
                  width: "100%",
                  padding: "13px",
                  borderRadius: "9999px",
                  background: "#fff",
                  color: isLoading ? "#9ca3af" : "#000",
                  fontFamily: '"Clash Grotesk", sans-serif',
                  fontWeight: 700,
                  fontSize: "14px",
                  border: "1px solid #000",
                  cursor: isLoading ? "not-allowed" : "pointer",
                }}
              >
                {isLoading ? "Enviando..." : "¿Fue un error? Volver a suscribirme"}
              </button>
            </>
          ) : status === "resubscribed" ? (
            <MessageCard
              type="success"
              title="Suscripción restaurada."
              body="Seguirás recibiendo los correos de notificaciones de Weincard."
            />
          ) : (
            <>
              <h2
                style={{
                  fontFamily: '"Clash Grotesk", sans-serif',
                  fontWeight: 700,
                  fontSize: "20px",
                  color: "#000",
                  marginBottom: "12px",
                }}
              >
                Cancelar suscripción de correos
              </h2>
              <p
                style={{
                  fontFamily: '"Hepta Slab", serif',
                  color: "#6b7280",
                  fontSize: "15px",
                  lineHeight: 1.6,
                  marginBottom: "24px",
                }}
              >
                Si confirmas, dejarás de recibir correos de notificaciones de
                Weincard. Las notificaciones push y dentro de la app no se ven
                afectadas.
              </p>
              {error && <MessageCard type="error" title="Error" body={error} />}
              <button
                type="button"
                onClick={handleUnsubscribe}
                disabled={isLoading}
                style={{
                  width: "100%",
                  padding: "13px",
                  borderRadius: "9999px",
                  background: isLoading ? "#d1d5db" : "#000",
                  color: "#fff",
                  fontFamily: '"Clash Grotesk", sans-serif',
                  fontWeight: 700,
                  fontSize: "14px",
                  border: "none",
                  cursor: isLoading ? "not-allowed" : "pointer",
                }}
              >
                {isLoading ? "Cancelando..." : "Cancelar suscripción"}
              </button>
            </>
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
}

const messageColors = {
  success: {
    bg: "#f0fdf4",
    border: "#bbf7d0",
    title: "#166534",
    body: "#15803d",
  },
  error: {
    bg: "#fef2f2",
    border: "#fecaca",
    title: "#991b1b",
    body: "#dc2626",
  },
};

function MessageCard({
  type,
  title,
  body,
}: {
  type: "success" | "error";
  title: string;
  body: string;
}) {
  const c = messageColors[type];
  return (
    <div
      style={{
        marginBottom: "20px",
        borderRadius: "12px",
        border: `1px solid ${c.border}`,
        background: c.bg,
        padding: "16px 20px",
        textAlign: "left",
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
    </div>
  );
}

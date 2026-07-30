import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageMeta } from "@/components/layout/PageMeta";
import {
  getConflictInfo,
  resolveConflict,
  type ConflictAction,
  type ConflictInfo,
} from "@/api/b2bConflicts";

const clash = '"Clash Grotesk", sans-serif';
const hepta = '"Hepta Slab", serif';

function extractMessage(err: unknown): string {
  const message = (err as { response?: { data?: { message?: string } } })
    ?.response?.data?.message;
  return message || "El enlace no es válido o expiró.";
}

/**
 * B2b import-conflict resolution page. A company tried to add this person to
 * its WeinCard membership, but the email in the CSV already belongs to an
 * existing account with a DIFFERENT phone. The tokenized link (30 days) lets
 * them choose:
 *   - "attach": that account is mine → join the org with the existing account
 *     (its registered phone is immutable — shown masked).
 *   - "create": not my account / shared inbox → create a fresh account with
 *     the phone the company provided, without the disputed email.
 */
export function ConflictoResolverPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [info, setInfo] = useState<ConflictInfo | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selected, setSelected] = useState<ConflictAction | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [done, setDone] = useState<ConflictAction | null>(null);

  useEffect(() => {
    if (!token) {
      setIsLoading(false);
      return;
    }
    getConflictInfo(token)
      .then((res) => setInfo(res.data))
      .catch((err: unknown) => setLoadError(extractMessage(err)))
      .finally(() => setIsLoading(false));
  }, [token]);

  async function handleConfirm() {
    if (!token || !selected) return;
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await resolveConflict(token, selected);
      setDone(selected);
    } catch (err: unknown) {
      setSubmitError(extractMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main style={{ minHeight: "100vh", background: "#f7f5f3" }}>
      <PageMeta
        title="Resolver conflicto de cuenta"
        description="Resuelve el conflicto para unirte a la membresía corporativa de tu organización en Weincard."
        path="/resolver-conflicto"
      />
      <Header />

      <div style={{ maxWidth: "560px", margin: "0 auto", padding: "64px 16px" }}>
        <div style={{ marginBottom: "32px", textAlign: "center" }}>
          <h1
            style={{
              fontFamily: clash,
              fontWeight: 900,
              fontSize: "clamp(28px, 5vw, 40px)",
              color: "#000",
              letterSpacing: "-0.02em",
              marginBottom: "8px",
            }}
          >
            RESUELVE TU CUENTA
          </h1>
        </div>

        <div
          style={{
            background: "#fff",
            borderRadius: "20px",
            padding: "32px",
            boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
          }}
        >
          {!token || loadError ? (
            <div style={{ textAlign: "center" }}>
              <MessageCard
                type="error"
                title="Enlace inválido o expirado"
                body={
                  loadError ??
                  "Este enlace no contiene la información necesaria. Ábrelo directamente desde el correo que recibiste, o pide a tu organización que reenvíe la invitación."
                }
              />
              <Link
                to="/"
                style={{
                  display: "inline-block",
                  fontFamily: clash,
                  fontWeight: 700,
                  fontSize: "14px",
                  color: "#000",
                  textDecoration: "underline",
                }}
              >
                Volver al inicio
              </Link>
            </div>
          ) : isLoading ? (
            <p
              style={{
                fontFamily: hepta,
                color: "#6b7280",
                fontSize: "15px",
                textAlign: "center",
              }}
            >
              Cargando...
            </p>
          ) : info?.status === "resolved" ? (
            <MessageCard
              type="success"
              title="Este conflicto ya fue resuelto."
              body="No necesitas hacer nada más. Si tienes dudas, escríbenos a info@weincard.com."
            />
          ) : done === "attach" ? (
            <MessageCard
              type="success"
              title="¡Listo! Tu cuenta ya hace parte de la organización."
              body={`Tu membresía de ${info?.orgName ?? "tu organización"} quedó activa en tu cuenta actual. Ingresa a la app de WeinCard con tu número de siempre para disfrutar tus beneficios.`}
            />
          ) : done === "create" ? (
            <MessageCard
              type="success"
              title="¡Listo! Creamos tu nueva cuenta."
              body={`Tu membresía de ${info?.orgName ?? "tu organización"} quedó activa en una cuenta nueva con el celular ${info?.csvPhone}. Descarga la app de WeinCard e ingresa con ese número; podrás completar tus datos (incluido tu correo) desde tu perfil.`}
            />
          ) : (
            <>
              <p
                style={{
                  fontFamily: hepta,
                  color: "#374151",
                  fontSize: "15px",
                  lineHeight: 1.6,
                  marginBottom: "20px",
                }}
              >
                <strong>{info?.orgName}</strong> quiere agregarte
                {info?.csvName ? ` (${info.csvName})` : ""} a su membresía de
                WeinCard, pero tu correo ya está asociado a una cuenta
                registrada con el celular terminado en{" "}
                <strong>{info?.maskedExistingPhone}</strong>, distinto al que
                entregó la organización ({info?.csvPhone}).
              </p>
              <p
                style={{
                  fontFamily: hepta,
                  color: "#374151",
                  fontSize: "15px",
                  lineHeight: 1.6,
                  marginBottom: "24px",
                }}
              >
                ¿Esa cuenta es tuya?
              </p>

              <OptionButton
                active={selected === "attach"}
                title={`Sí, la cuenta ***${(info?.maskedExistingPhone ?? "").replace(/\D/g, "")} es mía`}
                body="Activaremos la membresía de la organización en tu cuenta actual. Seguirás ingresando con tu número de siempre."
                onClick={() => {
                  setSelected("attach");
                  setSubmitError(null);
                }}
              />
              <OptionButton
                active={selected === "create"}
                title="No, esa cuenta no es mía"
                body={`Crearemos una cuenta nueva con el celular ${info?.csvPhone} (sin este correo) y ahí quedará tu membresía. Podrás completar tus datos al ingresar.`}
                onClick={() => {
                  setSelected("create");
                  setSubmitError(null);
                }}
              />

              {submitError && (
                <MessageCard type="error" title="Error" body={submitError} />
              )}

              <button
                type="button"
                onClick={handleConfirm}
                disabled={!selected || isSubmitting}
                style={{
                  width: "100%",
                  marginTop: "8px",
                  padding: "13px",
                  borderRadius: "9999px",
                  background: !selected || isSubmitting ? "#d1d5db" : "#000",
                  color: "#fff",
                  fontFamily: clash,
                  fontWeight: 700,
                  fontSize: "14px",
                  border: "none",
                  cursor: !selected || isSubmitting ? "not-allowed" : "pointer",
                }}
              >
                {isSubmitting ? "Enviando..." : "Confirmar"}
              </button>
            </>
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
}

function OptionButton({
  active,
  title,
  body,
  onClick,
}: {
  active: boolean;
  title: string;
  body: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: "block",
        width: "100%",
        textAlign: "left",
        marginBottom: "12px",
        borderRadius: "14px",
        border: active ? "2px solid #000" : "1px solid #e5e7eb",
        background: active ? "#f7f5f3" : "#fff",
        padding: "16px 18px",
        cursor: "pointer",
      }}
    >
      <span
        style={{
          display: "block",
          fontFamily: clash,
          fontWeight: 700,
          fontSize: "15px",
          color: "#000",
          marginBottom: "4px",
        }}
      >
        {title}
      </span>
      <span
        style={{
          display: "block",
          fontFamily: hepta,
          fontSize: "13px",
          color: "#6b7280",
          lineHeight: 1.5,
        }}
      >
        {body}
      </span>
    </button>
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
          fontFamily: clash,
          fontWeight: 700,
          fontSize: "15px",
          color: c.title,
          marginBottom: "4px",
        }}
      >
        {title}
      </p>
      <p style={{ fontFamily: hepta, fontSize: "13px", color: c.body, lineHeight: 1.5 }}>
        {body}
      </p>
    </div>
  );
}

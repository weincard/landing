import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageMeta } from "@/components/layout/PageMeta";
import { Loader } from "@mantine/core";
import { useAuth } from "@/context/AuthContext";
import { useCreateCheckout } from "@/hooks/useMembership";
import { useUpdateUser } from "@/hooks/useUsers";
import { getMe } from "@/api/auth";
import { useEmailVerificationGate } from "@/hooks/useEmailVerificationGate";
import type { PlanKey } from "@/types";

const PLANS = [
  {
    key: "monthly" as PlanKey,
    label: "MENSUAL",
    price: "$18.900 COP/MES",
    priceNote: "por mes",
    description: "Accede a descuentos y beneficios exclusivos en los mejores restaurantes mes a mes.",
    recommended: false,
  },
  {
    key: "yearly" as PlanKey,
    label: "ANUAL",
    price: "$189.000 COP",
    priceNote: "por año — ahorra 2 meses",
    description: "El mejor precio para quienes salen seguido. Dos meses gratis frente al plan mensual.",
    recommended: true,
  },
];

export function PlanesPage() {
  const { user, isLoggedIn, hasMembership, activePlanKey, membershipName, membershipActiveUntil, refreshUser } =
    useAuth();
  const gate = useEmailVerificationGate();
  const checkout = useCreateCheckout();
  const updateMutation = useUpdateUser();
  const navigate = useNavigate();

  const [purchasing, setPurchasing] = useState(false);
  const [checkoutOpened, setCheckoutOpened] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Email capture for logged-in users without email
  const [pendingPlan, setPendingPlan] = useState<PlanKey | null>(null);
  const [emailInput, setEmailInput] = useState("");
  const [savingEmail, setSavingEmail] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);

  async function startCheckout(planKey: PlanKey, email: string) {
    // Email must be verified before Treli checkout — gate opens the verify modal
    // (resuming into checkout) and we stop here when it does.
    if (gate(planKey)) {
      setPendingPlan(null);
      return;
    }
    setError(null);
    setPurchasing(true);
    setCheckoutOpened(false);
    try {
      const data = await checkout.mutateAsync({ email, plan: planKey });
      if (data?.url) {
        window.open(data.url, "_blank", "noopener,noreferrer");
        setCheckoutOpened(true);
        setPendingPlan(null);
      } else {
        throw new Error("No se recibió la URL de pago.");
      }
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg ?? "No se pudo iniciar el proceso de pago.");
    } finally {
      setPurchasing(false);
    }
  }

  async function handleSelectPlan(planKey: PlanKey) {
    if (activePlanKey === planKey) return;

    // Unauthenticated users go through the unified auth funnel, which lands on
    // its own Treli checkout prompt with the chosen plan preselected.
    if (!isLoggedIn) {
      navigate(`/registro?plan=${planKey}&next=/app/card`);
      return;
    }

    // Re-fetch user to get latest email
    let latestEmail = user?.email ?? undefined;
    try {
      const me = await getMe();
      latestEmail = me.email ?? undefined;
    } catch {
      // Use cached email if refetch fails
    }

    if (!latestEmail) {
      setPendingPlan(planKey);
      setEmailInput("");
      setEmailError(null);
      return;
    }

    await startCheckout(planKey, latestEmail);
  }

  async function handleSaveEmailAndCheckout(e: React.FormEvent) {
    e.preventDefault();
    if (!emailInput.trim() || !pendingPlan) return;
    setEmailError(null);
    setSavingEmail(true);
    try {
      const me = await getMe();
      const userId = me.id;
      await updateMutation.mutateAsync({
        id: userId,
        data: { email: emailInput.trim() },
      });
      await refreshUser();
      await startCheckout(pendingPlan, emailInput.trim());
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setEmailError(msg ?? "Error al guardar el correo.");
    } finally {
      setSavingEmail(false);
    }
  }

  return (
    <main style={{ minHeight: "100vh", background: "#f7f5f3" }}>
      <PageMeta
        title="Planes y membresías"
        description="Elige tu plan Weincard y accede a descuentos exclusivos en los mejores restaurantes de Medellín. Mensual o anual."
        path="/planes"
      />
      <Header />

      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          padding: "64px 16px",
        }}
      >
        {/* Title */}
        <div style={{ textAlign: "center", marginBottom: "56px" }}>
          <h1
            style={{
              fontFamily: '"Clash Grotesk", sans-serif',
              fontWeight: 900,
              fontSize: "clamp(32px, 6vw, 48px)",
              color: "#000",
              letterSpacing: "-0.02em",
              marginBottom: "16px",
            }}
          >
            ELIGE TU PLAN
          </h1>
          <p
            style={{
              fontFamily: '"Hepta Slab", serif',
              color: "#6b7280",
              fontSize: "17px",
              lineHeight: 1.6,
            }}
          >
            Multiplica tus salidas a comer. Cancela cuando quieras.
          </p>
        </div>

        {/* Active membership banner */}
        {hasMembership && (
          <div
            style={{
              marginBottom: "48px",
              borderRadius: "16px",
              background: "#000",
              color: "#fff",
              padding: "20px 24px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
              <div>
                <p
                  style={{
                    fontFamily: '"Clash Grotesk", sans-serif',
                    fontWeight: 700,
                    fontSize: "17px",
                    marginBottom: "4px",
                  }}
                >
                  Tienes una membresía activa: {membershipName}
                </p>
                {membershipActiveUntil && (
                  <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)", fontFamily: '"Hepta Slab", serif' }}>
                    Vigente hasta{" "}
                    {new Date(membershipActiveUntil).toLocaleDateString("es-CO", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                )}
              </div>
              <span
                style={{
                  background: "#FF3B47",
                  color: "#fff",
                  fontSize: "11px",
                  fontFamily: '"Clash Grotesk", sans-serif',
                  fontWeight: 700,
                  padding: "4px 16px",
                  borderRadius: "9999px",
                  letterSpacing: "0.05em",
                  flexShrink: 0,
                }}
              >
                ACTIVA
              </span>
            </div>
          </div>
        )}

        {/* Checkout success banner */}
        {checkoutOpened && (
          <div
            style={{
              marginBottom: "40px",
              borderRadius: "16px",
              border: "1px solid #bbf7d0",
              background: "#f0fdf4",
              padding: "20px 24px",
            }}
          >
            <p
              style={{
                fontFamily: '"Clash Grotesk", sans-serif',
                fontWeight: 700,
                color: "#166534",
                fontSize: "15px",
                marginBottom: "4px",
              }}
            >
              Pasarela de pago abierta en otra pestaña
            </p>
            <p style={{ fontFamily: '"Hepta Slab", serif', color: "#15803d", fontSize: "13px", lineHeight: 1.6 }}>
              Si ya completaste el pago,{" "}
              <button
                onClick={() => refreshUser()}
                style={{
                  background: "none",
                  border: "none",
                  textDecoration: "underline",
                  fontWeight: 700,
                  cursor: "pointer",
                  color: "inherit",
                  fontFamily: "inherit",
                  fontSize: "inherit",
                  padding: 0,
                }}
              >
                actualiza tu membresía
              </button>{" "}
              para reflejar los cambios.
            </p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div
            style={{
              marginBottom: "40px",
              borderRadius: "16px",
              border: "1px solid #fecaca",
              background: "#fef2f2",
              padding: "16px 24px",
            }}
          >
            <p style={{ fontFamily: '"Hepta Slab", serif', color: "#dc2626", fontSize: "13px" }}>{error}</p>
          </div>
        )}

        {/* Email capture */}
        {pendingPlan && (
          <div
            style={{
              marginBottom: "40px",
              borderRadius: "16px",
              border: "1px solid #fde68a",
              background: "#fffbeb",
              padding: "24px",
            }}
          >
            <p
              style={{
                fontFamily: '"Clash Grotesk", sans-serif',
                fontWeight: 700,
                color: "#92400e",
                fontSize: "15px",
                marginBottom: "4px",
              }}
            >
              Necesitamos tu correo electrónico
            </p>
            <p style={{ fontFamily: '"Hepta Slab", serif', color: "#78350f", fontSize: "13px", marginBottom: "16px", lineHeight: 1.6 }}>
              Para procesar el pago del{" "}
              <strong>Plan {pendingPlan === "monthly" ? "Mensual" : "Anual"}</strong>{" "}
              necesitamos un correo.
            </p>
            <form
              onSubmit={handleSaveEmailAndCheckout}
              style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}
            >
              <input
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="tu@correo.com"
                style={{
                  flex: 1,
                  minWidth: "200px",
                  padding: "12px 14px",
                  border: "1px solid #fde68a",
                  borderRadius: "12px",
                  fontSize: "14px",
                  outline: "none",
                  fontFamily: "inherit",
                }}
              />
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  type="submit"
                  disabled={savingEmail || !emailInput.trim()}
                  style={{
                    padding: "12px 20px",
                    borderRadius: "12px",
                    background: savingEmail || !emailInput.trim() ? "#d1d5db" : "#000",
                    color: "#fff",
                    fontFamily: '"Clash Grotesk", sans-serif',
                    fontWeight: 700,
                    fontSize: "13px",
                    border: "none",
                    cursor: savingEmail || !emailInput.trim() ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  {savingEmail && <Loader size={14} color="white" />}
                  {savingEmail ? "Guardando..." : "Guardar y pagar"}
                </button>
                <button
                  type="button"
                  onClick={() => setPendingPlan(null)}
                  style={{
                    padding: "12px 16px",
                    borderRadius: "12px",
                    border: "1px solid #d1d5db",
                    background: "none",
                    fontSize: "13px",
                    fontFamily: '"Hepta Slab", serif',
                    cursor: "pointer",
                  }}
                >
                  Cancelar
                </button>
              </div>
            </form>
            {emailError && (
              <p style={{ marginTop: "12px", fontSize: "13px", color: "#dc2626", fontFamily: '"Hepta Slab", serif' }}>
                {emailError}
              </p>
            )}
          </div>
        )}

        {/* Plan cards */}
        <div className="plans-grid">
          {PLANS.map((plan) => (
            <div
              key={plan.key}
              style={{
                borderRadius: "24px",
                padding: "48px 32px",
                display: "flex",
                flexDirection: "column",
                gap: "24px",
                background:
                  "linear-gradient(to top, rgba(255,255,255,0.4), rgba(255,255,255,0.1), transparent)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#000",
              }}
            >
              {plan.recommended && (
                <span
                  style={{
                    display: "inline-block",
                    alignSelf: "flex-start",
                    fontSize: "11px",
                    fontFamily: '"Clash Grotesk", sans-serif',
                    fontWeight: 700,
                    padding: "4px 14px",
                    borderRadius: "9999px",
                    background: "#FF3B47",
                    color: "#fff",
                    letterSpacing: "0.08em",
                  }}
                >
                  RECOMENDADO
                </span>
              )}
              <div>
                <h2
                  style={{
                    fontFamily: '"Hepta Slab", serif',
                    fontWeight: 300,
                    fontSize: "clamp(22px, 3vw, 28px)",
                    lineHeight: 1.2,
                  }}
                >
                  <span
                    style={{
                      fontFamily: '"Clash Grotesk", sans-serif',
                      fontWeight: 700,
                      display: "block",
                    }}
                  >
                    PLAN
                  </span>
                  {plan.label}
                </h2>
              </div>
              <div>
                <p
                  style={{
                    fontFamily: '"Hepta Slab", serif',
                    fontSize: "clamp(20px, 3vw, 26px)",
                  }}
                >
                  {plan.price}
                </p>
                <p
                  style={{
                    fontSize: "13px",
                    color: "rgba(0,0,0,0.5)",
                    fontFamily: '"Hepta Slab", serif',
                    marginTop: "4px",
                  }}
                >
                  {plan.priceNote}
                </p>
              </div>
              <p
                style={{
                  fontFamily: '"Hepta Slab", serif',
                  fontSize: "14px",
                  lineHeight: 1.6,
                  flex: 1,
                  color: "#000",
                }}
              >
                {plan.description}
              </p>
              <button
                type="button"
                onClick={() => handleSelectPlan(plan.key)}
                disabled={purchasing || activePlanKey === plan.key}
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "12px",
                  background: activePlanKey === plan.key ? "#e5e7eb" : "#fff",
                  color: "#000",
                  fontFamily: '"Clash Grotesk", sans-serif',
                  fontWeight: 700,
                  fontSize: "13px",
                  border: "none",
                  cursor: activePlanKey === plan.key || purchasing ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  transition: "transform 0.15s, background 0.15s",
                  opacity: activePlanKey === plan.key ? 0.6 : 1,
                }}
                onMouseEnter={(e) => {
                  if (activePlanKey !== plan.key && !purchasing) {
                    e.currentTarget.style.background = "#000";
                    e.currentTarget.style.color = "#fff";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = activePlanKey === plan.key ? "#e5e7eb" : "#fff";
                  e.currentTarget.style.color = "#000";
                }}
              >
                {purchasing && <Loader size={14} color="black" />}
                {activePlanKey === plan.key
                  ? "Plan actual"
                  : hasMembership
                  ? "Quiero este plan"
                  : "Adquirir plan"}
              </button>
            </div>
          ))}
        </div>

        <p
          style={{
            textAlign: "center",
            fontFamily: '"Hepta Slab", serif',
            color: "#9ca3af",
            fontSize: "13px",
            marginTop: "24px",
          }}
        >
          Cancela cuando quieras. Sin permanencia.
        </p>
      </div>

      <Footer />

      <style>{`
        .plans-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
        }
        @media (min-width: 768px) {
          .plans-grid { grid-template-columns: 1fr 1fr; }
        }
      `}</style>
    </main>
  );
}

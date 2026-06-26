import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Loader } from "@mantine/core";
import { Copy, Check } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { createCheckoutSession } from "@/api/memberships";
import { useEmailVerificationGate } from "@/hooks/useEmailVerificationGate";

const PROMO_CODE = "BIENVENIDOWEB";

export function PromoModal() {
  const { isLoggedIn, user } = useAuth();
  const gate = useEmailVerificationGate();
  const navigate = useNavigate();
  const [promoOpen, setPromoOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [purchasing, setPurchasing] = useState(false);
  const [error, setError] = useState("");

  function handleCopy() {
    navigator.clipboard.writeText(PROMO_CODE).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  async function handleActivate(email: string) {
    setPromoOpen(false);
    // Email must be verified before Treli checkout — gate opens the verify modal
    // (resuming into checkout) and we stop here when it does.
    if (gate("monthly")) return;
    setError("");
    setPurchasing(true);
    try {
      const res = await createCheckoutSession(email, "monthly");
      if (res.data?.url) {
        window.open(res.data.url, "_blank", "noopener,noreferrer");
      }
    } catch {
      setError("No se pudo iniciar el proceso de pago. Intenta de nuevo.");
    } finally {
      setPurchasing(false);
    }
  }

  async function handleLoggedInActivate() {
    if (!user?.email) {
      setPromoOpen(false);
      navigate("/registro?plan=monthly&next=/app/card");
      return;
    }
    await handleActivate(user.email);
  }

  return (
    <>
      {/* <button
        onClick={() => setPromoOpen(true)}
        style={{
          background: "#000",
          color: "#fff",
          border: "none",
          borderRadius: "9999px",
          padding: "14px 28px",
          fontFamily: '"Clash Grotesk", sans-serif',
          fontWeight: 700,
          fontSize: "14px",
          cursor: "pointer",
          letterSpacing: "0.02em",
          transition: "background 0.15s",
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "#222")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "#000")}
      >
        {purchasing && <Loader size={14} color="white" />}
        Comienza tu prueba gratis de 30 días
      </button> */}

      {error && (
        <p
          style={{
            color: "#dc2626",
            fontSize: "13px",
            marginTop: "8px",
            fontFamily: '"Hepta Slab", serif',
          }}
        >
          {error}
        </p>
      )}

      {/* Promo code modal */}
      <Modal
        opened={promoOpen}
        onClose={() => setPromoOpen(false)}
        withCloseButton
        size="sm"
        padding="xl"
        radius="xl"
      >
        <div style={{ textAlign: "center" }}>
          <p
            style={{
              fontSize: "11px",
              fontFamily: '"Clash Grotesk", sans-serif',
              fontWeight: 700,
              color: "#FF3B47",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: "8px",
            }}
          >
            30 días gratis
          </p>
          <h2
            style={{
              fontFamily: '"Clash Grotesk", sans-serif',
              fontWeight: 900,
              fontSize: "24px",
              color: "#000",
              marginBottom: "20px",
              letterSpacing: "-0.02em",
            }}
          >
            TU CÓDIGO DE BIENVENIDA
          </h2>

          {/* Code display */}
          <div
            style={{
              background: "#f7f5f3",
              borderRadius: "12px",
              padding: "16px 20px",
              marginBottom: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "12px",
            }}
          >
            <span
              style={{
                fontFamily: '"Clash Grotesk", sans-serif',
                fontWeight: 900,
                fontSize: "22px",
                letterSpacing: "0.1em",
                color: "#000",
              }}
            >
              {PROMO_CODE}
            </span>
            <button
              onClick={handleCopy}
              aria-label="Copiar código"
              style={{
                background: "#000",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                padding: "8px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
              }}
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
            </button>
          </div>

          <p
            style={{
              fontSize: "13px",
              color: "#6b7280",
              fontFamily: '"Hepta Slab", serif',
              lineHeight: 1.6,
              marginBottom: "24px",
            }}
          >
            {isLoggedIn
              ? "Activa tu membresía con este código para disfrutar 30 días gratis."
              : "Regístrate y activa tu membresía para disfrutar 30 días gratis en los mejores restaurantes."}
          </p>

          {isLoggedIn ? (
            <button
              onClick={handleLoggedInActivate}
              disabled={purchasing}
              style={{
                width: "100%",
                padding: "13px",
                borderRadius: "9999px",
                background: purchasing ? "#d1d5db" : "#000",
                color: "#fff",
                fontFamily: '"Clash Grotesk", sans-serif',
                fontWeight: 700,
                fontSize: "13px",
                border: "none",
                cursor: purchasing ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              {purchasing && <Loader size={14} color="white" />}
              {purchasing ? "Cargando..." : "Activar membresía"}
            </button>
          ) : (
            <button
              onClick={() => {
                setPromoOpen(false);
                navigate("/registro?plan=monthly&next=/app/card");
              }}
              style={{
                width: "100%",
                padding: "13px",
                borderRadius: "9999px",
                background: "#000",
                color: "#fff",
                fontFamily: '"Clash Grotesk", sans-serif',
                fontWeight: 700,
                fontSize: "13px",
                border: "none",
                cursor: "pointer",
              }}
            >
              Registrarme y activar
            </button>
          )}
        </div>
      </Modal>
    </>
  );
}

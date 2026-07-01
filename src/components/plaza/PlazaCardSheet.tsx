import { useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { useAuth } from "@/context/AuthContext";
import { MembershipCard } from "@/components/membership/MembershipCard";
import { type PlazaMerchant } from "@/api/plaza";
import { useGeneratePlazaRedemption } from "@/hooks/usePlazaActive";

interface PlazaCardSheetProps {
  onClose: () => void;
  /** When a stand is in context (its detail modal is open), the sheet also
   *  mints a one-time QR the stand can scan to verify + record the redemption. */
  merchant?: PlazaMerchant | null;
}

// Bottom-sheet that shows the member's weincard inside the Plaza page. Android
// contingency: the store-rejected app means active members need an in-stand way
// to present their card on the web. When opened over a stand's detail, it also
// shows a scannable QR for that stand.
export function PlazaCardSheet({ onClose, merchant }: PlazaCardSheetProps) {
  const { user, membership, membershipActiveUntil } = useAuth();

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Guarded by the caller, but keep the type-narrowing here too.
  if (!user || !membership) return null;

  return (
    <div
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Mi weincard"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 60,
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        background: "rgba(0,0,0,0.6)",
        backdropFilter: "blur(4px)",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "relative",
          background: "#fff",
          width: "100%",
          maxWidth: "520px",
          maxHeight: "92dvh",
          overflowY: "auto",
          borderRadius: "24px 24px 0 0",
          padding: "28px 24px 36px",
        }}
        className="plaza-card-sheet-inner"
      >
        {/* Drag handle */}
        <div
          style={{
            width: "40px",
            height: "4px",
            borderRadius: "9999px",
            background: "#e5e7eb",
            margin: "0 auto 20px",
          }}
        />

        <button
          onClick={onClose}
          aria-label="Cerrar"
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            background: "rgba(0,0,0,0.08)",
            border: "none",
            borderRadius: "50%",
            width: "32px",
            height: "32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "#374151",
          }}
        >
          <svg
            width="14"
            height="14"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <p
          style={{
            fontFamily: '"Clash Grotesk", sans-serif',
            fontWeight: 700,
            fontSize: "18px",
            color: "#000",
            textAlign: "center",
            marginBottom: "6px",
          }}
        >
          Mi weincard
        </p>
        <p
          style={{
            fontFamily: '"Hepta Slab", serif',
            fontSize: "14px",
            color: "#6b7280",
            textAlign: "center",
            marginBottom: "24px",
          }}
        >
          Muéstrala en el stand para redimir tu beneficio.
        </p>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <MembershipCard
            user={user}
            membership={membership}
            activeUntil={membershipActiveUntil}
          />
        </div>

        {merchant ? (
          <PlazaQrSection merchant={merchant} />
        ) : (
          <p
            style={{
              fontFamily: '"Hepta Slab", serif',
              fontSize: "13px",
              color: "#9ca3af",
              textAlign: "center",
              marginTop: "20px",
            }}
          >
            Abre un aliado para generar tu código QR.
          </p>
        )}
      </div>

      <style>{`
        @media (min-width: 768px) {
          .plaza-card-sheet-inner {
            border-radius: 24px !important;
            margin-bottom: 24px;
          }
        }
      `}</style>
    </div>
  );
}

// ── QR section ───────────────────────────────────────────────────────────────
// Mints a one-time redemption code for the stand and renders it as a QR the
// stand scans. The QR points at the public verification page on THIS origin, so
// it works regardless of which domain the web app is served from.
function PlazaQrSection({ merchant }: { merchant: PlazaMerchant }) {
  const gen = useGeneratePlazaRedemption();
  const generate = () => gen.mutate(merchant.plazaMerchantId);

  useEffect(() => {
    gen.mutate(merchant.plazaMerchantId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [merchant.plazaMerchantId]);

  // `isIdle` covers the first frame before the mount effect fires the mutation.
  const loading = gen.isIdle || gen.isPending;
  const error = gen.isError;
  const code = gen.data?.code ?? null;
  const qrUrl = code
    ? `${window.location.origin}/plaza/verificacion?code=${encodeURIComponent(code)}`
    : null;

  return (
    <div
      style={{
        marginTop: "24px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "14px",
      }}
    >
      <p
        style={{
          fontFamily: '"Hepta Slab", serif',
          fontSize: "14px",
          color: "#374151",
          textAlign: "center",
          margin: 0,
        }}
      >
        Muestra este código en el stand de <strong>{merchant.name}</strong>.
      </p>

      {loading && (
        <div
          style={{
            width: "216px",
            height: "216px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg className="spin" width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="10" stroke="#e5e7eb" strokeWidth="4" />
            <path fill="#9ca3af" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
        </div>
      )}

      {!loading && error && (
        <button
          type="button"
          onClick={generate}
          style={{
            padding: "10px 20px",
            borderRadius: "9999px",
            border: "1px solid #d1d5db",
            background: "#fff",
            color: "#111",
            cursor: "pointer",
            fontFamily: '"Clash Grotesk", sans-serif',
            fontWeight: 700,
            fontSize: "14px",
          }}
        >
          No se pudo generar. Reintentar
        </button>
      )}

      {!loading && qrUrl && (
        <>
          <div
            style={{
              padding: "16px",
              background: "#fff",
              borderRadius: "16px",
              border: "1px solid #eee",
              boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
            }}
          >
            <QRCodeSVG value={qrUrl} size={200} level="M" />
          </div>
          <button
            type="button"
            onClick={generate}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 16px",
              borderRadius: "9999px",
              border: "none",
              background: "transparent",
              color: "#6b7280",
              cursor: "pointer",
              fontFamily: '"Clash Grotesk", sans-serif',
              fontWeight: 700,
              fontSize: "13px",
            }}
          >
            Generar nuevo código
          </button>
        </>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .spin { animation: spin 1s linear infinite; }
      `}</style>
    </div>
  );
}

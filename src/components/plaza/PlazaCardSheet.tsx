import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { MembershipCard } from "@/components/membership/MembershipCard";

interface PlazaCardSheetProps {
  onClose: () => void;
}

// Bottom-sheet that shows the member's weincard inside the Plaza page. Android
// contingency: the store-rejected app means active members need an in-stand way
// to present their card on the web. Display-only — NO code redemption flow.
export function PlazaCardSheet({ onClose }: PlazaCardSheetProps) {
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

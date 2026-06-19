import { useRef, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export function UserMenu() {
  const { user, hasMembership, membershipName, isLoading, isLoggedIn, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  if (isLoading) {
    return (
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.15)",
          animation: "pulse 1.5s ease-in-out infinite",
        }}
        aria-hidden="true"
      />
    );
  }

  if (!isLoggedIn) {
    return (
      <Link
        to="/login"
        style={{
          background: "#fff",
          color: "#000",
          borderRadius: "9999px",
          padding: "8px 16px",
          fontFamily: '"Hepta Slab", serif',
          fontWeight: 700,
          fontSize: "13px",
          textDecoration: "none",
          letterSpacing: "0.02em",
          whiteSpace: "nowrap",
          display: "inline-block",
        }}
      >
        INICIAR SESIÓN
      </Link>
    );
  }

  const initials = `${user?.firstName?.[0] ?? ""}${user?.lastName?.[0] ?? ""}`.toUpperCase();
  const fullName = user?.name ?? [user?.firstName, user?.lastName].filter(Boolean).join(" ");

  function handleLogout() {
    logout();
    setOpen(false);
    navigate("/");
  }

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Menú de usuario"
        aria-expanded={open}
        style={{
          width: 40,
          height: 40,
          borderRadius: "50%",
          background: "#fff",
          color: "#000",
          border: "none",
          cursor: "pointer",
          fontFamily: '"Clash Grotesk", sans-serif',
          fontWeight: 700,
          fontSize: "13px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {initials || (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            style={{ width: 18, height: 18 }}
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            right: 0,
            top: "calc(100% + 8px)",
            background: "#fff",
            borderRadius: "16px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
            border: "1px solid #f0f0f0",
            minWidth: 220,
            overflow: "hidden",
            zIndex: 100,
          }}
        >
          <div style={{ padding: "16px", borderBottom: "1px solid #f0f0f0" }}>
            <p
              style={{
                fontSize: "10px",
                color: "#9ca3af",
                fontFamily: '"Hepta Slab", serif',
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: "4px",
              }}
            >
              Sesión iniciada
            </p>
            <p
              style={{
                fontFamily: '"Clash Grotesk", sans-serif',
                fontWeight: 700,
                fontSize: "14px",
                color: "#000",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {fullName}
            </p>
            {hasMembership ? (
              <span
                style={{
                  display: "inline-block",
                  marginTop: "8px",
                  fontSize: "11px",
                  fontFamily: '"Clash Grotesk", sans-serif',
                  fontWeight: 700,
                  padding: "3px 12px",
                  borderRadius: "9999px",
                  background: "#dcfce7",
                  color: "#15803d",
                }}
              >
                {membershipName ?? "Plan activo"}
              </span>
            ) : (
              <Link
                to="/planes"
                onClick={() => setOpen(false)}
                style={{
                  display: "inline-block",
                  marginTop: "8px",
                  fontSize: "11px",
                  fontFamily: '"Clash Grotesk", sans-serif',
                  fontWeight: 700,
                  padding: "3px 12px",
                  borderRadius: "9999px",
                  background: "rgba(255,59,71,0.1)",
                  color: "#FF3B47",
                  textDecoration: "none",
                }}
              >
                Ver planes
              </Link>
            )}
          </div>

          <div style={{ padding: "8px" }}>
            <Link
              to="/app/card"
              onClick={() => setOpen(false)}
              style={menuItemStyle}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#f9fafb")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
            >
              Mi tarjeta
            </Link>
            <Link
              to="/app/explore"
              onClick={() => setOpen(false)}
              style={menuItemStyle}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#f9fafb")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
            >
              Explorar
            </Link>
            <div style={{ height: 1, background: "#f0f0f0", margin: "4px 0" }} />
            <button
              onClick={handleLogout}
              style={{
                width: "100%",
                textAlign: "left",
                padding: "10px 12px",
                borderRadius: "10px",
                fontSize: "14px",
                fontFamily: '"Hepta Slab", serif',
                fontWeight: 600,
                color: "#dc2626",
                border: "none",
                background: "none",
                cursor: "pointer",
                display: "block",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#fef2f2")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const menuItemStyle: React.CSSProperties = {
  display: "block",
  width: "100%",
  textAlign: "left",
  padding: "10px 12px",
  borderRadius: "10px",
  fontSize: "14px",
  fontFamily: '"Hepta Slab", serif',
  fontWeight: 600,
  color: "#111",
  textDecoration: "none",
  background: "none",
};

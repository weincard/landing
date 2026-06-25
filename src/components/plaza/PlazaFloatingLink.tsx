import { Link, useLocation } from "react-router-dom";

const PLAZA_PATH = "/la-plaza-de-wein-junio-2026";

// Floating logo that links to La Plaza de Wein from anywhere in the app. Hidden
// on the Plaza page itself. Mounted once at the router root so it renders over
// every route (public marketing + /app shell).
export function PlazaFloatingLink() {
  const { pathname } = useLocation();
  if (pathname === PLAZA_PATH) return null;

  return (
    <Link
      to={PLAZA_PATH}
      aria-label="La Plaza de Wein"
      className="plaza-floating-link"
      style={{
        position: "fixed",
        right: "16px",
        bottom: "16px",
        zIndex: 45,
        width: "72px",
        height: "72px",
        borderRadius: "50%",
        overflow: "hidden",
        display: "block",
        background: "#fff",
        boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
        transition: "transform 0.15s ease",
      }}
    >
      <img
        src="/images/plaza-de-wein-logo.png"
        alt="La Plaza de Wein"
        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
      />
      <style>{`
        .plaza-floating-link:hover { transform: scale(1.06); }
        @media (min-width: 768px) {
          .plaza-floating-link { width: 84px !important; height: 84px !important; }
        }
      `}</style>
    </Link>
  );
}

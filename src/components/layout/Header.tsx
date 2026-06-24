import { Link } from "react-router-dom";
import { UserMenu } from "./UserMenu";
import { MobileNav } from "./MobileNav";

interface HeaderProps {
  sticky?: boolean;
}

export function Header({ sticky = false }: HeaderProps) {
  return (
    <header
      style={{
        background: "#000",
        color: "#fff",
        position: sticky ? "sticky" : "relative",
        top: sticky ? 0 : undefined,
        zIndex: sticky ? 40 : undefined,
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "24px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "16px",
        }}
      >
        <Link to="/">
          <img
            src="/logo-weincard.png"
            alt="Weincard"
            style={{ height: "20px", width: "auto", display: "block" }}
          />
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {/* Desktop nav */}
          <nav
            className="desktop-nav"
            style={{
              display: "flex",
              gap: "16px",
              alignItems: "center",
              fontFamily: '"Hepta Slab", serif',
              fontWeight: 300,
              fontSize: "18px",
              letterSpacing: "0.02em",
            }}
          >
            <Link
              to="/catalogo"
              style={{
                color: "#fff",
                textDecoration: "none",
                opacity: 1,
                transition: "opacity 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              BENEFICIOS
            </Link>
            <span style={{ color: "#fff", opacity: 0.5 }}>|</span>
            <Link
              to="/planes"
              style={{
                color: "#fff",
                textDecoration: "none",
                opacity: 1,
                transition: "opacity 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              PLANES
            </Link>
          </nav>

          {/* Mobile nav */}
          <div className="mobile-nav-wrapper" style={{ position: "relative" }}>
            <MobileNav />
          </div>

          <UserMenu />
        </div>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .mobile-nav-wrapper { display: none !important; }
          .desktop-nav { display: flex !important; }
        }
        @media (max-width: 767px) {
          .mobile-nav-wrapper { display: block; }
          .desktop-nav { display: none !important; }
        }
      `}</style>
    </header>
  );
}

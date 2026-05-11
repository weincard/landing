import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export function Footer() {
  const { isLoggedIn } = useAuth();

  return (
    <footer style={{ background: "#000", color: "#fff", padding: "32px 16px" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "center",
            gap: "16px",
            fontSize: "13px",
            fontFamily: '"Hepta Slab", serif',
            letterSpacing: "0.05em",
          }}
        >
          <Link
            to="/catalogo"
            style={{ color: "#fff", textDecoration: "none", opacity: 1, transition: "opacity 0.15s" }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            RESTAURANTES
          </Link>
          <span style={{ color: "#fff", opacity: 0.4 }}>|</span>
          <Link
            to="/planes"
            style={{ color: "#fff", textDecoration: "none", opacity: 1, transition: "opacity 0.15s" }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            PLANES
          </Link>
          {!isLoggedIn && (
            <>
              <span style={{ color: "#fff", opacity: 0.4 }}>|</span>
              <Link
                to="/planes"
                style={{ color: "#fff", textDecoration: "none", opacity: 1, transition: "opacity 0.15s" }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                SUBSCRÍBETE
              </Link>
            </>
          )}
        </div>
        <div style={{ marginTop: "4px", textAlign: "center" }}>
          <a
            href="https://agenciaidp.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#111", fontSize: "6px", textDecoration: "none" }}
          >
            Desarrollado por agenciaidp.com
          </a>
        </div>
      </div>
    </footer>
  );
}

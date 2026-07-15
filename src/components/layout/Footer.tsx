import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const baseLinkStyle: React.CSSProperties = {
  color: "#fff",
  textDecoration: "none",
  transition: "opacity 0.15s",
};

function FooterLink({
  to,
  children,
  dim = false,
}: {
  to: string;
  children: React.ReactNode;
  dim?: boolean;
}) {
  const rest = dim ? "0.6" : "1";
  return (
    <Link
      to={to}
      style={{
        ...baseLinkStyle,
        opacity: rest,
        fontSize: dim ? "12px" : undefined,
      }}
      onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
      onMouseLeave={(e) => (e.currentTarget.style.opacity = rest)}
    >
      {children}
    </Link>
  );
}

function Sep() {
  return <span style={{ color: "#fff", opacity: 0.4 }}>|</span>;
}

const rowStyle: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  justifyContent: "center",
  fontFamily: '"Hepta Slab", serif',
};

export function Footer() {
  const { isLoggedIn } = useAuth();

  return (
    <footer style={{ background: "#000", color: "#fff", padding: "32px 16px" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        {/* Primary nav */}
        <div
          style={{
            ...rowStyle,
            gap: "16px",
            fontSize: "13px",
            letterSpacing: "0.05em",
          }}
        >
          <FooterLink to="/catalogo">BENEFICIOS</FooterLink>
          <Sep />
          <FooterLink to="/planes">PLANES</FooterLink>
          {!isLoggedIn && (
            <>
              <Sep />
              <FooterLink to="/planes">SUBSCRÍBETE</FooterLink>
            </>
          )}
        </div>

        {/* Legal */}
        <div style={{ ...rowStyle, gap: "12px", marginTop: "16px" }}>
          <FooterLink to="/terminos-y-condiciones" dim>
            Términos y Condiciones
          </FooterLink>
          <Sep />
          <FooterLink to="/politica-de-privacidad" dim>
            Política de Privacidad
          </FooterLink>
          <Sep />
          <FooterLink to="/politica-de-cookies" dim>
            Política de Cookies
          </FooterLink>
        </div>

        <div style={{ marginTop: "12px", textAlign: "center" }}>
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

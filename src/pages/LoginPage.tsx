import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { AuthModal } from "@/components/auth/AuthModal";
import { PageMeta } from "@/components/layout/PageMeta";

export function LoginPage() {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) navigate("/", { replace: true });
  }, [isLoggedIn, navigate]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f7f5f3",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <PageMeta title="Iniciar sesión" description="Accede a tu cuenta Weincard." path="/login" />
      <header style={{ background: "#000", color: "#fff" }}>
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "20px 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Link to="/">
            <img src="/logo-weincard.png" alt="Weincard" style={{ height: "20px", width: "auto" }} />
          </Link>
          <Link
            to="/registro"
            style={{
              color: "#fff",
              textDecoration: "none",
              fontSize: "13px",
              fontFamily: '"Hepta Slab", serif',
              opacity: 1,
              transition: "opacity 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            ¿No tienes cuenta? <strong style={{ textDecoration: "underline" }}>Regístrate</strong>
          </Link>
        </div>
      </header>

      <main
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "48px 16px",
        }}
      >
        <AuthModal
          mode="login"
          inline
          onComplete={() => navigate("/catalogo")}
        />
      </main>
    </div>
  );
}

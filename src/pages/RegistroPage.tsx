import { Link } from "react-router-dom";
import { RegistroFlow } from "@/components/auth/RegistroFlow";
import { PageMeta } from "@/components/layout/PageMeta";

// The single, unified entry point for authentication + registration, served at
// /registro (the path marketing locked in with their provider). Every other
// surface (catalog, planes, promo modal, /login) redirects here with `?next=`
// and optional `?plan=`. The "already-onboarded → skip" redirect lives in
// RegistroFlow (it needs the funnel step to avoid firing mid-flow).
export function RegistroPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f7f5f3",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <PageMeta title="Crear cuenta" description="Ingresa o crea tu cuenta Weincard." path="/registro" />
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
        <div
          style={{
            background: "#fff",
            borderRadius: "16px",
            boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
            padding: "32px",
            width: "100%",
            maxWidth: "440px",
          }}
        >
          <RegistroFlow />
        </div>
      </main>
    </div>
  );
}

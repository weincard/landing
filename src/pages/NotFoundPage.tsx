import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageMeta } from "@/components/layout/PageMeta";

export function NotFoundPage() {
  return (
    <main style={{ minHeight: "100vh", background: "#f7f5f3" }}>
      <PageMeta title="Página no encontrada" description="La página que buscas no existe." />
      <Header />
      <div
        style={{
          maxWidth: "560px",
          margin: "0 auto",
          padding: "100px 16px",
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontFamily: '"Clash Grotesk", sans-serif',
            fontWeight: 900,
            fontSize: "96px",
            color: "#000",
            lineHeight: 1,
            marginBottom: "16px",
          }}
        >
          404
        </p>
        <h1
          style={{
            fontFamily: '"Clash Grotesk", sans-serif',
            fontWeight: 700,
            fontSize: "24px",
            color: "#000",
            marginBottom: "12px",
          }}
        >
          Página no encontrada
        </h1>
        <p
          style={{
            fontFamily: '"Hepta Slab", serif',
            color: "#6b7280",
            fontSize: "15px",
            lineHeight: 1.6,
            marginBottom: "32px",
          }}
        >
          La página que buscas no existe o fue movida.
        </p>
        <Link
          to="/"
          style={{
            display: "inline-block",
            padding: "13px 32px",
            borderRadius: "9999px",
            background: "#000",
            color: "#fff",
            fontFamily: '"Clash Grotesk", sans-serif',
            fontWeight: 700,
            fontSize: "14px",
            textDecoration: "none",
          }}
        >
          Volver al inicio
        </Link>
      </div>
      <Footer />
    </main>
  );
}

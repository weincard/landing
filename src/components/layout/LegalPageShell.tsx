import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { PageMeta } from "@/components/layout/PageMeta";
import "@/styles/legal.css";

type Props = {
  title: string;
  description: string;
  path: string;
  /** Free-text date shown at the bottom of the document, e.g. "Septiembre 19, 2025". */
  updated: string;
  children: ReactNode;
};

/** Shared chrome for the legal documents. The document body is plain markup styled by legal.css. */
export function LegalPageShell({ title, description, path, updated, children }: Props) {
  return (
    <div style={{ minHeight: "100vh", background: "#f7f5f3" }}>
      <PageMeta title={title} description={description} path={path} />
      <header style={{ background: "#000", padding: "24px 0" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 16px" }}>
          <Link to="/">
            <img src="/logo-weincard.png" alt="Weincard" style={{ height: "32px", width: "auto" }} />
          </Link>
        </div>
      </header>

      <main style={{ maxWidth: "896px", margin: "0 auto", padding: "48px 16px" }}>
        <h1
          style={{
            fontFamily: '"Clash Grotesk", sans-serif',
            fontWeight: 900,
            fontSize: "clamp(28px, 5vw, 44px)",
            color: "#000",
            marginBottom: "32px",
          }}
        >
          {title}
        </h1>

        <div
          style={{
            background: "#fff",
            borderRadius: "16px",
            boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
            padding: "clamp(24px, 5vw, 48px)",
          }}
        >
          <div className="legal-doc">
            {children}
            <div className="legal-doc__updated">Última actualización: {updated}</div>
          </div>
        </div>
      </main>

      <footer style={{ background: "#000", color: "#fff", padding: "32px 0", marginTop: "64px" }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: "13px", fontFamily: '"Hepta Slab", serif' }}>
            © 2026 WEINCARD S.A.S. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}

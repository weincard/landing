import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageMeta } from "@/components/layout/PageMeta";
import { BranchBrowser } from "@/components/catalog/BranchBrowser";
import { BranchModal } from "@/components/catalog/BranchModal";
import type { Branch } from "@/types";

// Public catalog. Same browse experience as /app/explore (the shared
// BranchBrowser) — both exist to help users find what they want, regardless of
// membership status. Only difference: opening a branch shows a modal here vs a
// route push in the app shell.
export function CatalogoPage() {
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);

  return (
    <main style={{ minHeight: "100vh", background: "#f7f5f3" }}>
      <PageMeta
        title="Restaurantes"
        description="Descubre todos los restaurantes con beneficios exclusivos para miembros Weincard en Medellín."
        path="/catalogo"
      />
      <Header sticky />

      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "32px 16px 64px" }}>
        <BranchBrowser onOpenBranch={setSelectedBranch} />
      </div>

      <Footer />

      {selectedBranch && (
        <BranchModal branch={selectedBranch} onClose={() => setSelectedBranch(null)} />
      )}
    </main>
  );
}

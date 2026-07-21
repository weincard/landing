import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageMeta } from "@/components/layout/PageMeta";
import { BranchBrowser } from "@/components/catalog/BranchBrowser";
import { BranchModal } from "@/components/catalog/BranchModal";
import type { Branch } from "@/types";

// URL params mirroring the open branch modal, so branches can be deep-linked
// (/catalogo?branchId=123) and survive a reload. channelIds carries the
// browsing category's channel scope into the modal's detail fetch.
const BRANCH_PARAM = "branchId";
const CHANNELS_PARAM = "channelIds";

// Public catalog. Same browse experience as /app/explore (the shared
// BranchBrowser) — both exist to help users find what they want, regardless of
// membership status. Only difference: opening a branch shows a modal here vs a
// route push in the app shell.
export function CatalogoPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  const branchId = Number(searchParams.get(BRANCH_PARAM));
  const isModalOpen = Number.isInteger(branchId) && branchId > 0;
  const channelIds = (searchParams.get(CHANNELS_PARAM) ?? "")
    .split(",")
    .map((s) => Number(s))
    .filter((n) => Number.isFinite(n) && n > 0);

  // Opening PUSHES a history entry (with a state marker), so the browser/phone
  // Back button closes the modal instead of leaving /catalogo.
  const openBranch = (branch: Branch, chIds: number[]) => {
    const params = new URLSearchParams(searchParams);
    params.set(BRANCH_PARAM, String(branch.branchId));
    if (chIds.length) params.set(CHANNELS_PARAM, chIds.join(","));
    else params.delete(CHANNELS_PARAM);
    navigate(`?${params.toString()}`, { state: { branchModal: true } });
  };

  const closeBranch = () => {
    // If WE pushed this entry, closing = going back (keeps history clean). On a
    // deep link / reload there's no entry of ours below, so strip the params in
    // place instead of navigating away from the site.
    if (location.state?.branchModal) {
      navigate(-1);
      return;
    }
    const params = new URLSearchParams(searchParams);
    params.delete(BRANCH_PARAM);
    params.delete(CHANNELS_PARAM);
    navigate(`?${params.toString()}`, { replace: true });
  };

  return (
    <main style={{ minHeight: "100vh", background: "#f7f5f3" }}>
      <PageMeta
        title="Restaurantes"
        description="Descubre todos los restaurantes con beneficios exclusivos para miembros Weincard en Medellín."
        path="/catalogo"
      />
      <Header sticky />

      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "32px 16px 64px" }}>
        <BranchBrowser onOpenBranch={openBranch} />
      </div>

      <Footer />

      {isModalOpen && (
        <BranchModal
          branchId={branchId}
          channelIds={channelIds}
          onClose={closeBranch}
        />
      )}
    </main>
  );
}

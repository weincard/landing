import { useState } from "react";
import { useDebouncedValue } from "@mantine/hooks";
import { Paper, Box } from "@mantine/core";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageMeta } from "@/components/layout/PageMeta";
import { BranchCard } from "@/components/catalog/BranchCard";
import { BranchModal } from "@/components/catalog/BranchModal";
import { FilterPanel, type ExploreFilters } from "@/components/explore/FilterPanel";
import { useCatalogBranches } from "@/hooks/useBranches";
import { useCategories } from "@/hooks/useCategories";
import type { Branch } from "@/types";
import { Search } from "lucide-react";

const INITIAL_FILTERS: ExploreFilters = {
  search: "",
  categoryIds: [],
  validDays: [],
  offerTypes: [],
};

export function CatalogoPage() {
  const [filters, setFilters] = useState<ExploreFilters>(INITIAL_FILTERS);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);

  const { data: categories = [] } = useCategories();
  // Debounce so typing / toggling chips doesn't fire a request per keystroke.
  const [debouncedFilters] = useDebouncedValue(filters, 350);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    refetch,
  } = useCatalogBranches(debouncedFilters);

  const branches: Branch[] = data?.pages.flatMap((p) => p.branches) ?? [];
  const total = data?.pages[0]?.total ?? 0;

  return (
    <main style={{ minHeight: "100vh", background: "#f7f5f3" }}>
      <PageMeta
        title="Restaurantes"
        description="Descubre todos los restaurantes con beneficios exclusivos para miembros Weincard en Medellín."
        path="/catalogo"
      />
      <Header sticky />

      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "32px 16px 64px" }}>
        {/* Search bar */}
        <div
          style={{
            position: "relative",
            maxWidth: "480px",
            margin: "0 auto 20px",
          }}
        >
          <Search
            size={18}
            style={{
              position: "absolute",
              left: "16px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#9ca3af",
            }}
          />
          <input
            type="search"
            value={filters.search}
            onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
            placeholder="Buscar restaurante..."
            style={{
              width: "100%",
              padding: "12px 16px 12px 44px",
              borderRadius: "9999px",
              border: "1px solid #e5e7eb",
              background: "#fff",
              fontSize: "14px",
              fontFamily: '"Hepta Slab", serif',
              outline: "none",
              boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
              transition: "box-shadow 0.15s",
              boxSizing: "border-box",
            }}
            onFocus={(e) => (e.currentTarget.style.boxShadow = "0 0 0 2px #000")}
            onBlur={(e) => (e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.06)")}
          />
        </div>

        {/* Filters */}
        <Box maw={480} mx="auto" mb="lg">
          <Paper radius="xl" p="lg" withBorder>
            <FilterPanel
              filters={filters}
              onChange={setFilters}
              categories={categories}
              showSearch={false}
            />
          </Paper>
        </Box>

        {/* Results count */}
        {!isLoading && !isError && (
          <p
            style={{
              textAlign: "center",
              fontSize: "13px",
              color: "#9ca3af",
              fontFamily: '"Hepta Slab", serif',
              marginBottom: "24px",
            }}
          >
            {total === 0
              ? "No se encontraron restaurantes."
              : `${total} restaurante${total !== 1 ? "s" : ""} disponible${total !== 1 ? "s" : ""}`}
          </p>
        )}

        {/* Error */}
        {isError && (
          <div
            style={{
              textAlign: "center",
              background: "#fef2f2",
              border: "1px solid #fecaca",
              borderRadius: "16px",
              padding: "24px",
              marginBottom: "24px",
              maxWidth: "480px",
              margin: "0 auto 24px",
            }}
          >
            <p style={{ fontFamily: '"Hepta Slab", serif', color: "#dc2626", fontSize: "14px", marginBottom: "12px" }}>
              No se pudo cargar el catálogo. Intenta de nuevo.
            </p>
            <button
              onClick={() => refetch()}
              style={{
                background: "#000",
                color: "#fff",
                border: "none",
                borderRadius: "9999px",
                padding: "10px 20px",
                fontFamily: '"Clash Grotesk", sans-serif',
                fontWeight: 700,
                fontSize: "13px",
                cursor: "pointer",
              }}
            >
              Reintentar
            </button>
          </div>
        )}

        {/* Loading skeleton */}
        {isLoading && (
          <div className="branch-grid">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                style={{
                  background: "#e5e7eb",
                  borderRadius: "16px",
                  aspectRatio: "4/3",
                  animation: "pulse 1.5s ease-in-out infinite",
                }}
              />
            ))}
          </div>
        )}

        {/* Branch grid */}
        {!isLoading && !isError && branches.length > 0 && (
          <div className="branch-grid">
            {branches.map((branch) => (
              <BranchCard
                key={branch.branchId}
                branch={branch}
                onOpen={setSelectedBranch}
              />
            ))}
          </div>
        )}

        {/* Load more */}
        {!isLoading && hasNextPage && (
          <div style={{ textAlign: "center", marginTop: "32px" }}>
            <button
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              style={{
                background: "#000",
                color: "#fff",
                border: "none",
                borderRadius: "9999px",
                padding: "12px 32px",
                fontFamily: '"Clash Grotesk", sans-serif',
                fontWeight: 700,
                fontSize: "14px",
                cursor: isFetchingNextPage ? "not-allowed" : "pointer",
                opacity: isFetchingNextPage ? 0.6 : 1,
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              {isFetchingNextPage && (
                <svg className="spin" width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="4" />
                  <path fill="#fff" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
              )}
              {isFetchingNextPage ? "Cargando..." : "Ver más"}
            </button>
          </div>
        )}
      </div>

      <Footer />

      {selectedBranch && (
        <BranchModal
          branch={selectedBranch}
          onClose={() => setSelectedBranch(null)}
        />
      )}

      <style>{`
        .branch-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .spin { animation: spin 1s linear infinite; }
        @media (min-width: 640px) {
          .branch-grid { grid-template-columns: repeat(3, 1fr); }
        }
        @media (min-width: 1024px) {
          .branch-grid { grid-template-columns: repeat(4, 1fr); }
        }
      `}</style>
    </main>
  );
}

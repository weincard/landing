import { useState, useEffect, useCallback, useRef } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageMeta } from "@/components/layout/PageMeta";
import { BranchCard } from "@/components/catalog/BranchCard";
import { BranchModal } from "@/components/catalog/BranchModal";
import { searchBranches } from "@/api/branches";
import type { Branch } from "@/types";
import { Search } from "lucide-react";

export function CatalogoPage() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [query, setQuery] = useState("");
  const [skip, setSkip] = useState(0);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchBranches = useCallback(
    async (q: string, page: number, replace: boolean) => {
      if (replace) setIsLoading(true);
      else setIsLoadingMore(true);
      setError(null);

      try {
        const { branches: newBranches, found } = await searchBranches(q, page);
        setBranches((prev) => (replace ? newBranches : [...prev, ...newBranches]));
        setTotal(found);
        setSkip(page);
      } catch {
        setError("No se pudo cargar el catálogo. Intenta de nuevo.");
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchBranches("", 1, true);
  }, [fetchBranches]);

  function handleSearch(val: string) {
    setQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchBranches(val, 1, true);
    }, 400);
  }

  function handleLoadMore() {
    fetchBranches(query, skip + 1, false);
  }

  const hasMore = branches.length < total;

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
            margin: "0 auto 32px",
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
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
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

        {/* Results count */}
        {!isLoading && !error && (
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
        {error && (
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
              {error}
            </p>
            <button
              onClick={() => fetchBranches(query, 1, true)}
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
        {!isLoading && !error && branches.length > 0 && (
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
        {!isLoading && hasMore && (
          <div style={{ textAlign: "center", marginTop: "32px" }}>
            <button
              onClick={handleLoadMore}
              disabled={isLoadingMore}
              style={{
                background: "#000",
                color: "#fff",
                border: "none",
                borderRadius: "9999px",
                padding: "12px 32px",
                fontFamily: '"Clash Grotesk", sans-serif',
                fontWeight: 700,
                fontSize: "14px",
                cursor: isLoadingMore ? "not-allowed" : "pointer",
                opacity: isLoadingMore ? 0.6 : 1,
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              {isLoadingMore && (
                <svg className="spin" width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="4" />
                  <path fill="#fff" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
              )}
              {isLoadingMore ? "Cargando..." : "Ver más"}
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

import { useMemo, useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageMeta } from "@/components/layout/PageMeta";
import { PlazaMerchantModal } from "@/components/plaza/PlazaMerchantModal";
import { PlazaCardSheet } from "@/components/plaza/PlazaCardSheet";
import { usePlazaActive } from "@/hooks/usePlazaActive";
import { useAuth } from "@/context/AuthContext";
import type { PlazaMerchant } from "@/api/plaza";
import { BrandBookColors } from "@/lib/palette";

// La Plaza de Wein — public marketing page. Mirrors the mobile app's feria
// screen, but is open to everyone (no auth, no membership gate) and is purely
// informational: no card / redeem CTA. Renders whatever edition is currently
// active via the public GET /plaza/public/active endpoint.
export function LaPlazaPage() {
  const { data, isLoading, isError } = usePlazaActive();
  const { isLoggedIn, hasMembership, user, membership } = useAuth();
  const [query, setQuery] = useState("");
  const [categoryKey, setCategoryKey] = useState<string | null>(null);
  const [selected, setSelected] = useState<PlazaMerchant | null>(null);
  const [cardOpen, setCardOpen] = useState(false);

  // Android contingency: active members get an in-stand "Usar mi weincard" that
  // shows their card. Display-only — no redemption flow. The public page stays
  // info-only for everyone else.
  const canShowCard = isLoggedIn && hasMembership && !!user && !!membership;

  const edition = data?.edition ?? null;
  const merchants = data?.merchants ?? [];
  const categories = edition?.config.categories ?? [];
  const headerImage = edition?.heroImageUrl || edition?.coverImageUrl || null;

  const visibleMerchants = useMemo(() => {
    const q = query.trim().toLowerCase();
    return merchants.filter((m) => {
      if (categoryKey && m.category !== categoryKey) return false;
      if (!q) return true;
      return (
        m.name.toLowerCase().includes(q) ||
        (m.description ?? "").toLowerCase().includes(q)
      );
    });
  }, [merchants, query, categoryKey]);

  return (
    <main style={{ minHeight: "100vh", background: "#f7f5f3" }}>
      <PageMeta
        title="La Plaza de Wein — Junio 2026"
        description="La feria gastronómica de Weincard. Descubre los aliados, sus beneficios y dónde encontrarlos."
        path="/la-plaza-de-wein-junio-2026"
      />
      <Header sticky />

      {/* Hero */}
      <header
        style={{
          position: "relative",
          background: headerImage ? "#000" : BrandBookColors.black,
          minHeight: headerImage ? "320px" : "200px",
          display: "flex",
          alignItems: "flex-end",
          overflow: "hidden",
        }}
      >
        {headerImage && (
          <>
            <img
              src={headerImage}
              alt={edition?.name ?? "La Plaza de Wein"}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.25) 60%, rgba(0,0,0,0.1) 100%)",
              }}
            />
          </>
        )}
        <div
          style={{
            position: "relative",
            maxWidth: "1280px",
            width: "100%",
            margin: "0 auto",
            padding: "32px 16px",
          }}
        >
          <h1
            style={{
              fontFamily: '"Clash Grotesk", sans-serif',
              fontWeight: 700,
              fontSize: "clamp(32px, 6vw, 52px)",
              color: "#fff",
              letterSpacing: "-0.02em",
              lineHeight: 1.05,
              margin: 0,
            }}
          >
            {edition?.name ?? "La Plaza de Wein"}
          </h1>
          {(edition?.venueName || edition?.venueAddress) && (
            <p
              style={{
                fontFamily: '"Hepta Slab", serif',
                fontSize: "16px",
                color: "rgba(255,255,255,0.85)",
                marginTop: "8px",
              }}
            >
              {[edition?.venueName, edition?.venueAddress]
                .filter(Boolean)
                .join(" · ")}
            </p>
          )}
        </div>
      </header>

      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "32px 16px 64px",
        }}
      >
        {isLoading && <StateMessage text="Cargando la feria…" />}

        {isError && (
          <StateMessage text="No pudimos cargar la feria. Intenta de nuevo más tarde." />
        )}

        {!isLoading && !isError && !edition && (
          <StateMessage
            title="No hay una feria activa en este momento"
            text="Vuelve pronto para descubrir la próxima edición de La Plaza de Wein."
          />
        )}

        {!isLoading && !isError && edition && (
          <>
            {edition.config.intro && (
              <p
                style={{
                  fontFamily: '"Hepta Slab", serif',
                  fontSize: "17px",
                  color: "#4b5563",
                  lineHeight: 1.6,
                  maxWidth: "720px",
                  marginBottom: "24px",
                }}
              >
                {edition.config.intro}
              </p>
            )}

            {/* Feria-wide benefit banner */}
            {edition.offers.length > 0 && (
              <div
                style={{
                  background: "#fdf2f6",
                  border: `1px solid ${BrandBookColors.pink}33`,
                  borderRadius: "16px",
                  padding: "20px",
                  marginBottom: "24px",
                }}
              >
                <p
                  style={{
                    fontFamily: '"Clash Grotesk", sans-serif',
                    fontWeight: 700,
                    fontSize: "12px",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: BrandBookColors.pink,
                    marginBottom: "12px",
                  }}
                >
                  Beneficio de la feria
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {edition.offers.map((offer, i) => (
                    <div
                      key={`${offer.title}-${i}`}
                      style={{ display: "flex", gap: "12px", alignItems: "baseline" }}
                    >
                      {offer.value && (
                        <span
                          style={{
                            flexShrink: 0,
                            fontFamily: '"Clash Grotesk", sans-serif',
                            fontWeight: 700,
                            fontSize: "14px",
                            color: BrandBookColors.pink,
                          }}
                        >
                          {offer.value}
                        </span>
                      )}
                      <span
                        style={{
                          fontFamily: '"Hepta Slab", serif',
                          fontSize: "15px",
                          color: "#1f2937",
                        }}
                      >
                        {offer.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Search */}
            <div style={{ position: "relative", marginBottom: "16px", maxWidth: "420px" }}>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar aliados"
                aria-label="Buscar aliados"
                style={{
                  width: "100%",
                  padding: "12px 40px 12px 16px",
                  borderRadius: "9999px",
                  border: "1px solid #e5e7eb",
                  background: "#fff",
                  fontFamily: '"Hepta Slab", serif',
                  fontSize: "15px",
                  outline: "none",
                }}
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  aria-label="Limpiar búsqueda"
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#9ca3af",
                    fontSize: "18px",
                    lineHeight: 1,
                  }}
                >
                  ×
                </button>
              )}
            </div>

            {/* Category chips */}
            {categories.length > 0 && (
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  overflowX: "auto",
                  paddingBottom: "8px",
                  marginBottom: "24px",
                }}
              >
                <CategoryChip
                  label="Todos"
                  active={categoryKey === null}
                  onClick={() => setCategoryKey(null)}
                />
                {categories.map((cat) => (
                  <CategoryChip
                    key={cat.key}
                    label={cat.label}
                    active={categoryKey === cat.key}
                    onClick={() => setCategoryKey(cat.key)}
                  />
                ))}
              </div>
            )}

            {/* Merchant grid */}
            {visibleMerchants.length === 0 ? (
              <StateMessage text="Sin resultados." />
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                  gap: "16px",
                }}
              >
                {visibleMerchants.map((m) => (
                  <MerchantTile
                    key={m.plazaMerchantId}
                    merchant={m}
                    onClick={() => setSelected(m)}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <Footer />

      {/* Active-member contingency: floating "Usar mi weincard" button. Only
          rendered once the live feria has loaded so it doesn't float over the
          loading/error/no-feria states. */}
      {canShowCard && edition && (
        <button
          onClick={() => setCardOpen(true)}
          style={{
            position: "fixed",
            left: "50%",
            bottom: "24px",
            transform: "translateX(-50%)",
            zIndex: 40,
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "14px 24px",
            borderRadius: "9999px",
            background: "#000",
            color: "#fff",
            border: "none",
            cursor: "pointer",
            fontFamily: '"Clash Grotesk", sans-serif',
            fontWeight: 700,
            fontSize: "15px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <rect x="2" y="5" width="20" height="14" rx="2.5" />
            <path d="M2 10h20" strokeLinecap="round" />
          </svg>
          Usar mi weincard
        </button>
      )}

      {selected && edition && (
        <PlazaMerchantModal
          merchant={selected}
          edition={edition}
          onClose={() => setSelected(null)}
        />
      )}

      {cardOpen && canShowCard && (
        <PlazaCardSheet onClose={() => setCardOpen(false)} />
      )}
    </main>
  );
}

function CategoryChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        flexShrink: 0,
        padding: "8px 16px",
        borderRadius: "9999px",
        border: active ? "1px solid #000" : "1px solid #e5e7eb",
        background: active ? "#000" : "#fff",
        color: active ? "#fff" : "#374151",
        fontFamily: '"Clash Grotesk", sans-serif',
        fontWeight: 700,
        fontSize: "13px",
        cursor: "pointer",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </button>
  );
}

function MerchantTile({
  merchant,
  onClick,
}: {
  merchant: PlazaMerchant;
  onClick: () => void;
}) {
  const heroImage = merchant.coverImageUrl || merchant.images?.[0] || null;
  const previewOffer = merchant.offers[0];

  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        flexDirection: "column",
        textAlign: "left",
        background: "#fff",
        border: "none",
        borderRadius: "16px",
        overflow: "hidden",
        cursor: "pointer",
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
        padding: 0,
      }}
    >
      <div style={{ position: "relative", aspectRatio: "4/3", background: "#f3f4f6" }}>
        {heroImage ? (
          <img
            src={heroImage}
            alt={merchant.name}
            loading="lazy"
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        ) : null}
        {merchant.category && (
          <span
            style={{
              position: "absolute",
              top: "8px",
              right: "8px",
              fontSize: "10px",
              fontFamily: '"Clash Grotesk", sans-serif',
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.04em",
              color: "#fff",
              background: "rgba(0,0,0,0.65)",
              borderRadius: "9999px",
              padding: "3px 8px",
            }}
          >
            {merchant.category}
          </span>
        )}
      </div>
      <div style={{ padding: "12px 14px 16px" }}>
        <p
          style={{
            fontFamily: '"Clash Grotesk", sans-serif',
            fontWeight: 700,
            fontSize: "15px",
            color: "#000",
            marginBottom: merchant.description || previewOffer ? "4px" : 0,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {merchant.name}
        </p>
        {merchant.description && (
          <p
            style={{
              fontFamily: '"Hepta Slab", serif',
              fontSize: "13px",
              color: "#6b7280",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              marginBottom: previewOffer ? "6px" : 0,
            }}
          >
            {merchant.description}
          </p>
        )}
        {previewOffer && (
          <p
            style={{
              fontFamily: '"Clash Grotesk", sans-serif',
              fontWeight: 700,
              fontSize: "12px",
              color: BrandBookColors.pink,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {[previewOffer.value, previewOffer.title].filter(Boolean).join(" · ")}
          </p>
        )}
      </div>
    </button>
  );
}

function StateMessage({ title, text }: { title?: string; text: string }) {
  return (
    <div style={{ textAlign: "center", padding: "48px 16px", color: "#6b7280" }}>
      {title && (
        <p
          style={{
            fontFamily: '"Clash Grotesk", sans-serif',
            fontWeight: 700,
            fontSize: "18px",
            color: "#1f2937",
            marginBottom: "8px",
          }}
        >
          {title}
        </p>
      )}
      <p style={{ fontFamily: '"Hepta Slab", serif', fontSize: "15px" }}>{text}</p>
    </div>
  );
}

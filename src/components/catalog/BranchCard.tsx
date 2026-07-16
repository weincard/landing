import type { Branch } from "@/types";
import { DayBadges, DAY_ORDER } from "./DayBadges";

export function mergedValidDays(offers: Branch["offers"]): string[] {
  // No validDays (null or empty) means the offer is valid every day.
  if (offers.some((o) => !o.validDays?.length)) return [];
  const unique = Array.from(new Set(offers.flatMap((o) => o.validDays ?? [])));
  return unique.sort((a, b) => DAY_ORDER.indexOf(a) - DAY_ORDER.indexOf(b));
}

interface BranchCardProps {
  branch: Branch;
  onOpen: (b: Branch) => void;
}

export function BranchCard({ branch, onOpen }: BranchCardProps) {
  const firstImage = branch.images?.[0] ?? branch.coverImageUrl ?? branch.logoUrl;
  const validDays = mergedValidDays(branch.offers);

  return (
    <article
      onClick={() => onOpen(branch)}
      style={{
        background: "#fff",
        borderRadius: "16px",
        overflow: "hidden",
        cursor: "pointer",
        boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
        transition: "box-shadow 0.2s",
      }}
      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.boxShadow = "0 4px 20px rgba(0,0,0,0.14)")}
      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.boxShadow = "0 1px 4px rgba(0,0,0,0.08)")}
    >
      {/* Image */}
      <div style={{ position: "relative", aspectRatio: "4/3", overflow: "hidden", background: "#f3f4f6" }}>
        {firstImage ? (
          <img
            src={firstImage}
            alt={branch.name}
            style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s", display: "block" }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          />
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {branch.logoUrl && (
              <img src={branch.logoUrl} alt={branch.name} style={{ width: "80px", height: "80px", objectFit: "contain", opacity: 0.4 }} />
            )}
          </div>
        )}
        {/* Offer tags */}
        {branch.offers.length > 0 && (
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "12px", display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {branch.offers.map((offer) => (
              <span
                key={offer.offerId}
                style={{ background: "#000", color: "#fff", fontSize: "10px", fontFamily: '"Clash Grotesk", sans-serif', fontWeight: 700, padding: "3px 10px", borderRadius: "9999px" }}
              >
                {offer.title}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "4px" }}>
        <h3
          style={{
            fontFamily: '"Clash Grotesk", sans-serif',
            fontWeight: 700,
            fontSize: "13px",
            lineHeight: 1.3,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            color: "#000",
          }}
        >
          {branch.name}
        </h3>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <DayBadges validDays={validDays} />
        </div>
        {branch.category?.name && (
          <span
            style={{
              display: "inline-block",
              fontSize: "11px",
              fontFamily: '"Hepta Slab", serif',
              color: "#fff",
              background: "#000",
              borderRadius: "9999px",
              padding: "2px 10px",
              marginTop: "4px",
              fontWeight: 700,
              alignSelf: "flex-start",
            }}
          >
            {branch.category.name}
          </span>
        )}
      </div>
    </article>
  );
}

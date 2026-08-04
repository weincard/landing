import type { RedemptionResult, VerifiedOfferChannels } from "@/types";

interface StatusCardProps {
  type: "success" | "warning" | "error";
  title: string;
  body: string;
  detail?: RedemptionResult | null;
}

const colors = {
  success: {
    bg: "#f0fdf4",
    border: "#bbf7d0",
    title: "#166534",
    body: "#15803d",
  },
  warning: {
    bg: "#fffbeb",
    border: "#fde68a",
    title: "#92400e",
    body: "#78350f",
  },
  error: {
    bg: "#fef2f2",
    border: "#fecaca",
    title: "#991b1b",
    body: "#dc2626",
  },
};

const detailStyle = (color: string): React.CSSProperties => ({
  fontSize: "12px",
  color,
  fontFamily: '"Hepta Slab", serif',
});

export function StatusCard({ type, title, body, detail }: StatusCardProps) {
  const c = colors[type];
  return (
    <div
      style={{
        marginBottom: "20px",
        borderRadius: "12px",
        border: `1px solid ${c.border}`,
        background: c.bg,
        padding: "16px 20px",
      }}
    >
      <p
        style={{
          fontFamily: '"Clash Grotesk", sans-serif',
          fontWeight: 700,
          color: c.title,
          fontSize: "15px",
          marginBottom: "4px",
        }}
      >
        {title}
      </p>
      <p
        style={{
          fontFamily: '"Hepta Slab", serif',
          color: c.body,
          fontSize: "13px",
        }}
      >
        {body}
      </p>
      {detail && type === "success" && (
        <div
          style={{
            marginTop: "12px",
            display: "flex",
            flexDirection: "column",
            gap: "4px",
          }}
        >
          {(detail.redemptionCode ?? detail.code) && (
            <p style={detailStyle(c.body)}>
              Código: <strong>{detail.redemptionCode ?? detail.code}</strong>
            </p>
          )}
          {detail.user?.name && (
            <p style={detailStyle(c.body)}>
              Cliente: <strong>{detail.user.name.replace(/~/g, " ")}</strong>
            </p>
          )}
          {(detail.user?.phone ?? detail.phone) && (
            <p style={detailStyle(c.body)}>
              Teléfono: <strong>{detail.user?.phone ?? detail.phone}</strong>
            </p>
          )}
          {detail.branch?.name && (
            <p style={detailStyle(c.body)}>
              Sucursal: <strong>{detail.branch.name}</strong>
            </p>
          )}
          {detail.totalPaid != null && (
            <p style={detailStyle(c.body)}>
              Total pagado:{" "}
              <strong>${detail.totalPaid.toLocaleString("es-CO")} COP</strong>
            </p>
          )}

          {detail.offers && detail.offers.length > 0 && (
            <div style={{ marginTop: "10px" }}>
              <p
                style={{
                  ...detailStyle(c.title),
                  fontWeight: 700,
                  marginBottom: "6px",
                }}
              >
                Ofertas de la sucursal
              </p>
              <div
                style={{ display: "flex", flexDirection: "column", gap: "6px" }}
              >
                {detail.offers.map((offer) => (
                  <div
                    key={offer.offerId}
                    style={{
                      border: `1px solid ${c.border}`,
                      borderRadius: "8px",
                      padding: "8px 10px",
                      background: "rgba(255,255,255,0.5)",
                    }}
                  >
                    <p style={detailStyle(c.body)}>
                      <strong>{offer.title}</strong>
                      {channelTag(offer.channels) && (
                        <span
                          style={{
                            marginLeft: "8px",
                            padding: "1px 8px",
                            borderRadius: "9999px",
                            border: `1px solid ${c.border}`,
                            fontSize: "10px",
                            fontWeight: 700,
                            whiteSpace: "nowrap",
                          }}
                        >
                          {channelTag(offer.channels)}
                        </span>
                      )}
                    </p>
                    {offer.description && (
                      <p style={detailStyle(c.body)}>{offer.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// 'onsite' is the normal case — no tag; delivery variants get a badge so staff
// can tell delivery-only and delivery-available offers apart at a glance.
function channelTag(channels: VerifiedOfferChannels): string | null {
  if (channels === "delivery") return "Solo domicilio";
  if (channels === "both") return "Domicilio disponible";
  return null;
}

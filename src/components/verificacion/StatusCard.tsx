import type { RedemptionResult } from "@/types";

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
        </div>
      )}
    </div>
  );
}

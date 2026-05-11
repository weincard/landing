export function ErrorMsg({ msg }: { msg: string }) {
  return (
    <div
      style={{
        background: "#fef2f2",
        border: "1px solid #fecaca",
        borderRadius: "8px",
        padding: "10px 14px",
        fontSize: "13px",
        color: "#dc2626",
        marginBottom: "12px",
        fontFamily: '"Hepta Slab", serif',
      }}
    >
      {msg}
    </div>
  );
}

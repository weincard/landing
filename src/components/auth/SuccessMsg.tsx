export function SuccessMsg({ msg }: { msg: string }) {
  return (
    <div
      style={{
        background: "#f0fdf4",
        border: "1px solid #bbf7d0",
        borderRadius: "8px",
        padding: "10px 14px",
        fontSize: "13px",
        color: "#15803d",
        marginBottom: "12px",
        fontFamily: '"Hepta Slab", serif',
      }}
    >
      {msg}
    </div>
  );
}

import { Loader } from "@mantine/core";

interface SubmitButtonProps {
  children: React.ReactNode;
  disabled: boolean;
  loading: boolean;
}

export function SubmitButton({ children, disabled, loading }: SubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={disabled}
      style={{
        width: "100%",
        padding: "12px",
        borderRadius: "9999px",
        background: disabled ? "#d1d5db" : "#000",
        color: "#fff",
        fontFamily: '"Clash Grotesk", sans-serif',
        fontWeight: 700,
        fontSize: "13px",
        border: "none",
        cursor: disabled ? "not-allowed" : "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        transition: "background 0.15s",
        marginBottom: "4px",
      }}
    >
      {loading && <Loader size={14} color="white" />}
      {loading ? "Cargando..." : children}
    </button>
  );
}

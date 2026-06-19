import { useRouteError, isRouteErrorResponse } from "react-router-dom";
import { Button, Group } from "@mantine/core";

// Route-level fallback (wired as the router's errorElement). Replaces React
// Router's raw "Unexpected Application Error!" dev screen with a friendly page
// so a render/loader error in prod never dumps a stack trace on the user.
export function ErrorPage() {
  const error = useRouteError();

  const detail = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : error instanceof Error
    ? error.message
    : "Error desconocido";

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f7f5f3",
        color: "#1B1A1A",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        textAlign: "center",
        fontFamily: '"Hepta Slab", serif',
      }}
    >
      <img
        src="/isotipo-weincard.png"
        alt="Weincard"
        style={{ height: 48, width: "auto", marginBottom: 24, opacity: 0.9 }}
      />
      <h1
        style={{
          fontFamily: '"Clash Grotesk", sans-serif',
          fontWeight: 700,
          fontSize: 26,
          letterSpacing: "-0.02em",
          marginBottom: 8,
        }}
      >
        Algo salió mal
      </h1>
      <p style={{ color: "#6b7280", fontSize: 15, maxWidth: 420, marginBottom: 24 }}>
        Tuvimos un problema al cargar esta página. Puedes reintentar o volver al
        inicio.
      </p>

      <Group justify="center" gap="sm">
        <Button color="dark" radius="xl" onClick={() => window.location.reload()}>
          Reintentar
        </Button>
        <Button
          variant="outline"
          color="dark"
          radius="xl"
          component="a"
          href="/"
        >
          Volver al inicio
        </Button>
      </Group>

      {/* Only surface the technical detail in development. */}
      {import.meta.env.DEV && (
        <pre
          style={{
            marginTop: 28,
            maxWidth: 600,
            overflow: "auto",
            fontSize: 12,
            color: "#9ca3af",
            background: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: 8,
            padding: 12,
            textAlign: "left",
          }}
        >
          {detail}
        </pre>
      )}
    </div>
  );
}

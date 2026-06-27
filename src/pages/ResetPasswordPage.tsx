import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { resetPassword } from "@/api/auth";
import { FormInput } from "@/components/auth/FormInput";
import { SubmitButton } from "@/components/auth/SubmitButton";
import { ErrorMsg } from "@/components/auth/ErrorMsg";
import { SuccessMsg } from "@/components/auth/SuccessMsg";
import { PageMeta } from "@/components/layout/PageMeta";
import { validatePassword, PASSWORD_REQUIREMENTS_HINT } from "@/lib/password";

const headingStyle: React.CSSProperties = {
  fontFamily: '"Clash Grotesk", sans-serif',
  fontWeight: 700,
  fontSize: "22px",
  color: "#000",
  letterSpacing: "-0.02em",
  marginBottom: "4px",
};

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const pwError = validatePassword(password);
    if (pwError) {
      setError(pwError);
      return;
    }
    if (password !== confirm) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    setError("");
    setIsLoading(true);
    try {
      await resetPassword(token!, password);
      setSuccess(true);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg ?? "El enlace es inválido o ya expiró.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f7f5f3", display: "flex", flexDirection: "column" }}>
      <PageMeta title="Nueva contraseña" description="Crea una nueva contraseña para tu cuenta Weincard." path="/reset-password" />

      <header style={{ background: "#000", color: "#fff" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "20px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link to="/">
            <img src="/logo-weincard.png" alt="Weincard" style={{ height: "20px", width: "auto" }} />
          </Link>
          <Link
            to="/login"
            style={{ color: "#fff", textDecoration: "none", fontSize: "13px", fontFamily: '"Hepta Slab", serif', opacity: 1, transition: "opacity 0.15s" }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            ¿Ya tienes cuenta? <strong style={{ textDecoration: "underline" }}>Inicia sesión</strong>
          </Link>
        </div>
      </header>

      <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 16px" }}>
        <div style={{ background: "#fff", borderRadius: "16px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", padding: "32px", width: "100%", maxWidth: "440px", margin: "0 auto" }}>

          {!token ? (
            <>
              <h2 style={headingStyle}>ENLACE INVÁLIDO</h2>
              <p style={{ fontSize: "13px", color: "#6b7280", fontFamily: '"Hepta Slab", serif', marginTop: "8px" }}>
                Este enlace de recuperación no es válido. Solicita uno nuevo desde la pantalla de inicio de sesión.
              </p>
              <div style={{ marginTop: "20px" }}>
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  style={{ width: "100%", padding: "12px", borderRadius: "9999px", background: "#000", color: "#fff", fontFamily: '"Clash Grotesk", sans-serif', fontWeight: 700, fontSize: "13px", border: "none", cursor: "pointer" }}
                >
                  Ir a iniciar sesión
                </button>
              </div>
            </>
          ) : success ? (
            <>
              <h2 style={headingStyle}>¡LISTO!</h2>
              <SuccessMsg msg="Tu contraseña fue actualizada correctamente." />
              <p style={{ fontSize: "13px", color: "#6b7280", fontFamily: '"Hepta Slab", serif', marginTop: "16px", textAlign: "center" }}>
                Vuelve a la app Weincard e inicia sesión con tu nueva contraseña.
              </p>
            </>
          ) : (
            <>
              <div style={{ marginBottom: "20px" }}>
                <h2 style={headingStyle}>NUEVA CONTRASEÑA</h2>
                <p style={{ fontSize: "13px", color: "#6b7280", fontFamily: '"Hepta Slab", serif' }}>
                  Elige una contraseña segura para tu cuenta.
                </p>
              </div>
              <form onSubmit={handleSubmit} noValidate>
                <div style={{ marginBottom: "12px" }}>
                  <FormInput
                    label="Nueva contraseña"
                    required
                    id="password"
                    type="password"
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mínimo 8 caracteres"
                    autoFocus
                  />
                  <p style={{ fontSize: "12px", color: "#6b6375", marginTop: "6px" }}>
                    {PASSWORD_REQUIREMENTS_HINT}
                  </p>
                </div>
                <div style={{ marginBottom: "12px" }}>
                  <FormInput
                    label="Confirmar contraseña"
                    required
                    id="confirm"
                    type="password"
                    autoComplete="new-password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="Repite tu contraseña"
                  />
                </div>
                {error && <ErrorMsg msg={error} />}
                <SubmitButton disabled={isLoading || !password || !confirm} loading={isLoading}>
                  Guardar contraseña
                </SubmitButton>
              </form>
            </>
          )}

          <p style={{ textAlign: "center", fontSize: "11px", color: "#9ca3af", fontFamily: '"Hepta Slab", serif', marginTop: "16px" }}>
            Al continuar aceptas nuestros{" "}
            <Link to="/terminos-y-condiciones" style={{ color: "inherit", textDecoration: "underline" }}>Términos</Link>
            {" "}y{" "}
            <Link to="/politica-de-privacidad" style={{ color: "inherit", textDecoration: "underline" }}>Privacidad</Link>.
          </p>
        </div>
      </main>
    </div>
  );
}

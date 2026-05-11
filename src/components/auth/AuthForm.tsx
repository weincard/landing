import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { requestOtp, verifyOtp, getMe } from "@/api/auth";
import { updateUser } from "@/api/users";
import type { AuthMode, Step } from "./authTypes";
import { STEPS_FOR_MODE } from "./authTypes";
import { StepIndicator } from "./StepIndicator";
import { ErrorMsg } from "./ErrorMsg";
import { SuccessMsg } from "./SuccessMsg";
import { SubmitButton } from "./SubmitButton";
import { FormInput } from "./FormInput";

interface AuthFormProps {
  mode: AuthMode;
  onComplete?: (email: string) => void;
  planLabel?: string;
}

const headingStyle: React.CSSProperties = {
  fontFamily: '"Clash Grotesk", sans-serif',
  fontWeight: 700,
  fontSize: "22px",
  color: "#000",
  letterSpacing: "-0.02em",
  marginBottom: "4px",
};

export function AuthForm({ mode, onComplete, planLabel }: AuthFormProps) {
  const { login, refreshUser } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const steps = STEPS_FOR_MODE[mode];
  const showStepIndicator = steps.length > 2;

  useEffect(() => {
    if (step === "otp") {
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    }
  }, [step]);

  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault();
    if (phone.length !== 10) {
      setError("El número debe tener exactamente 10 dígitos.");
      return;
    }
    setError("");
    setIsLoading(true);
    try {
      const res = await requestOtp(phone);
      setSuccessMsg(
        (res.data as { message?: string })?.message ?? "Código enviado por WhatsApp."
      );
      setStep("otp");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg ?? "Error al enviar el código.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleResendOtp() {
    setError("");
    setSuccessMsg("");
    setOtp(["", "", "", "", "", ""]);
    setIsLoading(true);
    try {
      await requestOtp(phone);
      setSuccessMsg("Código reenviado por WhatsApp.");
    } catch {
      setError("Error al reenviar el código.");
    } finally {
      setIsLoading(false);
    }
  }

  function handleOtpChange(index: number, value: string) {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);
    if (digit && index < 5) otpRefs.current[index + 1]?.focus();
  }

  function handleOtpKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  }

  function handleOtpPaste(e: React.ClipboardEvent<HTMLInputElement>) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    const next = [...otp];
    for (let i = 0; i < 6; i++) next[i] = pasted[i] ?? "";
    setOtp(next);
    otpRefs.current[Math.min(pasted.length, 5)]?.focus();
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    const code = otp.join("");
    if (code.length !== 6) {
      setError("Ingresa el código de 6 dígitos completo.");
      return;
    }
    setError("");
    setIsLoading(true);
    try {
      const res = await verifyOtp(phone, code);
      await login(res.data.accessToken);

      const meRes = await getMe();
      const me = meRes.data;
      setUserId(me.id);

      if (mode === "login") {
        if (!me.name) {
          setStep("profile");
        } else {
          onComplete?.(me.email ?? "");
          navigate("/catalogo");
        }
        return;
      }

      if (mode === "register") {
        if (!me.name) {
          setStep("profile");
        } else {
          navigate("/catalogo");
        }
        return;
      }

      // checkout
      if (!me.name) {
        setStep("profile");
      } else if (!me.email) {
        setStep("email");
      } else {
        onComplete?.(me.email);
      }
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg ?? "Código incorrecto o expirado.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!userId) return;
    setError("");
    setIsLoading(true);
    try {
      await updateUser(userId, {
        name: `${firstName.trim()} ${lastName.trim()}`,
        ...(email.trim() ? { email: email.trim() } : {}),
      });
      await refreshUser();

      if (mode === "checkout") {
        if (!email.trim()) {
          setStep("email");
        } else {
          onComplete?.(email.trim());
        }
      } else {
        navigate("/catalogo");
      }
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg ?? "Error al guardar los datos.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSaveEmail(e: React.FormEvent) {
    e.preventDefault();
    if (!userId || !email.trim()) return;
    setError("");
    setIsLoading(true);
    try {
      await updateUser(userId, { email: email.trim() });
      await refreshUser();
      onComplete?.(email.trim());
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg ?? "Error al guardar el correo.");
    } finally {
      setIsLoading(false);
    }
  }

  const otpFilled = otp.every((d) => d !== "");

  return (
    <div>
      {planLabel && (
        <p
          style={{
            fontSize: "11px",
            fontFamily: '"Clash Grotesk", sans-serif',
            fontWeight: 700,
            color: "#FF3B47",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            marginBottom: "6px",
          }}
        >
          {planLabel}
        </p>
      )}

      {showStepIndicator && (
        <div style={{ marginBottom: "24px" }}>
          <StepIndicator steps={steps} current={step} />
        </div>
      )}

      {/* Phone */}
      {step === "phone" && (
        <>
          <div style={{ marginBottom: "20px" }}>
            <h2 style={headingStyle}>
              {mode === "login" ? "INICIAR SESIÓN" : mode === "register" ? "CREAR CUENTA" : "INGRESA TU NÚMERO"}
            </h2>
            <p style={{ fontSize: "13px", color: "#6b7280", fontFamily: '"Hepta Slab", serif' }}>
              {mode === "login"
                ? "Te enviaremos un código por WhatsApp."
                : mode === "register"
                ? "Te enviaremos un código por WhatsApp para verificar tu número."
                : "Te enviaremos un código por WhatsApp."}
            </p>
          </div>
          <form onSubmit={handleSendOtp} noValidate>
            <div style={{ marginBottom: "12px" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 500, color: "#374151", marginBottom: "6px" }}>
                Número de celular <span style={{ color: "#FF3B47" }}>*</span>
              </label>
              <div style={{ display: "flex" }}>
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "0 14px",
                    background: "#f9fafb",
                    border: "1px solid #d1d5db",
                    borderRight: "none",
                    borderRadius: "8px 0 0 8px",
                    fontSize: "13px",
                    color: "#4b5563",
                    fontWeight: 500,
                    userSelect: "none",
                    flexShrink: 0,
                  }}
                >
                  +57
                </span>
                <input
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel-national"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  placeholder="3001234567"
                  maxLength={10}
                  autoFocus
                  style={{
                    flex: 1,
                    padding: "12px 14px",
                    border: "1px solid #d1d5db",
                    borderRadius: "0 8px 8px 0",
                    fontSize: "14px",
                    outline: "none",
                    transition: "box-shadow 0.15s",
                    fontFamily: "inherit",
                  }}
                  onFocus={(e) => (e.currentTarget.style.boxShadow = "0 0 0 2px #FF3B47")}
                  onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
                />
              </div>
              <p style={{ fontSize: "11px", color: "#9ca3af", marginTop: "4px" }}>10 dígitos sin el indicativo.</p>
            </div>
            {error && <ErrorMsg msg={error} />}
            <SubmitButton disabled={isLoading || phone.length !== 10} loading={isLoading}>
              Enviar código
            </SubmitButton>
          </form>
        </>
      )}

      {/* OTP */}
      {step === "otp" && (
        <>
          <div style={{ marginBottom: "20px" }}>
            <h2 style={headingStyle}>
              {mode === "register" ? "VERIFICA TU NÚMERO" : "VERIFICA TU CÓDIGO"}
            </h2>
            <p style={{ fontSize: "13px", color: "#6b7280", fontFamily: '"Hepta Slab", serif' }}>
              Código de 6 dígitos enviado al <strong style={{ color: "#374151" }}>+57 {phone}</strong>.
            </p>
          </div>
          {successMsg && <SuccessMsg msg={successMsg} />}
          <form onSubmit={handleVerifyOtp} noValidate>
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 500, color: "#374151", marginBottom: "8px" }}>
                Código OTP <span style={{ color: "#FF3B47" }}>*</span>
              </label>
              <div style={{ display: "flex", gap: "8px", justifyContent: "space-between" }}>
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => { otpRefs.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    onPaste={i === 0 ? handleOtpPaste : undefined}
                    className="otp-input"
                    aria-label={`Dígito ${i + 1}`}
                  />
                ))}
              </div>
            </div>
            {error && <ErrorMsg msg={error} />}
            <SubmitButton disabled={isLoading || !otpFilled} loading={isLoading}>
              Verificar y continuar
            </SubmitButton>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "12px", fontSize: "13px", fontFamily: '"Hepta Slab", serif' }}>
              <button
                type="button"
                onClick={() => { setStep("phone"); setError(""); setSuccessMsg(""); setOtp(["", "", "", "", "", ""]); }}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#6b7280", textDecoration: "underline", fontSize: "13px", fontFamily: "inherit" }}
              >
                Cambiar número
              </button>
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={isLoading}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#FF3B47", fontWeight: 700, fontSize: "13px", fontFamily: "inherit" }}
              >
                Reenviar código
              </button>
            </div>
          </form>
        </>
      )}

      {/* Profile */}
      {step === "profile" && (
        <>
          <div style={{ marginBottom: "20px" }}>
            <h2 style={headingStyle}>TUS DATOS</h2>
            <p style={{ fontSize: "13px", color: "#6b7280", fontFamily: '"Hepta Slab", serif' }}>
              {mode === "checkout"
                ? "Necesitamos tu nombre y correo para continuar."
                : "Cuéntanos cómo te llamas para personalizar tu experiencia."}
            </p>
          </div>
          <form onSubmit={handleSaveProfile} noValidate>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
              <FormInput label="Nombre" required id="firstName" type="text" autoComplete="given-name" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Juan" autoFocus />
              <FormInput label="Apellido" required id="lastName" type="text" autoComplete="family-name" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Pérez" />
            </div>
            <div style={{ marginBottom: "12px" }}>
              <FormInput
                label="Correo electrónico"
                required={mode === "checkout"}
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="juan@ejemplo.com"
              />
              {mode !== "checkout" && (
                <p style={{ fontSize: "11px", color: "#9ca3af", marginTop: "4px" }}>
                  Opcional. Lo necesitarás para adquirir una membresía.
                </p>
              )}
            </div>
            {error && <ErrorMsg msg={error} />}
            <SubmitButton
              disabled={isLoading || !firstName.trim() || !lastName.trim() || (mode === "checkout" && !email.trim())}
              loading={isLoading}
            >
              {mode === "checkout" ? "Continuar al pago" : "Guardar y continuar"}
            </SubmitButton>
          </form>
        </>
      )}

      {/* Email */}
      {step === "email" && (
        <>
          <div style={{ marginBottom: "20px" }}>
            <h2 style={headingStyle}>TU CORREO</h2>
            <p style={{ fontSize: "13px", color: "#6b7280", fontFamily: '"Hepta Slab", serif' }}>
              Necesitamos tu correo para procesar el pago.
            </p>
          </div>
          <form onSubmit={handleSaveEmail} noValidate>
            <div style={{ marginBottom: "12px" }}>
              <FormInput label="Correo electrónico" required id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@correo.com" autoFocus />
            </div>
            {error && <ErrorMsg msg={error} />}
            <SubmitButton disabled={isLoading || !email.trim()} loading={isLoading}>
              Ir al pago
            </SubmitButton>
          </form>
        </>
      )}

      {step !== "profile" && (
        <p style={{ textAlign: "center", fontSize: "11px", color: "#9ca3af", fontFamily: '"Hepta Slab", serif', marginTop: "16px" }}>
          Al continuar aceptas nuestros{" "}
          <Link to="/terminos-y-condiciones" style={{ color: "inherit", textDecoration: "underline" }}>Términos</Link>
          {" "}y{" "}
          <Link to="/politica-de-privacidad" style={{ color: "inherit", textDecoration: "underline" }}>Privacidad</Link>.
        </p>
      )}
    </div>
  );
}

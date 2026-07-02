import { useState, useRef, useEffect } from "react";
import { Loader } from "@mantine/core";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
  requestOtp,
  verifyOtp,
  emailCheck,
  emailSendCode,
  emailVerifyCode,
  emailSetPassword,
  emailLogin,
  forgotPassword,
  getMe,
} from "@/api/auth";
import { completeRegistration, getUserStatus } from "@/api/users";
import { createCheckoutSession } from "@/api/memberships";
import { useShowCouponInput } from "@/hooks/useAppConfig";
import { useEmailVerificationGate } from "@/hooks/useEmailVerificationGate";
import { DOCUMENT_TYPES, validateDocument } from "@/lib/documentTypes";
import { validatePassword, PASSWORD_MIN_LENGTH, PASSWORD_REQUIREMENTS_HINT } from "@/lib/password";
import {
  DEFAULT_COUNTRY,
  composePhone,
  splitPhone,
  type Country,
} from "@/lib/countries";
import type { PlanKey } from "@/types";
import { ErrorMsg } from "./ErrorMsg";
import { SuccessMsg } from "./SuccessMsg";
import { SubmitButton } from "./SubmitButton";
import { FormInput } from "./FormInput";
import { CodeInput } from "./CodeInput";
import { PhoneCountryInput } from "./PhoneCountryInput";

// One unified auth funnel for the whole app. Both identity methods (phone OTP
// and email+password) converge on a shared profile step, then a membership-aware
// finish that either lands the user in /app or opens the Treli checkout.

type Step =
  | "identify"
  | "otp"
  | "email-code"
  | "email-set-password"
  | "email-login-password"
  | "register"
  | "subscribe";

type Method = "phone" | "email";

const headingStyle: React.CSSProperties = {
  fontFamily: '"Clash Grotesk", sans-serif',
  fontWeight: 700,
  fontSize: "22px",
  color: "#000",
  letterSpacing: "-0.02em",
  marginBottom: "4px",
};

const subStyle: React.CSSProperties = {
  fontSize: "13px",
  color: "#6b7280",
  fontFamily: '"Hepta Slab", serif',
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "13px",
  fontWeight: 500,
  color: "#374151",
  marginBottom: "6px",
};

function apiError(err: unknown, fallback: string): string {
  return (
    (err as { response?: { data?: { message?: string } } })?.response?.data
      ?.message ?? fallback
  );
}

export function RegistroFlow() {
  const { login, refreshUser, isLoggedIn, profileComplete, isLoading: authLoading } = useAuth();
  const showCouponInput = useShowCouponInput();
  const gate = useEmailVerificationGate();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const next = params.get("next") || "/app/card";
  const planParam = (params.get("plan") as PlanKey | null) ?? null;

  const [step, setStep] = useState<Step>("identify");
  const [method, setMethod] = useState<Method>("phone");

  // shared field state
  const [phone, setPhone] = useState("");
  // Country for the phone-identify (login/signup) step. Defaults to Colombia but
  // the user may pick any dial code; the chosen country is composed into the
  // full E.164 phone sent to the OTP endpoints.
  const [identifyCountry, setIdentifyCountry] = useState<Country>(DEFAULT_COUNTRY);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [document, setDocument] = useState("");
  const [documentType, setDocumentType] = useState("CC");
  const [couponCode, setCouponCode] = useState("");
  // Data-step phone (with country picker). For the phone-signup path it's the
  // already-verified login number (locked); for email signup it's a new field.
  const [regCountry, setRegCountry] = useState<Country>(DEFAULT_COUNTRY);
  const [regNumber, setRegNumber] = useState("");
  const [consent, setConsent] = useState(false);

  // flow control state
  const [emailFlowToken, setEmailFlowToken] = useState<string | undefined>();
  const [plan, setPlan] = useState<PlanKey>(planParam ?? "monthly");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Auto-skip the funnel only for users who arrive ALREADY onboarded and haven't
  // started it. Gated on `step === "identify"` so it can't fire once the flow has
  // driven the user forward (e.g. completing registration flips profileComplete
  // true while they're on the subscribe step — we must not redirect then).
  const redirectedRef = useRef(false);
  useEffect(() => {
    if (authLoading || redirectedRef.current) return;
    if (step === "identify" && isLoggedIn && profileComplete) {
      redirectedRef.current = true;
      navigate(next, { replace: true });
    }
  }, [authLoading, isLoggedIn, profileComplete, step, next, navigate]);

  function resetMessages() {
    setError("");
    setSuccessMsg("");
  }

  // ───────── Shared post-authentication routing ─────────
  // Decide where the user goes once a JWT is in hand: complete their profile,
  // land them in the app, or prompt the Treli subscription.
  async function afterLogin(token: string, knownEmail?: string) {
    await login(token);
    const me = await getMe();
    const complete = !!(me.name && me.email && me.document);
    if (!complete) {
      if (me.firstName) setFirstName(me.firstName);
      if (me.lastName) setLastName(me.lastName);
      if (me.email || knownEmail) setEmail(me.email ?? knownEmail ?? "");
      if (me.document) setDocument(me.document);
      // Prefill the phone field: an existing account phone (already verified via
      // OTP login) takes precedence; otherwise seed from the number just typed
      // on the phone-identify step.
      if (me.phone) {
        const split = splitPhone(me.phone);
        setRegCountry(split.country);
        setRegNumber(split.number);
      } else if (method === "phone" && phone) {
        setRegCountry(identifyCountry);
        setRegNumber(phone);
      }
      setStep("register");
      return;
    }
    await landAfterAuth(me.email ?? knownEmail ?? "");
  }

  async function landAfterAuth(userEmail: string) {
    const status = await getUserStatus();
    const hasMembership = [
      "active",
      "pending_cancel",
      "trialing",
      "unpaid",
    ].includes(status.data.membership?.status ?? "");
    await refreshUser();
    if (hasMembership) {
      navigate(next, { replace: true });
      return;
    }
    setEmail(status.data.userInfo?.email ?? userEmail);
    setStep("subscribe");
  }

  // ───────── identify: phone ─────────
  async function submitPhone(e: React.FormEvent) {
    e.preventDefault();
    // Colombian mobiles are exactly 10 digits; other countries vary, so only
    // enforce a sane general range when a non-CO dial code is chosen.
    if (identifyCountry.code === "CO") {
      if (phone.length !== 10) {
        setError("El número debe tener exactamente 10 dígitos.");
        return;
      }
    } else if (phone.length < 6 || phone.length > 15) {
      setError("Ingresa un número de teléfono válido.");
      return;
    }
    resetMessages();
    setIsLoading(true);
    try {
      const res = await requestOtp(composePhone(identifyCountry, phone));
      setSuccessMsg(res.data?.message ?? "Código enviado por WhatsApp.");
      setCode(["", "", "", "", "", ""]);
      setStep("otp");
    } catch (err) {
      setError(apiError(err, "Error al enviar el código."));
    } finally {
      setIsLoading(false);
    }
  }

  async function submitOtp(e: React.FormEvent) {
    e.preventDefault();
    const joined = code.join("");
    if (joined.length !== 6) {
      setError("Ingresa el código de 6 dígitos completo.");
      return;
    }
    resetMessages();
    setIsLoading(true);
    try {
      const res = await verifyOtp(composePhone(identifyCountry, phone), joined);
      await afterLogin(res.data.accessToken);
    } catch (err) {
      setError(apiError(err, "Código incorrecto o expirado."));
    } finally {
      setIsLoading(false);
    }
  }

  // ───────── identify: email ─────────
  async function submitEmail(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    resetMessages();
    setIsLoading(true);
    try {
      const res = await emailCheck(email.trim());
      if (res.data.exists && res.data.verified) {
        setStep("email-login-password");
      } else {
        await emailSendCode(email.trim());
        setCode(["", "", "", "", "", ""]);
        setSuccessMsg("Código enviado a tu correo.");
        setStep("email-code");
      }
    } catch (err) {
      setError(apiError(err, "No pudimos validar tu correo."));
    } finally {
      setIsLoading(false);
    }
  }

  async function submitEmailCode(e: React.FormEvent) {
    e.preventDefault();
    const joined = code.join("");
    if (joined.length !== 6) {
      setError("Ingresa el código de 6 dígitos completo.");
      return;
    }
    resetMessages();
    setIsLoading(true);
    try {
      const res = await emailVerifyCode(email.trim(), joined);
      if (res.data.type === "new_user") {
        // Bearer token authorizes the upcoming set-password call.
        await login(res.data.accessToken);
        setEmailFlowToken(undefined);
      } else {
        setEmailFlowToken(res.data.verificationToken);
      }
      setPassword("");
      setStep("email-set-password");
    } catch (err) {
      setError(apiError(err, "Código incorrecto o expirado."));
    } finally {
      setIsLoading(false);
    }
  }

  async function submitSetPassword(e: React.FormEvent) {
    e.preventDefault();
    const pwError = validatePassword(password);
    if (pwError) {
      setError(pwError);
      return;
    }
    resetMessages();
    setIsLoading(true);
    try {
      const res = await emailSetPassword({
        email: email.trim(),
        password,
        verificationToken: emailFlowToken,
      });
      await afterLogin(res.data.accessToken, email.trim());
    } catch (err) {
      setError(apiError(err, "No pudimos guardar tu contraseña."));
    } finally {
      setIsLoading(false);
    }
  }

  async function submitEmailLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!password) return;
    resetMessages();
    setIsLoading(true);
    try {
      const res = await emailLogin(email.trim(), password);
      await afterLogin(res.data.accessToken, email.trim());
    } catch (err) {
      setError(apiError(err, "Correo o contraseña incorrectos."));
    } finally {
      setIsLoading(false);
    }
  }

  async function handleForgot() {
    if (!email.trim()) return;
    resetMessages();
    setIsLoading(true);
    try {
      await forgotPassword(email.trim());
      setSuccessMsg("Si el correo existe, te enviamos un enlace para restablecer tu contraseña.");
    } catch (err) {
      setError(apiError(err, "No pudimos enviar el correo."));
    } finally {
      setIsLoading(false);
    }
  }

  // ───────── register (shared profile step) ─────────
  async function submitRegister(e: React.FormEvent) {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !document.trim())
      return;
    const docError = validateDocument(documentType, document);
    if (docError) {
      setError(docError);
      return;
    }
    if (!consent) {
      setError("Debes aceptar los términos y la política de privacidad para continuar.");
      return;
    }
    resetMessages();
    setIsLoading(true);
    try {
      await completeRegistration({
        name: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        document: document.trim(),
        documentType,
        ...(regNumber.trim() ? { phone: composePhone(regCountry, regNumber) } : {}),
        ...(couponCode.trim() ? { couponCode: couponCode.trim() } : {}),
        termsAcceptedAt: new Date().toISOString(),
      });
      await landAfterAuth(email.trim());
    } catch (err) {
      setError(apiError(err, "No pudimos completar tu registro."));
    } finally {
      setIsLoading(false);
    }
  }

  // ───────── subscribe (Treli checkout prompt) ─────────
  async function goToCheckout() {
    resetMessages();
    // Treli needs a verified email — if it isn't, open the verification modal
    // (which resumes into checkout via ?then=checkout) instead of paying now.
    if (gate(plan)) return;
    setIsLoading(true);
    try {
      const res = await createCheckoutSession(email.trim(), plan);
      if (res.data?.url) {
        window.location.href = res.data.url;
      } else {
        throw new Error("no url");
      }
    } catch (err) {
      setError(apiError(err, "No pudimos iniciar el pago."));
      setIsLoading(false);
    }
  }

  // ─────────────────────────── Render ───────────────────────────
  return (
    <div>
      {/* identify */}
      {step === "identify" && (
        <>
          <div style={{ marginBottom: "20px" }}>
            <h2 style={headingStyle}>INGRESA O CREA TU CUENTA</h2>
            <p style={subStyle}>Un solo lugar para acceder a Weincard.</p>
          </div>

          {/* method toggle */}
          <div
            style={{
              display: "flex",
              background: "#f3f4f6",
              borderRadius: "9999px",
              padding: "4px",
              marginBottom: "20px",
            }}
          >
            {(["phone", "email"] as Method[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => {
                  setMethod(m);
                  resetMessages();
                }}
                style={{
                  flex: 1,
                  padding: "9px",
                  borderRadius: "9999px",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: '"Clash Grotesk", sans-serif',
                  fontWeight: 700,
                  fontSize: "12px",
                  background: method === m ? "#000" : "transparent",
                  color: method === m ? "#fff" : "#6b7280",
                  transition: "all 0.15s",
                }}
              >
                {m === "phone" ? "Teléfono" : "Correo"}
              </button>
            ))}
          </div>

          {successMsg && <SuccessMsg msg={successMsg} />}

          {method === "phone" ? (
            <form onSubmit={submitPhone} noValidate>
              <div style={{ marginBottom: "12px" }}>
                <PhoneCountryInput
                  country={identifyCountry}
                  number={phone}
                  onCountryChange={setIdentifyCountry}
                  onNumberChange={setPhone}
                  required
                  autoFocus
                />
                <p style={{ fontSize: "11px", color: "#9ca3af", marginTop: "4px" }}>
                  Te enviaremos un código por WhatsApp.
                </p>
              </div>
              {error && <ErrorMsg msg={error} />}
              <SubmitButton
                disabled={
                  isLoading ||
                  (identifyCountry.code === "CO"
                    ? phone.length !== 10
                    : phone.length < 6 || phone.length > 15)
                }
                loading={isLoading}
              >
                Enviar código
              </SubmitButton>
            </form>
          ) : (
            <form onSubmit={submitEmail} noValidate>
              <div style={{ marginBottom: "12px" }}>
                <FormInput
                  label="Correo electrónico"
                  required
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@correo.com"
                  autoFocus
                />
              </div>
              {error && <ErrorMsg msg={error} />}
              <SubmitButton disabled={isLoading || !email.trim()} loading={isLoading}>
                Continuar
              </SubmitButton>
            </form>
          )}
        </>
      )}

      {/* otp (phone) */}
      {step === "otp" && (
        <>
          <div style={{ marginBottom: "20px" }}>
            <h2 style={headingStyle}>VERIFICA TU NÚMERO</h2>
            <p style={subStyle}>
              Código de 6 dígitos enviado al{" "}
              <strong style={{ color: "#374151" }}>{identifyCountry.dial} {phone}</strong>.
            </p>
          </div>
          {successMsg && <SuccessMsg msg={successMsg} />}
          <form onSubmit={submitOtp} noValidate>
            <div style={{ marginBottom: "16px" }}>
              <label style={labelStyle}>
                Código OTP <span style={{ color: "#FF3B47" }}>*</span>
              </label>
              <CodeInput value={code} onChange={setCode} />
            </div>
            {error && <ErrorMsg msg={error} />}
            <SubmitButton disabled={isLoading || code.join("").length !== 6} loading={isLoading}>
              Verificar y continuar
            </SubmitButton>
          </form>
          <BackLink onClick={() => { setStep("identify"); resetMessages(); }} />
        </>
      )}

      {/* email-code */}
      {step === "email-code" && (
        <>
          <div style={{ marginBottom: "20px" }}>
            <h2 style={headingStyle}>VERIFICA TU CORREO</h2>
            <p style={subStyle}>
              Código de 6 dígitos enviado a{" "}
              <strong style={{ color: "#374151" }}>{email}</strong>.
            </p>
          </div>
          {successMsg && <SuccessMsg msg={successMsg} />}
          <form onSubmit={submitEmailCode} noValidate>
            <div style={{ marginBottom: "16px" }}>
              <label style={labelStyle}>
                Código <span style={{ color: "#FF3B47" }}>*</span>
              </label>
              <CodeInput value={code} onChange={setCode} />
            </div>
            {error && <ErrorMsg msg={error} />}
            <SubmitButton disabled={isLoading || code.join("").length !== 6} loading={isLoading}>
              Verificar
            </SubmitButton>
          </form>
          <BackLink onClick={() => { setStep("identify"); resetMessages(); }} />
        </>
      )}

      {/* email-set-password */}
      {step === "email-set-password" && (
        <>
          <div style={{ marginBottom: "20px" }}>
            <h2 style={headingStyle}>CREA TU CONTRASEÑA</h2>
            <p style={subStyle}>La usarás para iniciar sesión con tu correo.</p>
          </div>
          <form onSubmit={submitSetPassword} noValidate>
            <div style={{ marginBottom: "12px" }}>
              <FormInput
                label="Contraseña"
                required
                id="new-password"
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
            {error && <ErrorMsg msg={error} />}
            <SubmitButton disabled={isLoading || password.length < PASSWORD_MIN_LENGTH} loading={isLoading}>
              Continuar
            </SubmitButton>
          </form>
        </>
      )}

      {/* email-login-password */}
      {step === "email-login-password" && (
        <>
          <div style={{ marginBottom: "20px" }}>
            <h2 style={headingStyle}>INICIA SESIÓN</h2>
            <p style={subStyle}>
              Ingresa la contraseña de{" "}
              <strong style={{ color: "#374151" }}>{email}</strong>.
            </p>
          </div>
          {successMsg && <SuccessMsg msg={successMsg} />}
          <form onSubmit={submitEmailLogin} noValidate>
            <div style={{ marginBottom: "12px" }}>
              <FormInput
                label="Contraseña"
                required
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
              />
            </div>
            {error && <ErrorMsg msg={error} />}
            <SubmitButton disabled={isLoading || !password} loading={isLoading}>
              Entrar
            </SubmitButton>
          </form>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "12px" }}>
            <button type="button" onClick={() => { setStep("identify"); resetMessages(); }} style={linkBtnStyle}>
              Cambiar correo
            </button>
            <button type="button" onClick={handleForgot} disabled={isLoading} style={{ ...linkBtnStyle, color: "#FF3B47", fontWeight: 700 }}>
              Olvidé mi contraseña
            </button>
          </div>
        </>
      )}

      {/* register (shared profile step) */}
      {step === "register" && (
        <>
          <div style={{ marginBottom: "20px" }}>
            <h2 style={headingStyle}>TUS DATOS</h2>
            <p style={subStyle}>Necesitamos estos datos para crear tu membresía.</p>
          </div>
          <form onSubmit={submitRegister} noValidate>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
              <FormInput label="Nombre" required id="firstName" type="text" autoComplete="given-name" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Juan" autoFocus />
              <FormInput label="Apellido" required id="lastName" type="text" autoComplete="family-name" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Pérez" />
            </div>
            <div style={{ marginBottom: "12px" }}>
              {/* Email is the verified credential on the email path, so it's
                  locked there (changing it would break the verified linkage and
                  can trigger the collision 409). On the phone path it's a new
                  field the user must enter. */}
              <FormInput
                label="Correo electrónico"
                required
                id="reg-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="juan@ejemplo.com"
                readOnly={method === "email"}
                style={
                  method === "email"
                    ? { background: "#f3f4f6", color: "#6b7280", cursor: "not-allowed" }
                    : undefined
                }
              />
              {method === "email" && (
                <p style={{ fontSize: "11px", color: "#9ca3af", marginTop: "4px" }}>
                  Correo verificado.
                </p>
              )}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: "12px", marginBottom: "12px" }}>
              <div>
                <label style={labelStyle}>Tipo</label>
                <select
                  value={documentType}
                  onChange={(e) => setDocumentType(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px 10px",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontFamily: "inherit",
                    background: "#fff",
                    boxSizing: "border-box",
                  }}
                >
                  {DOCUMENT_TYPES.map((dt) => (
                    <option key={dt.value} value={dt.value}>
                      {dt.label}
                    </option>
                  ))}
                </select>
              </div>
              <FormInput label="Documento" required id="document" type="text" inputMode="numeric" value={document} onChange={(e) => setDocument(e.target.value)} placeholder="1234567890" />
            </div>
            <div style={{ marginBottom: "12px" }}>
              <PhoneCountryInput
                country={regCountry}
                number={regNumber}
                onCountryChange={setRegCountry}
                onNumberChange={setRegNumber}
                disabled={method === "phone"}
              />
              {method === "phone" && (
                <p style={{ fontSize: "11px", color: "#9ca3af", marginTop: "4px" }}>
                  Teléfono verificado.
                </p>
              )}
            </div>
            {showCouponInput && (
              <div style={{ marginBottom: "12px" }}>
                <FormInput label="Código promocional" id="coupon" type="text" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} placeholder="Opcional" />
              </div>
            )}
            <label
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "8px",
                marginBottom: "14px",
                fontSize: "12px",
                color: "#4b5563",
                fontFamily: '"Hepta Slab", serif',
                lineHeight: 1.5,
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                style={{ marginTop: "2px", flexShrink: 0, accentColor: "#FF3B47", width: "16px", height: "16px" }}
              />
              <span>
                Acepto los{" "}
                <Link to="/terminos-y-condiciones" target="_blank" style={{ color: "#FF3B47", textDecoration: "underline" }}>Términos y Condiciones</Link>
                , la{" "}
                <Link to="/politica-de-privacidad" target="_blank" style={{ color: "#FF3B47", textDecoration: "underline" }}>Política de Privacidad</Link>
                {" "}y la{" "}
                <Link to="/politica-de-cookies" target="_blank" style={{ color: "#FF3B47", textDecoration: "underline" }}>Política de Cookies</Link>.
              </span>
            </label>
            {error && <ErrorMsg msg={error} />}
            <SubmitButton
              disabled={isLoading || !consent || !firstName.trim() || !lastName.trim() || !email.trim() || !document.trim()}
              loading={isLoading}
            >
              Crear mi cuenta
            </SubmitButton>
          </form>
        </>
      )}

      {/* subscribe (Treli prompt) */}
      {step === "subscribe" && (
        <>
          <div style={{ marginBottom: "20px" }}>
            <h2 style={headingStyle}>¡TU CUENTA ESTÁ LISTA!</h2>
            <p style={subStyle}>Activa tu membresía para empezar a ahorrar.</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "16px" }}>
            {(["monthly", "yearly"] as PlanKey[]).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPlan(p)}
                style={{
                  textAlign: "left",
                  padding: "14px 16px",
                  borderRadius: "12px",
                  border: plan === p ? "2px solid #000" : "1px solid #d1d5db",
                  background: plan === p ? "#fafafa" : "#fff",
                  cursor: "pointer",
                  fontFamily: '"Hepta Slab", serif',
                }}
              >
                <span style={{ fontFamily: '"Clash Grotesk", sans-serif', fontWeight: 700, fontSize: "14px" }}>
                  {p === "monthly" ? "Plan mensual" : "Plan anual"}
                </span>
                <span style={{ display: "block", fontSize: "12px", color: "#6b7280" }}>
                  {p === "monthly" ? "Renovación cada mes" : "Mejor precio, renovación anual"}
                </span>
              </button>
            ))}
          </div>
          {error && <ErrorMsg msg={error} />}
          <button
            type="button"
            onClick={goToCheckout}
            disabled={isLoading}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "9999px",
              background: isLoading ? "#d1d5db" : "#000",
              color: "#fff",
              fontFamily: '"Clash Grotesk", sans-serif',
              fontWeight: 700,
              fontSize: "13px",
              border: "none",
              cursor: isLoading ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            {isLoading && <Loader size={14} color="white" />}
            {isLoading ? "Cargando..." : "Ir al pago"}
          </button>
          <button
            type="button"
            onClick={() => navigate(next, { replace: true })}
            style={{ ...linkBtnStyle, width: "100%", textAlign: "center", marginTop: "10px" }}
          >
            Explorar primero
          </button>
        </>
      )}

      {step === "identify" && (
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

const linkBtnStyle: React.CSSProperties = {
  background: "none",
  border: "none",
  cursor: "pointer",
  color: "#6b7280",
  textDecoration: "underline",
  fontSize: "13px",
  fontFamily: '"Hepta Slab", serif',
};

function BackLink({ onClick }: { onClick: () => void }) {
  return (
    <div style={{ marginTop: "12px" }}>
      <button type="button" onClick={onClick} style={linkBtnStyle}>
        ← Volver
      </button>
    </div>
  );
}

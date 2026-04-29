"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { getToken } from "@/lib/auth";
import API_BASE from "@/lib/api";
import { CheckoutAuthModal } from "@/components/checkout-auth-modal";

function getAppStoreUrl(): string {
  if (typeof window === "undefined")
    return "https://apps.apple.com/co/app/weincard/id6754571134";
  const ua = window.navigator.userAgent;
  const isAndroidOrWindows = /Android|Windows/i.test(ua);
  if (isAndroidOrWindows) {
    return "https://play.google.com/store/apps/details?id=com.weincard.app.idp";
  }
  return "https://apps.apple.com/co/app/weincard/id6754571134";
}

export function ViewAppButton() {
  const [url, setUrl] = useState(
    "https://apps.apple.com/co/app/weincard/id6754571134",
  );

  useEffect(() => {
    setUrl(getAppStoreUrl());
  }, []);

  return (
    <a href={url} target="_blank" rel="noopener noreferrer">
      <Button className="rounded-full bg-black text-white font-bold hover:bg-black/90 px-8 mt-6 font-hepta-slab text-lg cursor-pointer">
        Ver la App
      </Button>
    </a>
  );
}

export function JoinNowButton() {
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    setLoggedIn(!!getToken());
  }, []);

  if (loggedIn === null || loggedIn) return null;

  return (
    <a href="/planes">
      <Button className="rounded-full bg-white text-black hover:bg-white/90 px-8 font-bold font-hepta-slab text-lg mt-6 cursor-pointer">
        Únete ahora
      </Button>
    </a>
  );
}

export function MobileMenu() {
  const [open, setOpen] = useState(false);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-mobile-menu]")) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div className="relative md:hidden" data-mobile-menu>
      <button
        onClick={() => setOpen((prev) => !prev)}
        aria-label={open ? "Cerrar menú" : "Abrir menú"}
        aria-expanded={open}
        className="flex flex-col justify-center items-center w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
      >
        {open ? (
          // X icon
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-5 h-5 text-white"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z"
              clipRule="evenodd"
            />
          </svg>
        ) : (
          // Hamburger icon
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-5 h-5 text-white"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M3 6.75A.75.75 0 0 1 3.75 6h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 6.75ZM3 12a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 12Zm0 5.25a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-44 rounded-2xl bg-white shadow-xl border border-gray-100 overflow-hidden z-50">
          <a
            href="/catalogo"
            onClick={() => setOpen(false)}
            className="flex items-center px-4 py-3 text-sm font-bold font-hepta-slab text-black hover:bg-gray-50 transition"
          >
            RESTAURANTES
          </a>
          <div className="border-t border-gray-100" />
          <a
            href="/planes"
            onClick={() => setOpen(false)}
            className="flex items-center px-4 py-3 text-sm font-bold font-hepta-slab text-black hover:bg-gray-50 transition"
          >
            PLANES
          </a>
        </div>
      )}
    </div>
  );
}

export function PromoCodeButton() {
  const [open, setOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    setLoggedIn(!!getToken());
  }, []);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  async function startCheckout(email: string) {
    setError(null);
    setLoading(true);
    const token = getToken();
    try {
      const res = await fetch(`${API_BASE}/memberships/session/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email, membershipPlan: "monthly" }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.message ?? "No se pudo iniciar el pago.");
      }
      const data = await res.json();
      if (data?.url) {
        window.open(data.url, "_blank", "noopener,noreferrer");
        setOpen(false);
      } else {
        throw new Error("No se recibió la URL de pago.");
      }
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Error al procesar el pago.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleActivate() {
    setError(null);
    setLoading(true);
    const token = getToken();
    try {
      const meRes = await fetch(`${API_BASE}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!meRes.ok) throw new Error("No se pudo obtener el usuario.");
      const me = await meRes.json();
      const email = me?.email;
      if (!email) {
        window.location.href = "/planes";
        return;
      }
      await startCheckout(email);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Error al procesar el pago.",
      );
    } finally {
      setLoading(false);
    }
  }

  function handleAuthSuccess(email: string) {
    setShowAuthModal(false);
    setLoggedIn(true);
    startCheckout(email);
  }

  function copyCode() {
    navigator.clipboard.writeText("BIENVENIDOWEB").then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="rounded-full bg-black text-white hover:bg-black/90 px-2 py-0 text-sm font-light font-hepta-slab cursor-pointer"
      >
        Comienza tu prueba<span className="font-bold">gratis de 30 días</span>
      </Button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div className="bg-cream text-black rounded-3xl shadow-2xl w-full max-w-md p-8 space-y-6 relative">
            <button
              onClick={() => setOpen(false)}
              aria-label="Cerrar"
              className="absolute top-4 right-4 text-black/40 hover:text-black transition text-xl leading-none"
            >
              ✕
            </button>

            <div className="text-center space-y-1">
              {loggedIn ? (
                <p className="font-hepta-slab text-sm text-black/60 uppercase tracking-widest">
                  Tu código de bienvenida
                </p>
              ) : (
                <p className="font-hepta-slab text-sm text-black/60 uppercase tracking-widest">
                  ¡Regístrate para usar el código!
                </p>
              )}
              <button
                onClick={copyCode}
                className="font-clash font-black text-4xl md:text-2xl tracking-widest bg-black text-white rounded-2xl px-6 py-3 hover:bg-black/80 transition active:scale-95 cursor-pointer select-all"
                title="Copiar código"
              >
                BIENVENIDOWEB
              </button>
              {copied && (
                <p className="text-xs font-hepta-slab text-green-600">
                  ¡Código copiado!
                </p>
              )}
            </div>

            {loggedIn ? (
              <div className="bg-black/5 rounded-2xl px-5 py-4 text-center">
                <p className="font-hepta-slab text-sm leading-relaxed text-black/70">
                  Recuerda ingresar el código y presionar{" "}
                  <span className="font-bold text-black">"APLICAR"</span>
                </p>
              </div>
            ) : null}

            {error && (
              <p className="text-sm text-red-600 font-hepta-slab text-center">
                {error}
              </p>
            )}

            {loggedIn === null ? null : loggedIn ? (
              <button
                onClick={handleActivate}
                disabled={loading}
                className="w-full py-3 rounded-xl bg-black text-white font-clash font-bold text-sm hover:bg-black/80 transition disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading && (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                {loading ? "Cargando..." : "Activar membresía"}
              </button>
            ) : (
              <button
                onClick={() => { setOpen(false); setShowAuthModal(true); }}
                className="w-full py-3 rounded-xl bg-black text-white font-clash font-bold text-sm hover:bg-black/80 transition text-center cursor-pointer"
              >
                Registrarme y activar
              </button>
            )}
          </div>
        </div>
      )}

      {showAuthModal && (
        <CheckoutAuthModal
          planKey="monthly"
          onSuccess={handleAuthSuccess}
          onClose={() => setShowAuthModal(false)}
        />
      )}
    </>
  );
}

export function FooterSubscribeLink() {
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    setLoggedIn(!!getToken());
  }, []);

  if (loggedIn === null || loggedIn) return null;

  return (
    <>
      <span className="hidden md:inline text-white">|</span>
      <a href="/planes" className="hover:text-white/70 transition">
        SUBSCRÍBETE
      </a>
    </>
  );
}

import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageMeta } from "@/components/layout/PageMeta";
import { PromoModal } from "@/components/home/PromoModal";
import { LogoCarousel } from "@/components/home/LogoCarousel";
import { HowItWorks } from "@/components/home/HowItWorks";
import { Testimonials } from "@/components/home/Testimonials";
import { FaqSection } from "@/components/home/FaqSection";
import { useAuth } from "@/context/AuthContext";

export function HomePage() {
  const { isLoggedIn } = useAuth();

  return (
    <main style={{ minHeight: "100vh", background: "#000" }}>
      <PageMeta
        title="Weincard"
        description="Membresías gastronómicas con beneficios exclusivos en los mejores restaurantes de Medellín. Descuentos reales, cada día."
        path="/"
      />
      {/* ── Hero ── */}
      <section style={{ background: "#f7f5f3", color: "#000" }}>
        <Header />

        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "48px 16px 64px",
          }}
        >
          <div className="hero-grid">
            {/* Image */}
            <div className="hero-image" style={{ order: 2 }}>
              <img
                src="/image-hero-weincard.webp"
                alt="Pareja disfrutando comida"
                style={{ width: "100%", height: "auto", display: "block" }}
              />
            </div>

            {/* Text */}
            <div
              className="hero-text"
              style={{
                order: 1,
                display: "flex",
                flexDirection: "column",
                gap: "24px",
                textAlign: "center",
              }}
            >
              <h1
                style={{
                  fontFamily: '"Clash Grotesk", sans-serif',
                  fontWeight: 900,
                  fontSize: "clamp(28px, 5vw, 48px)",
                  lineHeight: 1.05,
                  letterSpacing: "-0.02em",
                  color: "#000",
                }}
              >
                BENEFICIOS, REGALOS Y DESCUENTOS EN LOS MEJORES RESTAURANTES
              </h1>
              <hr style={{ borderColor: "rgba(0,0,0,0.15)" }} />
              <p
                style={{
                  fontFamily: '"Hepta Slab", serif',
                  fontSize: "clamp(15px, 2vw, 18px)",
                  lineHeight: 1.6,
                  color: "#000",
                }}
              >
                Multiplica tus salidas a comer por solo{" "}
                <strong>$18,900 COP/mes,</strong> o ahorra dos meses con una
                suscripción anual de <strong>$189,000 COP!</strong>
              </p>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <PromoModal />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Restaurant Logos ── */}
      <section
        id="restaurantes"
        style={{
          background: "#f7f5f3",
          color: "#000",
          padding: "32px 16px 64px",
          borderRadius: "0 0 60px 60px",
        }}
      >
        <div style={{ maxWidth: "1280px", margin: "0 auto", textAlign: "center" }}>
          <h2
            style={{
              fontFamily: '"Hepta Slab", serif',
              fontWeight: 300,
              fontSize: "clamp(26px, 5vw, 44px)",
              marginBottom: "32px",
              lineHeight: 1.2,
            }}
          >
            <span
              style={{
                fontFamily: '"Clash Grotesk", sans-serif',
                fontWeight: 700,
                display: "block",
              }}
            >
              DISFRUTA DE TUS
            </span>
            RESTAURANTES FAVORITOS
          </h2>

          <LogoCarousel />

          <div style={{ marginTop: "32px" }}>
            <a
              href={
                /iPhone|iPad|iPod|Macintosh/i.test(navigator.userAgent)
                  ? "https://apps.apple.com/co/app/weincard/id6754571134"
                  : "https://play.google.com/store/apps/details?id=com.weincard.app.idp"
              }
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-block",
                background: "#000",
                color: "#fff",
                borderRadius: "9999px",
                padding: "12px 24px",
                fontFamily: '"Clash Grotesk", sans-serif',
                fontWeight: 700,
                fontSize: "13px",
                textDecoration: "none",
                letterSpacing: "0.02em",
              }}
            >
              VER LA APP
            </a>
          </div>
        </div>
      </section>

      {/* ── Pricing Preview ── */}
      <section
        id="planes"
        style={{
          background: "#000",
          color: "#fff",
          padding: "80px 16px",
          borderRadius: "0 0 60px 60px",
          position: "relative",
          zIndex: 10,
        }}
      >
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            gap: "48px",
          }}
        >
          <h2
            style={{
              fontFamily: '"Clash Grotesk", sans-serif',
              fontWeight: 900,
              fontSize: "clamp(32px, 6vw, 48px)",
              letterSpacing: "-0.02em",
            }}
          >
            ELIGE TU PLAN
          </h2>

          <div className="pricing-grid">
            {[
              { label: "MENSUAL", price: "$18.900 COP/MES" },
              { label: "ANUAL", price: "$189.000 COP" },
            ].map((plan) => (
              <div
                key={plan.label}
                style={{
                  borderRadius: "24px",
                  padding: "48px 32px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                  background:
                    "linear-gradient(to top, rgba(255,255,255,0.4), rgba(255,255,255,0.1), transparent)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  backdropFilter: "blur(12px)",
                }}
              >
                <h3
                  style={{
                    fontFamily: '"Hepta Slab", serif',
                    fontWeight: 300,
                    fontSize: "clamp(22px, 3vw, 30px)",
                    lineHeight: 1.2,
                  }}
                >
                  <span
                    style={{
                      fontFamily: '"Clash Grotesk", sans-serif',
                      fontWeight: 700,
                      display: "block",
                    }}
                  >
                    PLAN
                  </span>
                  {plan.label}
                </h3>
                <p
                  style={{
                    fontFamily: '"Hepta Slab", serif',
                    fontSize: "clamp(20px, 3vw, 28px)",
                  }}
                >
                  {plan.price}
                </p>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px", alignItems: "center" }}>
            <p
              style={{
                fontFamily: '"Clash Grotesk", sans-serif',
                fontWeight: 700,
                fontSize: "clamp(18px, 3vw, 26px)",
              }}
            >
              QUE PODRÍAS LIBRAR EN TU PRIMERA SALIDA.
            </p>
            <p
              style={{ fontFamily: '"Hepta Slab", serif', fontSize: "18px" }}
            >
              Cancela cuando quieras.
            </p>
            {!isLoggedIn && (
              <Link
                to="/planes"
                style={{
                  display: "inline-block",
                  background: "#fff",
                  color: "#000",
                  borderRadius: "9999px",
                  padding: "14px 32px",
                  fontFamily: '"Clash Grotesk", sans-serif',
                  fontWeight: 700,
                  fontSize: "14px",
                  textDecoration: "none",
                  letterSpacing: "0.02em",
                }}
              >
                ÚNETE AHORA
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <HowItWorks />

      {/* ── Testimonials ── */}
      <Testimonials />

      {/* ── FAQ ── */}
      <FaqSection />

      {/* ── Footer ── */}
      <Footer />

      <style>{`
        .hero-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 32px;
          align-items: center;
        }
        .pricing-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
          max-width: 900px;
          margin: 0 auto;
        }
        @media (min-width: 768px) {
          .hero-grid {
            grid-template-columns: 1fr 1fr;
          }
          .hero-image { order: 1 !important; }
          .hero-text {
            order: 2 !important;
            text-align: left !important;
          }
          .hero-text > div {
            justify-content: flex-start !important;
          }
          .pricing-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
      `}</style>
    </main>
  );
}

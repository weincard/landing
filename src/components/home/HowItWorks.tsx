export function HowItWorks() {
  return (
    <section
      style={{
        background: "#f7f5f3",
        color: "#000",
        padding: "80px 16px 64px",
      }}
    >
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "32px",
            marginBottom: "32px",
          }}
          className="how-it-works-grid"
        >
          {/* Left: Steps */}
          <div style={{ flex: 1 }}>
            <h2
              style={{
                fontFamily: '"Clash Grotesk", sans-serif',
                fontWeight: 900,
                fontSize: "clamp(36px, 6vw, 48px)",
                letterSpacing: "-0.02em",
                textAlign: "center",
                marginBottom: "16px",
                lineHeight: 1,
              }}
            >
              ¿CÓMO
              <br />
              FUNCIONA?
            </h2>
            <hr style={{ borderColor: "rgba(0,0,0,0.15)", marginBottom: "24px" }} />

            {/* Mobile keyhole image */}
            <div className="how-key-mobile" style={{ display: "flex", justifyContent: "center", marginBottom: "24px" }}>
              <img
                src="/images/image-key-weincard-402x.png"
                alt="Llave Weincard"
                style={{ width: "192px", height: "256px", objectFit: "contain" }}
              />
            </div>

            <hr className="how-key-mobile" style={{ borderColor: "rgba(0,0,0,0.15)", marginBottom: "24px" }} />

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "24px",
                fontFamily: '"Hepta Slab", serif',
                fontSize: "clamp(16px, 2.5vw, 22px)",
              }}
            >
              <div>
                <span style={{ fontWeight: 700 }}>1.</span> Obtén tu membresía.
              </div>
              <div style={{ display: "flex", gap: "12px", paddingTop: "8px" }}>
                <a
                  href="https://play.google.com/store/apps/details?id=com.weincard.app.idp"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src="/images/play-store-image-weincard-402x.png"
                    alt="Descargar en Google Play"
                    style={{ height: "48px" }}
                  />
                </a>
                <a
                  href="https://apps.apple.com/co/app/weincard/id6754571134"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src="/images/app-store-image-weincard-402x.png"
                    alt="Descargar en App Store"
                    style={{ height: "48px" }}
                  />
                </a>
              </div>
              <div style={{ marginTop: "8px" }}>
                <span style={{ fontWeight: 700 }}>2.</span> Muestra tu tarjeta digital en los restaurantes vinculados.
              </div>
              <div>
                <span style={{ fontWeight: 700 }}>3.</span> Y disfruta de tus beneficios.
              </div>
            </div>
          </div>

          {/* Right: Keyhole image — desktop only */}
          <div
            className="how-key-desktop"
            style={{
              width: "256px",
              flexShrink: 0,
              display: "flex",
              alignItems: "stretch",
            }}
          >
            <img
              src="/images/image-key-weincard-402x.png"
              alt="Llave Weincard"
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          </div>
        </div>

        {/* GIF */}
        <div>
          <img
            src="/gif-weincard.gif"
            alt="Llave de membresía"
            style={{ width: "100%", height: "auto", display: "block" }}
          />
        </div>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .how-it-works-grid {
            flex-direction: row !important;
          }
          .how-key-mobile { display: none !important; }
          .how-key-desktop { display: flex !important; }
        }
        @media (max-width: 767px) {
          .how-key-desktop { display: none !important; }
          .how-key-mobile { display: flex !important; }
        }
      `}</style>
    </section>
  );
}

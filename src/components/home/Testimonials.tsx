export function Testimonials() {
  return (
    <section
      style={{
        background: "#300203",
        color: "#fff",
        padding: "48px 16px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Mobile layout */}
      <div
        className="testimonials-mobile"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          textAlign: "center",
          paddingTop: "16px",
        }}
      >
        <p style={floatTextStyle}>
          20% <span style={boldStyle}>EN OLIVIA</span>
        </p>
        <p style={floatTextStyle}>
          MENÚ ESPECIAL <span style={boldStyle}>EN MISTURIA</span>
        </p>
        <p style={floatTextStyle}>
          POSTRE GRATIS <span style={{ ...boldStyle, color: "#ef4444" }}>EN CHEF BURGER</span>
        </p>
        <div style={{ textAlign: "center", padding: "16px 0" }}>
          <h2
            style={{
              fontSize: "32px",
              fontWeight: 300,
              letterSpacing: "0.1em",
              color: "#fd293d",
              fontFamily: '"Hepta Slab", serif',
              lineHeight: 1.3,
              marginBottom: "12px",
            }}
          >
            COSITAS
            <br />
            QUE PASAN
            <br />
            CON
          </h2>
          <img
            src="/images/weincard-text.png"
            alt="weincard"
            style={{ width: "224px", height: "auto", display: "inline-block" }}
          />
        </div>
        <p style={floatTextStyle}>
          20% OFF <span style={{ ...boldStyle, color: "#ef4444" }}>EN CHUM BURGERS</span>
        </p>
        <p style={floatTextStyle}>
          20% OFF <span style={{ ...boldStyle, color: "#ef4444" }}>EN VIN&GRETTA</span>
        </p>
      </div>

      {/* Desktop layout */}
      <div
        className="testimonials-desktop"
        style={{ position: "relative", minHeight: "420px" }}
      >
        <p style={{ ...desktopFloat, top: "32px", left: "5%" }}>
          MENÚ ESPECIAL <span style={boldStyle}>EN MISTURIA</span>
        </p>
        <p style={{ ...desktopFloat, top: "16px", left: "50%", transform: "translateX(-50%)" }}>
          20% <span style={{ ...boldStyle, color: "#ef4444" }}>EN OLIVIA</span>
        </p>
        <p style={{ ...desktopFloat, top: "60px", right: "5%" }}>
          POSTRE GRATIS <span style={{ ...boldStyle, color: "#ef4444" }}>EN CHEF BURGER</span>
        </p>

        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <h2
            style={{
              fontSize: "clamp(36px, 6vw, 56px)",
              fontWeight: 300,
              letterSpacing: "0.12em",
              color: "#fd293d",
              fontFamily: '"Hepta Slab", serif',
              lineHeight: 1.2,
              marginBottom: "12px",
            }}
          >
            COSITAS
            <br />
            QUE PASAN
            <br />
            CON
          </h2>
          <img
            src="/images/weincard-text.png"
            alt="weincard"
            style={{ width: "256px", height: "auto" }}
          />
        </div>

        <p style={{ ...desktopFloat, bottom: "48px", left: "15%" }}>
          20% OFF <span style={{ ...boldStyle, color: "#ef4444" }}>EN CHUM BURGERS</span>
        </p>
        <p style={{ ...desktopFloat, bottom: "140px", right: "8%" }}>
          20% OFF <span style={{ ...boldStyle, color: "#ef4444" }}>EN VIN&GRETTA</span>
        </p>
      </div>

      <style>{`
        @media (max-width: 767px) {
          .testimonials-desktop { display: none !important; }
          .testimonials-mobile { display: flex !important; }
        }
        @media (min-width: 768px) {
          .testimonials-desktop { display: block !important; }
          .testimonials-mobile { display: none !important; }
        }
      `}</style>
    </section>
  );
}

const floatTextStyle: React.CSSProperties = {
  fontSize: "13px",
  fontWeight: 300,
  color: "#fd293d",
  fontFamily: '"Hepta Slab", serif',
};

const boldStyle: React.CSSProperties = {
  fontWeight: 700,
};

const desktopFloat: React.CSSProperties = {
  position: "absolute",
  fontSize: "clamp(13px, 1.5vw, 18px)",
  fontWeight: 300,
  color: "#fd293d",
  fontFamily: '"Hepta Slab", serif',
  whiteSpace: "nowrap",
};

const LOGOS = [
  { src: "/restaurante-la-causa.png", alt: "La Causa" },
  { src: "/restaurante-grill-station.png", alt: "The Grill Station" },
  { src: "/restaurante-romero.png", alt: "Romero" },
  { src: "/restaurante-billy-bao.png", alt: "Billy Bao" },
  { src: "/restaurante-retro-face.png", alt: "Retro Face" },
];

// Triplicate for seamless infinite scroll
const ROW = [...LOGOS, ...LOGOS, ...LOGOS];

export function LogoCarousel() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Row 1 — scrolls right */}
      <div className="carousel-wrapper">
        <div className="animate-scroll-right" style={{ gap: "48px" }}>
          {ROW.map((logo, i) => (
            <img
              key={i}
              src={logo.src}
              alt={logo.alt}
              style={{
                height: "64px",
                width: "auto",
                objectFit: "contain",
                flexShrink: 0,
              }}
            />
          ))}
        </div>
      </div>

      {/* Row 2 — scrolls left */}
      <div className="carousel-wrapper">
        <div className="animate-scroll-left" style={{ gap: "48px" }}>
          {ROW.map((logo, i) => (
            <img
              key={i}
              src={logo.src}
              alt={logo.alt}
              style={{
                height: "64px",
                width: "auto",
                objectFit: "contain",
                flexShrink: 0,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

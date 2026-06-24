import { useState, useEffect } from "react";
import type { PlazaEdition, PlazaMerchant, PlazaOffer } from "@/api/plaza";
import { BrandBookColors } from "@/lib/palette";

interface PlazaMerchantModalProps {
  merchant: PlazaMerchant;
  edition: PlazaEdition;
  onClose: () => void;
}

export function PlazaMerchantModal({
  merchant,
  edition,
  onClose,
}: PlazaMerchantModalProps) {
  const [imgIndex, setImgIndex] = useState(0);
  const [imgLoading, setImgLoading] = useState(true);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const images = merchant.images?.length
    ? merchant.images
    : merchant.coverImageUrl
    ? [merchant.coverImageUrl]
    : [];

  // A non-empty per-merchant override replaces the feria-wide benefit.
  const usesOwnOffers = merchant.offers.length > 0;
  const offers: PlazaOffer[] = usesOwnOffers ? merchant.offers : edition.offers;
  const offersTitle = usesOwnOffers
    ? "Beneficios de este aliado"
    : "Beneficio de la feria";

  const hasVenue = Boolean(edition.venueName || edition.venueAddress);
  const mapsHref =
    edition.venueLatitude != null && edition.venueLongitude != null
      ? `https://www.google.com/maps/search/?api=1&query=${edition.venueLatitude},${edition.venueLongitude}`
      : edition.venueAddress
      ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          edition.venueAddress,
        )}`
      : null;

  return (
    <>
      <div
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-label={merchant.name}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 50,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          background: "rgba(0,0,0,0.6)",
          backdropFilter: "blur(4px)",
        }}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            position: "relative",
            background: "#fff",
            width: "100%",
            maxHeight: "92dvh",
            overflowY: "auto",
            borderRadius: "24px 24px 0 0",
          }}
          className="plaza-modal-inner"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Cerrar"
            style={{
              position: "absolute",
              top: "16px",
              right: "16px",
              background: "rgba(0,0,0,0.5)",
              border: "none",
              borderRadius: "50%",
              width: "32px",
              height: "32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "#fff",
              zIndex: 10,
            }}
          >
            <svg
              width="14"
              height="14"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Image slider */}
          {images.length > 0 && (
            <div
              style={{
                position: "relative",
                aspectRatio: "16/9",
                background: "#f3f4f6",
              }}
            >
              <img
                key={images[imgIndex]}
                src={images[imgIndex]}
                alt={`${merchant.name} imagen ${imgIndex + 1}`}
                onLoadStart={() => setImgLoading(true)}
                onLoad={() => setImgLoading(false)}
                onError={() => setImgLoading(false)}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  opacity: imgLoading ? 0 : 1,
                  transition: "opacity 0.3s",
                  display: "block",
                }}
              />
              {imgLoading && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#f3f4f6",
                  }}
                >
                  <svg
                    className="spin"
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <circle cx="12" cy="12" r="10" stroke="#d1d5db" strokeWidth="4" />
                    <path fill="#9ca3af" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                </div>
              )}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => {
                      setImgIndex((i) => (i - 1 + images.length) % images.length);
                      setImgLoading(true);
                    }}
                    aria-label="Imagen anterior"
                    style={navBtnStyle("left")}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      width="14"
                      height="14"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.72 12.53a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 1 1 1.06 1.06L9.31 12l6.97 6.97a.75.75 0 1 1-1.06 1.06l-7.5-7.5Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => {
                      setImgIndex((i) => (i + 1) % images.length);
                      setImgLoading(true);
                    }}
                    aria-label="Imagen siguiente"
                    style={navBtnStyle("right")}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      width="14"
                      height="14"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </>
              )}
            </div>
          )}

          {/* Content */}
          <div style={{ padding: "24px" }}>
            <div style={{ marginBottom: "20px" }}>
              <h2
                style={{
                  fontFamily: '"Clash Grotesk", sans-serif',
                  fontWeight: 700,
                  fontSize: "22px",
                  color: "#000",
                  lineHeight: 1.2,
                  marginBottom: "8px",
                }}
              >
                {merchant.name}
              </h2>
              {merchant.description && (
                <p
                  style={{
                    fontSize: "15px",
                    color: "#4b5563",
                    fontFamily: '"Hepta Slab", serif',
                    lineHeight: 1.6,
                  }}
                >
                  {merchant.description}
                </p>
              )}
            </div>

            {/* Offers */}
            {offers.length > 0 && (
              <div style={{ marginBottom: hasVenue ? "24px" : 0 }}>
                <h3
                  style={{
                    fontFamily: '"Clash Grotesk", sans-serif',
                    fontWeight: 700,
                    fontSize: "13px",
                    color: "#6b7280",
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                    marginBottom: "12px",
                  }}
                >
                  {offersTitle}
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {offers.map((offer, i) => (
                    <div
                      key={`${offer.title}-${i}`}
                      style={{
                        display: "flex",
                        gap: "14px",
                        alignItems: "flex-start",
                        background: "#fdf2f6",
                        borderRadius: "12px",
                        padding: "14px 16px",
                      }}
                    >
                      {offer.value && (
                        <span
                          style={{
                            flexShrink: 0,
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            minWidth: "64px",
                            padding: "6px 10px",
                            background: BrandBookColors.pink,
                            color: "#fff",
                            borderRadius: "9999px",
                            fontFamily: '"Clash Grotesk", sans-serif',
                            fontWeight: 700,
                            fontSize: "13px",
                            textAlign: "center",
                          }}
                        >
                          {offer.value}
                        </span>
                      )}
                      <div>
                        <p
                          style={{
                            fontFamily: '"Clash Grotesk", sans-serif',
                            fontWeight: 700,
                            fontSize: "14px",
                            color: "#000",
                            marginBottom: offer.description || offer.conditions ? "4px" : 0,
                          }}
                        >
                          {offer.title}
                        </p>
                        {offer.description && (
                          <p
                            style={{
                              fontSize: "13px",
                              color: "#6b7280",
                              fontFamily: '"Hepta Slab", serif',
                              lineHeight: 1.5,
                            }}
                          >
                            {offer.description}
                          </p>
                        )}
                        {offer.conditions && (
                          <p
                            style={{
                              fontSize: "11px",
                              color: "#9ca3af",
                              fontFamily: '"Hepta Slab", serif',
                              marginTop: "4px",
                            }}
                          >
                            {offer.conditions}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Venue */}
            {hasVenue && (
              <div>
                <h3
                  style={{
                    fontFamily: '"Clash Grotesk", sans-serif',
                    fontWeight: 700,
                    fontSize: "13px",
                    color: "#6b7280",
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                    marginBottom: "12px",
                  }}
                >
                  Ubicación
                </h3>
                {edition.venueName && (
                  <p
                    style={{
                      fontFamily: '"Clash Grotesk", sans-serif',
                      fontWeight: 700,
                      fontSize: "14px",
                      color: "#000",
                      marginBottom: "2px",
                    }}
                  >
                    {edition.venueName}
                  </p>
                )}
                {edition.venueAddress && (
                  <p
                    style={{
                      fontSize: "13px",
                      color: "#6b7280",
                      fontFamily: '"Hepta Slab", serif',
                      lineHeight: 1.5,
                    }}
                  >
                    {edition.venueAddress}
                  </p>
                )}
                {mapsHref && (
                  <a
                    href={mapsHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "inline-block",
                      marginTop: "12px",
                      fontFamily: '"Clash Grotesk", sans-serif',
                      fontWeight: 700,
                      fontSize: "13px",
                      color: "#000",
                      textDecoration: "underline",
                    }}
                  >
                    Cómo llegar →
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .spin { animation: spin 1s linear infinite; }
        @media (min-width: 768px) {
          .plaza-modal-inner {
            max-width: 640px !important;
            border-radius: 24px !important;
          }
        }
      `}</style>
    </>
  );
}

function navBtnStyle(side: "left" | "right"): React.CSSProperties {
  return {
    position: "absolute",
    top: "50%",
    [side]: "12px",
    transform: "translateY(-50%)",
    background: "rgba(0,0,0,0.5)",
    color: "#fff",
    border: "none",
    borderRadius: "50%",
    width: "32px",
    height: "32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  };
}

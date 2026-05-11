import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ display: "block" }} className="md-hidden-nav">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Menú"
        aria-expanded={open}
        style={{
          background: "none",
          border: "none",
          color: "#fff",
          cursor: "pointer",
          padding: "4px",
          display: "flex",
          alignItems: "center",
        }}
      >
        {open ? <X size={24} /> : <Menu size={24} />}
      </button>

      {open && (
        <>
          <div
            onClick={() => setOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 40,
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "100%",
              right: 0,
              marginTop: "8px",
              background: "#111",
              borderRadius: "16px",
              padding: "12px",
              minWidth: "180px",
              zIndex: 50,
              display: "flex",
              flexDirection: "column",
              gap: "4px",
              boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
            }}
          >
            <Link
              to="/catalogo"
              onClick={() => setOpen(false)}
              style={{
                color: "#fff",
                textDecoration: "none",
                padding: "10px 16px",
                borderRadius: "10px",
                fontFamily: '"Hepta Slab", serif',
                fontSize: "14px",
                letterSpacing: "0.05em",
                display: "block",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "rgba(255,255,255,0.1)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              RESTAURANTES
            </Link>
            <Link
              to="/planes"
              onClick={() => setOpen(false)}
              style={{
                color: "#fff",
                textDecoration: "none",
                padding: "10px 16px",
                borderRadius: "10px",
                fontFamily: '"Hepta Slab", serif',
                fontSize: "14px",
                letterSpacing: "0.05em",
                display: "block",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "rgba(255,255,255,0.1)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              PLANES
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

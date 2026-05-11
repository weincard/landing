import { Link } from "react-router-dom";
import { PageMeta } from "@/components/layout/PageMeta";

export function PoliticaCookiesPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#f7f5f3" }}>
      <PageMeta title="Política de Cookies" description="Información sobre el uso de cookies en Weincard." path="/politica-de-cookies" />
      <header style={{ background: "#000", padding: "24px 0" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 16px" }}>
          <Link to="/">
            <img src="/logo-weincard.png" alt="Weincard" style={{ height: "32px", width: "auto" }} />
          </Link>
        </div>
      </header>

      <main style={{ maxWidth: "896px", margin: "0 auto", padding: "48px 16px" }}>
        <div
          style={{
            background: "#fff",
            borderRadius: "16px",
            boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
            padding: "clamp(24px, 5vw, 48px)",
          }}
        >
          <h1 style={h1Style}>Política de Cookies</h1>
          <p style={{ ...bodyStyle, marginBottom: "32px" }}>
            <strong>Última actualización:</strong> Diciembre 2025
          </p>

          <section style={sectionStyle}>
            <h2 style={h2Style}>1. ¿Qué son las cookies?</h2>
            <p style={bodyStyle}>
              Las cookies son pequeños archivos de texto que se almacenan en su dispositivo (ordenador, tableta o móvil)
              cuando visita un sitio web. Las cookies permiten que el sitio web reconozca su dispositivo y recuerde
              información sobre su visita, como su idioma preferido y otras configuraciones.
            </p>
          </section>

          <section style={sectionStyle}>
            <h2 style={h2Style}>2. ¿Cómo utilizamos las cookies?</h2>
            <p style={{ ...bodyStyle, marginBottom: "16px" }}>
              WEINCARD utiliza cookies para mejorar su experiencia en nuestra plataforma y proporcionar servicios
              personalizados. Las cookies nos ayudan a:
            </p>
            <ul style={listStyle}>
              {[
                "Mantener su sesión activa mientras navega por la plataforma",
                "Recordar sus preferencias y configuraciones",
                "Analizar cómo utiliza nuestros servicios para mejorarlos",
                "Personalizar el contenido y las ofertas según sus intereses",
                "Garantizar la seguridad de su cuenta",
              ].map((item) => (
                <li key={item} style={bodyStyle}>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section style={sectionStyle}>
            <h2 style={h2Style}>3. Tipos de cookies que utilizamos</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {[
                {
                  title: "3.1. Cookies estrictamente necesarias",
                  body: "Estas cookies son esenciales para que pueda navegar por el sitio web y utilizar sus funciones. Sin estas cookies, no podemos proporcionar los servicios solicitados, como el acceso a su cuenta.",
                },
                {
                  title: "3.2. Cookies de rendimiento",
                  body: "Estas cookies recopilan información sobre cómo utiliza nuestro sitio web, como las páginas que visita con más frecuencia. Esta información se utiliza para mejorar el funcionamiento del sitio web.",
                },
                {
                  title: "3.3. Cookies de funcionalidad",
                  body: "Estas cookies permiten que el sitio web recuerde las elecciones que hace y proporcionan funciones mejoradas y más personales.",
                },
                {
                  title: "3.4. Cookies de publicidad",
                  body: "Estas cookies se utilizan para mostrar anuncios que sean relevantes para usted y sus intereses.",
                },
              ].map(({ title, body }) => (
                <div key={title}>
                  <h3 style={h3Style}>{title}</h3>
                  <p style={bodyStyle}>{body}</p>
                </div>
              ))}
            </div>
          </section>

          <section style={sectionStyle}>
            <h2 style={h2Style}>4. Cookies de terceros</h2>
            <p style={{ ...bodyStyle, marginBottom: "16px" }}>
              Además de nuestras propias cookies, también utilizamos cookies de terceros:
            </p>
            <ul style={listStyle}>
              {[
                "Google Analytics: Para analizar el uso del sitio web y mejorar nuestros servicios",
                "Redes sociales: Para permitir compartir contenido",
                "Procesamiento de pagos: Para facilitar transacciones seguras",
              ].map((item) => (
                <li key={item} style={bodyStyle}>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section style={sectionStyle}>
            <h2 style={h2Style}>5. Gestión de cookies</h2>
            <p style={{ ...bodyStyle, marginBottom: "12px" }}>
              Puede controlar y gestionar las cookies a través de la configuración de su navegador. Tenga en cuenta que
              eliminar o bloquear cookies puede afectar su experiencia de usuario.
            </p>
            <p style={bodyStyle}>Navegadores compatibles: Google Chrome, Mozilla Firefox, Safari, Microsoft Edge.</p>
          </section>

          <section style={sectionStyle}>
            <h2 style={h2Style}>6. Cambios en esta política</h2>
            <p style={bodyStyle}>
              Podemos actualizar esta Política de Cookies periódicamente. Le recomendamos que revise esta página
              regularmente para estar informado sobre cómo utilizamos las cookies.
            </p>
          </section>

          <section style={sectionStyle}>
            <h2 style={h2Style}>7. Contacto</h2>
            <p style={{ ...bodyStyle, marginBottom: "12px" }}>
              Si tiene preguntas sobre nuestra Política de Cookies, puede contactarnos:
            </p>
            <div
              style={{
                background: "#f7f5f3",
                borderRadius: "12px",
                padding: "20px 24px",
                display: "flex",
                flexDirection: "column",
                gap: "6px",
              }}
            >
              <p style={bodyStyle}>
                <strong>Email:</strong> weincardco@gmail.com
              </p>
              <p style={bodyStyle}>
                <strong>Dirección:</strong> Medellín, Colombia
              </p>
            </div>
          </section>
        </div>
      </main>

      <footer style={{ background: "#000", color: "#fff", padding: "32px 0", marginTop: "48px" }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: "13px", fontFamily: '"Hepta Slab", serif' }}>
            © 2026 Weincard. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}

const h1Style: React.CSSProperties = {
  fontFamily: '"Clash Grotesk", sans-serif',
  fontWeight: 900,
  fontSize: "clamp(24px, 4vw, 36px)",
  color: "#000",
  marginBottom: "8px",
};

const h2Style: React.CSSProperties = {
  fontFamily: '"Clash Grotesk", sans-serif',
  fontWeight: 700,
  fontSize: "18px",
  color: "#000",
  marginBottom: "12px",
};

const h3Style: React.CSSProperties = {
  fontFamily: '"Clash Grotesk", sans-serif',
  fontWeight: 700,
  fontSize: "15px",
  color: "#111",
  marginBottom: "8px",
};

const bodyStyle: React.CSSProperties = {
  fontFamily: '"Hepta Slab", serif',
  color: "#374151",
  fontSize: "14px",
  lineHeight: 1.7,
};

const sectionStyle: React.CSSProperties = {
  marginBottom: "32px",
};

const listStyle: React.CSSProperties = {
  paddingLeft: "20px",
  display: "flex",
  flexDirection: "column",
  gap: "8px",
};

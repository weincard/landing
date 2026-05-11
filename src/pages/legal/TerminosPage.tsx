import { Link } from "react-router-dom";
import { PageMeta } from "@/components/layout/PageMeta";

export function TerminosPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#f7f5f3" }}>
      <PageMeta title="Términos y Condiciones" description="Lee los términos y condiciones del servicio Weincard." path="/terminos-y-condiciones" />
      <header style={{ background: "#000", padding: "24px 0" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 16px" }}>
          <Link to="/">
            <img src="/logo-weincard.png" alt="Weincard" style={{ height: "32px", width: "auto" }} />
          </Link>
        </div>
      </header>

      <main style={{ maxWidth: "896px", margin: "0 auto", padding: "48px 16px" }}>
        <h1
          style={{
            fontFamily: '"Clash Grotesk", sans-serif',
            fontWeight: 900,
            fontSize: "clamp(28px, 5vw, 44px)",
            color: "#000",
            marginBottom: "32px",
          }}
        >
          Términos y Condiciones
        </h1>

        <div
          style={{
            background: "#fff",
            borderRadius: "16px",
            boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
            padding: "clamp(24px, 5vw, 48px)",
            display: "flex",
            flexDirection: "column",
            gap: "40px",
          }}
        >
          {/* Sección Primera */}
          <section>
            <h2 style={h2Style}>SECCIÓN PRIMERA — ASPECTOS PRELIMINARES</h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <div>
                <h3 style={h3Style}>1. ADVERTENCIA SOBRE OBLIGATORIEDAD</h3>
                <p style={bodyStyle}>
                  Los presentes TÉRMINOS Y CONDICIONES, en adelante "TyC", constituyen, para todos los efectos legales,
                  un acuerdo de voluntades entre Usted, en adelante el "Usuario", por una parte y WEINCARD S.A.S., en
                  adelante "WEINCARD", propietario de la plataforma weincard.com, por la otra.
                </p>
                <p style={{ ...bodyStyle, marginTop: "12px", fontWeight: 600 }}>
                  WEINCARD.COM ES UNA PLATAFORMA WEB CUYO OBJETIVO CONSISTE EN PERMITIR A LOS USUARIOS MIEMBRO ACCEDER
                  A BENEFICIOS AL MOMENTO DE ADQUIRIR UN PRODUCTO O SERVICIO OFRECIDO POR LOS USUARIOS COMERCIO.
                </p>
                <p style={{ ...bodyStyle, marginTop: "12px" }}>
                  Los presentes TyC pueden ser actualizados de manera ocasional por parte de WEINCARD. El uso y/o
                  acceso a weincard.com con posterioridad a la modificación de cualquier elemento de los TyC es
                  interpretado como aceptación expresa del Usuario.
                </p>
                <p style={{ ...bodyStyle, marginTop: "12px" }}>
                  Los presentes TyC son regidos por las normas del ordenamiento civil y mercantil de la República de
                  Colombia.
                </p>
              </div>

              <div>
                <h3 style={h3Style}>2. ESTRUCTURA DE LOS TyC</h3>
                <p style={{ ...bodyStyle, marginBottom: "12px" }}>
                  Los presentes TyC se encuentran divididos en cinco Secciones que regulan aspectos específicos de la
                  relación entre WEINCARD y sus Usuarios:
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", paddingLeft: "16px" }}>
                  {[
                    ["2.1.", "Sección Primera: Aspectos Introductorios."],
                    ["2.2.", "Sección Segunda: Condiciones Generales de Uso."],
                    ["2.3.", "Sección Tercera: Condiciones Especiales para los Usuarios Comercio."],
                    ["2.4.", "Sección Cuarta: Condiciones Especiales para los Usuarios Miembros."],
                    ["2.5.", "Sección Quinta: Disposiciones Finales."],
                  ].map(([n, t]) => (
                    <p key={n as string} style={bodyStyle}>
                      <strong>{n}</strong> {t}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Sección Segunda */}
          <section>
            <h2 style={h2Style}>SECCIÓN SEGUNDA — CONDICIONES GENERALES</h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <div>
                <h3 style={h3Style}>3. DEFINICIONES</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", paddingLeft: "16px" }}>
                  {[
                    ["3.4. Cuenta", "Cuenta que permite a un Usuario acceder y utilizar los Servicios."],
                    ["3.5. Dato personal", "Cualquier información que permita identificar a una persona natural, según la ley 1581 de 2012."],
                    ["3.14. Plataforma weincard.com", "La arquitectura computacional alojada en el dominio weincard.com, diseñada y gestionada por WEINCARD."],
                    ["3.17. Servicios WEINCARD", "Servicios de afiliación que otorgan a los usuarios miembros acceso continuo a beneficios a cambio de una tarifa recurrente."],
                    ["3.19. Usuario", "Término genérico para quien accede a la plataforma weincard.com."],
                    ["3.20. Usuario Miembro", "El Usuario que adquiere la membresía ofrecida por WEINCARD."],
                    ["3.21. Usuario Comercio", "El Usuario que se vincula a la plataforma con el objetivo de ofrecer sus productos o servicios."],
                  ].map(([term, def]) => (
                    <p key={term as string} style={bodyStyle}>
                      <strong>{term}:</strong> {def}
                    </p>
                  ))}
                </div>
              </div>

              <div>
                <h3 style={h3Style}>4. ACEPTACIÓN</h3>
                <p style={bodyStyle}>
                  Para todos los efectos legales, se entiende que al acceder, navegar y utilizar cualquier componente
                  de weincard.com, el Usuario ha leído y acepta, sin limitación ni condición alguna, los presentes TyC.
                </p>
              </div>

              <div>
                <h3 style={h3Style}>5. DESCRIPCIÓN DE LA PLATAFORMA</h3>
                <p style={bodyStyle}>
                  Weincard.com es una plataforma diseñada por WEINCARD, destinada a conectar a los Usuarios Miembros con
                  los Usuarios Comercio, para que los primeros puedan acceder a diferentes beneficios al momento de
                  adquirir bienes y servicios.
                </p>
              </div>

              <div>
                <h3 style={h3Style}>6. ALCANCE DE LOS SERVICIOS</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {[
                    ["6.1.", "WEINCARD utiliza la plataforma weincard.com con el objetivo de vincular al Usuario Miembro, a cambio de una retribución, para que puedan acceder a los beneficios ofrecidos por los Usuarios Comercio."],
                    ["6.3.", "En ningún momento podrá considerarse que WEINCARD actúa de manera directa o indirecta como vendedor de cualquiera de los productos y/o servicios ofrecidos por los Usuarios Comercio."],
                    ["6.6.", "WEINCARD no avala, recomienda, ofrece o aprueba los Productos ofrecidos por los Usuarios Comercio. WEINCARD se limita a poner a disposición de los Usuarios Miembro la plataforma."],
                  ].map(([n, t]) => (
                    <p key={n as string} style={bodyStyle}>
                      <strong>{n}</strong> {t}
                    </p>
                  ))}
                </div>
              </div>

              <div>
                <h3 style={h3Style}>8. CREACIÓN DE CUENTA DE USUARIO</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", paddingLeft: "16px" }}>
                  {[
                    ["8.1.", "El Usuario se obliga a proporcionar a WEINCARD únicamente información propia, autentica, actualizada, completa y precisa."],
                    ["8.4.", "El Usuario se obliga a actualizar su información, de manera inmediata, ante la ocurrencia de algún cambio."],
                    ["8.5.", "WEINCARD se reserva el derecho de suspender o cancelar la Cuenta de Usuario cuando verifique que la información suministrada es falsa, inexacta, desactualizada o incompleta."],
                    ["8.9.", "Le es prohibido al Usuario la transferencia o autorización del uso de su Cuenta de Usuario a otra persona."],
                  ].map(([n, t]) => (
                    <p key={n as string} style={bodyStyle}>
                      <strong>{n}</strong> {t}
                    </p>
                  ))}
                </div>
              </div>

              <div>
                <h3 style={h3Style}>9. TRATAMIENTO DE DATOS PERSONALES</h3>
                <p style={bodyStyle}>
                  WEINCARD reconoce el derecho de sus Usuarios a autodeterminarse informativamente. La política de
                  tratamiento de datos personales está disponible en{" "}
                  <Link
                    to="/politica-de-privacidad"
                    style={{ color: "#8B2332", textDecoration: "underline" }}
                  >
                    nuestra Política de Privacidad
                  </Link>
                  .
                </p>
              </div>

              <div>
                <h3 style={h3Style}>11. PROPIEDAD INTELECTUAL</h3>
                <p style={bodyStyle}>
                  El Usuario reconoce que weincard.com, sus canales, los datos, la información, toda la tecnología
                  subyacente y todo el software, materiales, textos, gráficos, animaciones, audio, video, fotos y otros
                  datos disponibles en la plataforma están protegidos por derechos de propiedad intelectual de titularidad
                  de WEINCARD o del respectivo titular autorizado.
                </p>
              </div>

              <div>
                <h3 style={h3Style}>13. CONDUCTAS PROHIBIDAS</h3>
                <ul style={{ ...listStyle }}>
                  {[
                    "Utilizar la plataforma para cometer delitos o violar leyes",
                    "Cargar contenido ilegal, amenazante, difamatorio, obsceno u ofensivo",
                    "Infringir derechos de propiedad intelectual de terceros",
                    "Hacerse pasar por terceros o representar falsamente su vinculación con terceros",
                    "Enviar spam o publicidad no solicitada",
                    "Intentar violar la seguridad de la Plataforma",
                    "Utilizar la plataforma para actividades fraudulentas",
                  ].map((item) => (
                    <li key={item} style={bodyStyle}>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Sección Tercera */}
          <section>
            <h2 style={h2Style}>SECCIÓN TERCERA — CONDICIONES PARA USUARIO COMERCIO</h2>
            <h3 style={h3Style}>19. OBLIGACIONES DEL USUARIO COMERCIO</h3>
            <p style={{ ...bodyStyle, marginBottom: "12px" }}>El Usuario Comercio se obliga a:</p>
            <ul style={listStyle}>
              {[
                "Definir de forma clara el alcance de los beneficios otorgados",
                "Otorgar en su integralidad los beneficios ofrecidos a los Usuarios Miembro",
                "Informar oportunamente a WEINCARD de circunstancias que impidan la prestación de servicios",
                "Garantizar calidad e idoneidad de los productos ofrecidos",
                "Suministrar información clara, veraz y completa sobre los productos y servicios",
                "Cumplir con todas las obligaciones legales, tributarias y laborales aplicables",
              ].map((item) => (
                <li key={item} style={bodyStyle}>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* Sección Cuarta */}
          <section>
            <h2 style={h2Style}>SECCIÓN CUARTA — CONDICIONES PARA USUARIOS MIEMBROS</h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <div>
                <h3 style={h3Style}>20. MEMBRESÍA</h3>
                <p style={bodyStyle}>
                  Los Usuarios Miembros son aquellos que adquieren la Membresía WEINCARD, a cambio del pago de la tarifa
                  definida en el plan escogido. Esta membresía les permite acceder a beneficios exclusivos en diferentes
                  comercios aliados. La membresía es personal e intransferible.
                </p>
              </div>

              <div>
                <h3 style={h3Style}>21. OBLIGACIONES DEL USUARIO MIEMBRO</h3>
                <ul style={listStyle}>
                  {[
                    "Pagar oportunamente el valor de la membresía según el plan seleccionado",
                    "Hacer uso personal e intransferible de la membresía adquirida",
                    "Cumplir con los presentes TyC y las políticas de WEINCARD",
                    "Proporcionar información completa, cierta y actualizada",
                    "No compartir sus credenciales de acceso con terceros",
                    "Respetar los términos y condiciones de cada Usuario Comercio",
                  ].map((item) => (
                    <li key={item} style={bodyStyle}>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 style={h3Style}>22. FORMAS DE PAGO</h3>
                <p style={bodyStyle}>
                  WEINCARD pondrá a disposición de los Usuarios Miembro diferentes medios de pago para la adquisición de
                  la membresía, incluyendo tarjetas de crédito, débito, PSE y otros medios de pago electrónico
                  autorizados en Colombia.
                </p>
              </div>

              <div>
                <h3 style={h3Style}>23. RENOVACIÓN Y CANCELACIÓN</h3>
                <p style={bodyStyle}>
                  La membresía se renovará automáticamente al finalizar cada periodo de suscripción, salvo que el
                  Usuario Miembro manifieste expresamente su voluntad de no renovar. El Usuario Miembro puede cancelar
                  su membresía en cualquier momento a través de la plataforma o contactando a soporte.
                </p>
              </div>
            </div>
          </section>

          {/* Sección Quinta */}
          <section>
            <h2 style={h2Style}>SECCIÓN QUINTA — DISPOSICIONES FINALES</h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <div>
                <h3 style={h3Style}>25. LIMITACIONES DE RESPONSABILIDAD</h3>
                <p style={{ ...bodyStyle, marginBottom: "12px" }}>WEINCARD no será responsable por:</p>
                <ul style={listStyle}>
                  {[
                    "Interrupciones del servicio por mantenimiento programado o causas de fuerza mayor",
                    "Pérdida de datos causada por fallas técnicas",
                    "Daños derivados del uso indebido de la plataforma",
                    "Incumplimientos de los Usuarios Comercio con los Usuarios Miembro",
                    "Calidad, idoneidad o legalidad de los productos ofrecidos por Usuarios Comercio",
                  ].map((item) => (
                    <li key={item} style={bodyStyle}>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 style={h3Style}>27. PROTECCIÓN DE DATOS PERSONALES</h3>
                <p style={bodyStyle}>
                  WEINCARD se compromete a proteger los datos personales de sus usuarios de conformidad con la Ley 1581
                  de 2012 y demás normas aplicables. Para más información, consulte nuestra{" "}
                  <Link to="/politica-de-privacidad" style={{ color: "#8B2332", textDecoration: "underline" }}>
                    Política de Privacidad
                  </Link>
                  .
                </p>
              </div>

              <div>
                <h3 style={h3Style}>29. LEY APLICABLE Y JURISDICCIÓN</h3>
                <p style={bodyStyle}>
                  Los presentes TyC se regirán e interpretarán de conformidad con las leyes de la República de Colombia.
                  Cualquier controversia será sometida a la jurisdicción exclusiva de los jueces y tribunales de
                  Medellín, Colombia.
                </p>
              </div>

              <div>
                <h3 style={h3Style}>30. MODIFICACIONES</h3>
                <p style={bodyStyle}>
                  WEINCARD se reserva el derecho de modificar estos TyC en cualquier momento. Las modificaciones
                  entrarán en vigor inmediatamente después de su publicación en el sitio web.
                </p>
              </div>
            </div>
          </section>

          {/* Contacto */}
          <div
            style={{
              background: "#f7f5f3",
              borderRadius: "12px",
              padding: "24px",
            }}
          >
            <h3
              style={{
                fontFamily: '"Clash Grotesk", sans-serif',
                fontWeight: 700,
                fontSize: "16px",
                color: "#000",
                marginBottom: "12px",
              }}
            >
              Información de Contacto
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {[
                ["Razón Social", "WEINCARD S.A.S."],
                ["NIT", "901969791-5"],
                ["Domicilio", "Medellín, Colombia"],
                ["Correo electrónico", "weincardco@gmail.com"],
                ["Página web", "https://www.weincard.com"],
              ].map(([k, v]) => (
                <p key={k} style={bodyStyle}>
                  <strong>{k}:</strong> {v}
                </p>
              ))}
            </div>
          </div>

          <div
            style={{
              textAlign: "center",
              fontSize: "13px",
              color: "#9ca3af",
              fontFamily: '"Hepta Slab", serif',
              paddingTop: "24px",
              borderTop: "1px solid #e5e7eb",
            }}
          >
            Última actualización: Septiembre 19, 2025
          </div>
        </div>
      </main>

      <footer style={{ background: "#000", color: "#fff", padding: "32px 0", marginTop: "64px" }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: "13px", fontFamily: '"Hepta Slab", serif' }}>
            © 2026 WEINCARD S.A.S. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}

const h2Style: React.CSSProperties = {
  fontFamily: '"Clash Grotesk", sans-serif',
  fontWeight: 700,
  fontSize: "17px",
  color: "#000",
  marginBottom: "20px",
  letterSpacing: "0.02em",
};

const h3Style: React.CSSProperties = {
  fontFamily: '"Clash Grotesk", sans-serif',
  fontWeight: 700,
  fontSize: "15px",
  color: "#111",
  marginBottom: "10px",
};

const bodyStyle: React.CSSProperties = {
  fontFamily: '"Hepta Slab", serif',
  color: "#374151",
  fontSize: "14px",
  lineHeight: 1.7,
};

const listStyle: React.CSSProperties = {
  paddingLeft: "20px",
  display: "flex",
  flexDirection: "column",
  gap: "8px",
};

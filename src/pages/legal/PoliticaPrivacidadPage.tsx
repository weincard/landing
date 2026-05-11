import { Link } from "react-router-dom";
import { PageMeta } from "@/components/layout/PageMeta";

export function PoliticaPrivacidadPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#f7f5f3" }}>
      <PageMeta title="Política de Privacidad" description="Conoce cómo Weincard recopila, usa y protege tu información personal." path="/politica-de-privacidad" />
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
          Política de Tratamiento de la Información Personal
        </h1>

        <div
          style={{
            background: "#fff",
            borderRadius: "16px",
            boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
            padding: "clamp(24px, 5vw, 48px)",
            display: "flex",
            flexDirection: "column",
            gap: "32px",
          }}
        >
          <section>
            <p style={bodyStyle}>
              En cumplimiento de las disposiciones contenidas en el artículo 15 de la Constitución Política, Ley 1581 de
              2012, Decreto reglamentario 1377 de 2013, y demás normas que lo modifiquen, adicionen, complementen o
              desarrollen, la compañía WEINCARD S.A.S., en adelante WEINCARD, comprometida con el respeto y garantía de
              los derechos de sus afiliados, proveedores, empleados y terceros en general, da a conocer las políticas y
              procedimientos de tratamiento de datos personales que se encuentran guardados y custodiados en nuestra
              base de datos, las cuales son de obligatorio cumplimiento en todas las actividades que involucre, total o
              parcialmente, la recolección, almacenamiento, uso, circulación y/o transferencia de dicha información.
            </p>
            <p style={{ ...bodyStyle, marginTop: "16px" }}>
              La presente Política de Tratamiento de Información Personal es de obligatorio cumplimiento para WEINCARD,
              en calidad de responsable, así como para todas las compañías aliadas, filiales o que hacen parte del grupo
              empresarial de esta.
            </p>
          </section>

          <section>
            <h2 style={h2Style}>1. MARCO JURÍDICO</h2>
            <p style={{ ...bodyStyle, marginBottom: "16px" }}>
              La presente Política de Tratamiento de la información personal tiene su sustento normativo en el artículo
              15 de la Constitución Política, en la Ley 1581 de 2012, Decreto reglamentario 1377 de 2013.
            </p>
            <div style={boxStyle}>
              <h3 style={h3Style}>Constitución Política</h3>
              <p style={smallBodyStyle}>
                <strong>Artículo 15.</strong> Todas las personas tienen derecho a su intimidad personal y familiar y a
                su buen nombre, y el Estado debe respetarlos y hacerlos respetar. De igual modo, tienen derecho a
                conocer, actualizar y rectificar las informaciones que se hayan recogido sobre ellas en bancos de datos
                y en archivos de entidades públicas y privadas.
              </p>
              <p style={{ ...smallBodyStyle, marginTop: "12px" }}>
                En la recolección, tratamiento y circulación de datos se respetarán la libertad y demás garantías
                consagradas en la Constitución.
              </p>
            </div>
            <div style={{ ...boxStyle, marginTop: "16px" }}>
              <h3 style={h3Style}>Ley Estatutaria 1581 de 2012</h3>
              <p style={smallBodyStyle}>
                "Por la cual se dictan disposiciones generales para la protección de datos personales"
              </p>
            </div>
          </section>

          <section>
            <h2 style={h2Style}>2. INFORMACIÓN GENERAL DE WEINCARD</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {[
                ["Razón social", "WEINCARD S.A.S."],
                ["NIT", "901969791-5"],
                ["Domicilio", "Medellín"],
                ["Correo electrónico", "weincardco@gmail.com"],
                ["Página web", "https://www.weincard.com"],
              ].map(([k, v]) => (
                <p key={k} style={bodyStyle}>
                  <strong>{k}:</strong> {v}
                </p>
              ))}
            </div>
          </section>

          <section>
            <h2 style={h2Style}>3. OBJETO DE LA POLÍTICA</h2>
            <p style={bodyStyle}>
              La Política de Tratamiento de datos personales tiene por objeto desarrollar y dar a conocer al público en
              general los lineamientos corporativos y de Ley bajo los cuales WEINCARD realiza el tratamiento de los
              datos personales, la finalidad del tratamiento, los derechos que le asisten a los titulares, así como los
              procedimientos internos y externos que existen para el ejercicio de tales derechos ante WEINCARD.
            </p>
          </section>

          <section>
            <h2 style={h2Style}>4. DEFINICIONES LEGALES</h2>
            <p style={{ ...bodyStyle, marginBottom: "16px" }}>
              Para efectos de la ejecución de la presente política serán aplicables las siguientes definiciones:
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {[
                ["a) Autorización", "Consentimiento previo, expreso e informado del Titular para llevar a cabo el Tratamiento de datos personales."],
                ["b) Base de Datos", "Conjunto organizado de datos personales que sea objeto de Tratamiento."],
                ["c) Titular", "Persona natural cuyos datos personales sean objeto de Tratamiento."],
                ["d) Tratamiento", "Cualquier operación o conjunto de operaciones sobre datos personales, tales como la recolección, almacenamiento, uso, circulación o supresión."],
                ["e) Dato personal", "Cualquier información vinculada o que pueda asociarse a una o varias personas naturales determinadas o determinables."],
                ["f) Datos sensibles", "Aquellos que afectan la intimidad del Titular o cuyo uso indebido puede generar su discriminación."],
              ].map(([term, def]) => (
                <p key={term as string} style={bodyStyle}>
                  <strong>{term}:</strong> {def}
                </p>
              ))}
            </div>
          </section>

          <section>
            <h2 style={h2Style}>5. PRINCIPIOS QUE GOBIERNAN EL TRATAMIENTO</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {[
                ["Principio de legalidad", "el Tratamiento de los datos personales es una actividad reglada que debe sujetarse a lo establecido en la Ley 1581 de 2012."],
                ["Principio de finalidad", "la finalidad del Tratamiento debe ser legítima e informada al titular."],
                ["Principio de libertad", "los datos personales sólo pueden ser tratados con el consentimiento previo, expreso e informado del Titular."],
                ["Principio de veracidad", "la información debe ser veraz, completa, exacta, actualizada, comprobable y comprensible."],
                ["Principio de transparencia", "se debe garantizar el derecho del Titular a obtener información sobre sus datos personales."],
                ["Principio de Seguridad", "la información debe manejarse con las medidas necesarias para otorgar seguridad a los registros."],
                ["Principio de Confidencialidad", "los datos personales que no tengan la naturaleza de públicos son reservados."],
              ].map(([p, d]) => (
                <p key={p as string} style={bodyStyle}>
                  <strong>− {p}:</strong> {d}
                </p>
              ))}
            </div>
          </section>

          <section>
            <h2 style={h2Style}>6. DERECHOS DE LOS TITULARES</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {[
                ["a)", "Conocer, actualizar y rectificar sus datos personales."],
                ["b)", "Solicitar prueba de la autorización otorgada al Responsable del Tratamiento."],
                ["c)", "Ser informado sobre el uso que le ha dado a sus datos personales."],
                ["d)", "Presentar ante la Superintendencia de Industria y Comercio quejas por infracciones."],
                ["e)", "Revocar la autorización y/o solicitar la supresión del dato."],
                ["f)", "Acceder en forma gratuita a sus datos personales que hayan sido objeto de Tratamiento."],
              ].map(([letter, text]) => (
                <p key={letter as string} style={bodyStyle}>
                  <strong>{letter}</strong> {text}
                </p>
              ))}
            </div>
          </section>

          <section>
            <h2 style={h2Style}>7. AUTORIZACIÓN PARA EL TRATAMIENTO</h2>
            <p style={bodyStyle}>
              WEINCARD actuando como Responsable del Tratamiento ha adoptado procedimientos para solicitarle, a más
              tardar en el momento de la recolección de sus datos personales, su autorización para el Tratamiento de los
              mismos e informarle cuáles son los datos personales que serán recolectados, así como todas las finalidades
              específicas del Tratamiento para las cuales se obtiene su consentimiento.
            </p>
          </section>

          <section>
            <h2 style={h2Style}>9. FINALIDAD DEL TRATAMIENTO</h2>
            <p style={{ ...bodyStyle, marginBottom: "12px" }}>
              WEINCARD realizará el tratamiento de los datos personales con las siguientes finalidades:
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {[
                "Realizar actividades de mercadeo, promoción y/o publicidad propia o de terceros.",
                "Generar una comunicación óptima en relación con nuestros servicios y productos.",
                "Evaluar la calidad de nuestros productos y servicios.",
                "Prestar asistencia, servicio y soporte técnico de nuestros productos y servicios.",
                "Realizar las gestiones necesarias para dar cumplimiento a las obligaciones inherentes a los servicios.",
                "Controlar y prevenir el fraude en todas sus modalidades.",
                "Consultar y reportar información en centrales de riesgo.",
              ].map((item, i) => (
                <p key={i} style={bodyStyle}>
                  <strong>{["i", "ii", "iii", "iv", "v", "vi", "vii", "viii"][i]}.</strong> {item}
                </p>
              ))}
            </div>
          </section>

          <section>
            <h2 style={h2Style}>10. PROCEDIMIENTO PARA CONSULTAS</h2>
            <p style={{ ...bodyStyle, marginBottom: "12px" }}>
              El Titular de los datos personales o quien esté autorizado debidamente podrá formular solicitudes y
              consultas para conocer su información personal que reposa en WEINCARD.
            </p>
            <div style={boxStyle}>
              <p style={bodyStyle}>
                <strong>− Correo electrónico:</strong> weincardco@gmail.com
              </p>
              <p style={{ ...smallBodyStyle, marginTop: "12px" }}>
                La consulta será atendida en un término máximo de diez (10) días hábiles contados a partir de la fecha
                de recibo de la misma.
              </p>
            </div>
          </section>

          <section>
            <h2 style={h2Style}>12. VIGENCIA</h2>
            <p style={bodyStyle}>
              La presente política rige a partir del 19 de septiembre de 2025, y hasta el momento en que expresamente
              se revoque o modifique.
            </p>
          </section>

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
  fontSize: "18px",
  color: "#000",
  marginBottom: "16px",
};

const h3Style: React.CSSProperties = {
  fontFamily: '"Clash Grotesk", sans-serif',
  fontWeight: 700,
  fontSize: "15px",
  color: "#000",
  marginBottom: "10px",
};

const bodyStyle: React.CSSProperties = {
  fontFamily: '"Hepta Slab", serif',
  color: "#374151",
  fontSize: "14px",
  lineHeight: 1.7,
};

const smallBodyStyle: React.CSSProperties = {
  fontFamily: '"Hepta Slab", serif',
  color: "#6b7280",
  fontSize: "13px",
  lineHeight: 1.7,
};

const boxStyle: React.CSSProperties = {
  background: "#f7f5f3",
  borderRadius: "12px",
  padding: "20px 24px",
};

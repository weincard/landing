import { Accordion } from "@mantine/core";

const FAQ = [
  {
    q: "1. ¿QUÉ ES WEINCARD?",
    a: "Weincard es una membresía digital con beneficios, regalos y descuentos exclusivos en los mejores restaurantes de Medellín, perfecta para los que buscan multiplicar sus salidas.",
  },
  {
    q: "2. ¿CUÁNTO CUESTA?",
    a: "La suscripción mensual cuesta $18.900 COP y el plan anual podrás adquirirlo por $189.000 COP. *Que podrías librar desde tu primera salida.",
  },
  {
    q: "3. ¿DÓNDE PUEDO USAR WEINCARD?",
    a: "Tu membresía es válida en Medellín y el Área Metropolitana.",
  },
  {
    q: "4. ¿CÓMO CANCELO MI MEMBRESÍA?",
    a: "Sin complicaciones ni letra pequeña. Puedes cancelar tu suscripción en cualquier momento directamente desde tu perfil en la aplicación, en la sección: administrar suscripción.",
  },
  {
    q: "5. ¿QUÉ INCLUYE WEINCARD?",
    a: "Tu membresía incluye los mejores beneficios en los mejores restaurantes de Medellín: 30% OFF en Sushi Market, 20% OFF en Olivia, Menú Weincard en Mistura y muchísimos más restaurantes. Descarga la app y mira todos los beneficios en todos los restaurantes.",
  },
  {
    q: "6. ¿QUÉ RESTAURANTES ESTÁN EN WEINCARD?",
    a: "Solo los mejores. Descarga la app y mira todos los beneficios en todos los restaurantes.",
  },
];

export function FaqSection() {
  return (
    <section style={{ background: "#f7f5f3", color: "#000", padding: "48px 16px" }}>
      <div style={{ maxWidth: "768px", margin: "0 auto" }}>
        <h2
          style={{
            fontFamily: '"Clash Grotesk", sans-serif',
            fontWeight: 900,
            fontSize: "clamp(28px, 5vw, 40px)",
            letterSpacing: "-0.02em",
            textAlign: "center",
            marginBottom: "48px",
            color: "#000",
          }}
        >
          PREGUNTAS FRECUENTES
        </h2>

        <Accordion
          variant="default"
          styles={{
            item: { borderBottom: "1px solid rgba(0,0,0,0.2)" },
            control: {
              padding: "20px 0",
              fontFamily: '"Clash Grotesk", sans-serif',
              fontWeight: 500,
              fontSize: "clamp(14px, 2.5vw, 17px)",
              color: "#000",
              backgroundColor: "transparent",
              "&:hover": { backgroundColor: "transparent" },
            },
            chevron: { color: "#000" },
            content: {
              padding: "0 0 20px 0",
              fontFamily: '"Hepta Slab", serif',
              color: "#374151",
              fontSize: "14px",
              lineHeight: 1.7,
            },
          }}
        >
          {FAQ.map((item) => (
            <Accordion.Item key={item.q} value={item.q}>
              <Accordion.Control>{item.q}</Accordion.Control>
              <Accordion.Panel>{item.a}</Accordion.Panel>
            </Accordion.Item>
          ))}
        </Accordion>

        <div style={{ display: "flex", justifyContent: "center", paddingTop: "24px" }}>
          <img
            src="/logo-weincard.png"
            alt="Weincard"
            style={{ height: "16px", filter: "brightness(0)" }}
          />
        </div>
      </div>
    </section>
  );
}

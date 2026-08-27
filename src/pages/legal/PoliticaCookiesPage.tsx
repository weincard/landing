
import { LegalPageShell } from "@/components/layout/LegalPageShell";

// Full legal text — restored verbatim from the original document (2026-08-27). Wording changes require legal sign-off.
export function PoliticaCookiesPage() {
  return (
    <LegalPageShell
      title="Política de Cookies"
      description="Información sobre el uso de cookies en Weincard."
      path="/politica-de-cookies"
      updated="Diciembre 2025"
    >
          {/* 1. ¿Qué son las cookies? */}
          <section>
            <h2 className="mb4">1. ¿Qué son las cookies?</h2>
            <p className="mb4">
              Las cookies son pequeños archivos de texto que se almacenan en su dispositivo (ordenador, tableta o móvil)
              cuando visita un sitio web. Las cookies permiten que el sitio web reconozca su dispositivo y recuerde
              información sobre su visita, como su idioma preferido y otras configuraciones.
            </p>
          </section>

          {/* 2. ¿Cómo utilizamos las cookies? */}
          <section>
            <h2 className="mb4">2. ¿Cómo utilizamos las cookies?</h2>
            <p className="mb4">
              WEINCARD utiliza cookies para mejorar su experiencia en nuestra plataforma y proporcionar servicios
              personalizados. Las cookies nos ayudan a:
            </p>
            <ul className="ul ml4 stack2 mb4">
              <li>Mantener su sesión activa mientras navega por la plataforma</li>
              <li>Recordar sus preferencias y configuraciones</li>
              <li>Analizar cómo utiliza nuestros servicios para mejorarlos</li>
              <li>Personalizar el contenido y las ofertas según sus intereses</li>
              <li>Garantizar la seguridad de su cuenta</li>
            </ul>
          </section>

          {/* 3. Tipos de cookies que utilizamos */}
          <section>
            <h2 className="mb4">3. Tipos de cookies que utilizamos</h2>

            <div className="stack4">
              <div>
                <h3 className="mb2">
                  3.1. Cookies estrictamente necesarias
                </h3>
                <p>
                  Estas cookies son esenciales para que pueda navegar por el sitio web y utilizar sus funciones. Sin
                  estas cookies, no podemos proporcionar los servicios solicitados, como el acceso a su cuenta.
                </p>
              </div>

              <div>
                <h3 className="mb2">3.2. Cookies de rendimiento</h3>
                <p>
                  Estas cookies recopilan información sobre cómo utiliza nuestro sitio web, como las páginas que visita
                  con más frecuencia. Esta información se utiliza para mejorar el funcionamiento del sitio web.
                </p>
              </div>

              <div>
                <h3 className="mb2">3.3. Cookies de funcionalidad</h3>
                <p>
                  Estas cookies permiten que el sitio web recuerde las elecciones que hace (como su nombre de usuario o
                  idioma) y proporcionan funciones mejoradas y más personales.
                </p>
              </div>

              <div>
                <h3 className="mb2">3.4. Cookies de publicidad</h3>
                <p>
                  Estas cookies se utilizan para mostrar anuncios que sean relevantes para usted y sus intereses.
                  También pueden utilizarse para limitar el número de veces que ve un anuncio.
                </p>
              </div>
            </div>
          </section>

          {/* 4. Cookies de terceros */}
          <section>
            <h2 className="mb4">4. Cookies de terceros</h2>
            <p className="mb4">
              Además de nuestras propias cookies, también utilizamos cookies de terceros para los siguientes propósitos:
            </p>
            <ul className="ul ml4 stack2 mb4">
              <li>
                <strong>Google Analytics:</strong> Para analizar el uso del sitio web y mejorar nuestros servicios
              </li>
              <li>
                <strong>Redes sociales:</strong> Para permitir compartir contenido en redes sociales
              </li>
              <li>
                <strong>Procesamiento de pagos:</strong> Para facilitar transacciones seguras
              </li>
            </ul>
          </section>

          {/* 5. Gestión de cookies */}
          <section>
            <h2 className="mb4">5. Gestión de cookies</h2>
            <p className="mb4">
              Puede controlar y gestionar las cookies de varias maneras. Tenga en cuenta que eliminar o bloquear cookies
              puede afectar su experiencia de usuario y algunas áreas de nuestro sitio web pueden dejar de funcionar
              correctamente.
            </p>
            <p className="mb4">
              La mayoría de los navegadores web le permiten controlar las cookies a través de sus configuraciones. Para
              obtener más información sobre cómo gestionar las cookies en su navegador, consulte:
            </p>
            <ul className="ul ml4 stack2 mb4">
              <li>Google Chrome</li>
              <li>Mozilla Firefox</li>
              <li>Safari</li>
              <li>Microsoft Edge</li>
            </ul>
          </section>

          {/* 6. Cambios en esta política */}
          <section>
            <h2 className="mb4">6. Cambios en esta política</h2>
            <p className="mb4">
              Podemos actualizar esta Política de Cookies periódicamente para reflejar cambios en nuestras prácticas o
              por otras razones operativas, legales o reglamentarias. Le recomendamos que revise esta página
              regularmente para estar informado sobre cómo utilizamos las cookies.
            </p>
          </section>

          {/* 7. Contacto */}
          <section>
            <h2 className="mb4">7. Contacto</h2>
            <p className="mb4">
              Si tiene preguntas sobre nuestra Política de Cookies, puede contactarnos en:
            </p>
            <div className="box">
              <p>
                <strong>Email:</strong> weincardco@gmail.com
              </p>
              <p>
                <strong>Dirección:</strong> Bogotá, Colombia
              </p>
            </div>
          </section>
        
    </LegalPageShell>
  );
}

import Image from "next/image"
import Link from "next/link"

export default function PoliticaDeCookiesPage() {
  return (
    <div className="min-h-screen bg-[#F5F1E8]">
      <header className="bg-black py-6">
        <div className="container mx-auto px-4">
          <Link href="/">
            <Image src="/logo-weincard.png" alt="Weincard Logo" width={150} height={40} className="h-8 w-auto" />
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
          <h1 className="font-clash font-bold text-3xl md:text-4xl mb-6 text-gray-900">Política de Cookies</h1>

          <p className="text-gray-600 mb-8">
            <strong>Última actualización:</strong> Diciembre 2025
          </p>

          {/* 1. ¿Qué son las cookies? */}
          <section className="mb-8">
            <h2 className="font-clash font-bold text-2xl mb-4 text-gray-900">1. ¿Qué son las cookies?</h2>
            <p className="text-gray-700 mb-4 leading-relaxed">
              Las cookies son pequeños archivos de texto que se almacenan en su dispositivo (ordenador, tableta o móvil)
              cuando visita un sitio web. Las cookies permiten que el sitio web reconozca su dispositivo y recuerde
              información sobre su visita, como su idioma preferido y otras configuraciones.
            </p>
          </section>

          {/* 2. ¿Cómo utilizamos las cookies? */}
          <section className="mb-8">
            <h2 className="font-clash font-bold text-2xl mb-4 text-gray-900">2. ¿Cómo utilizamos las cookies?</h2>
            <p className="text-gray-700 mb-4 leading-relaxed">
              WEINCARD utiliza cookies para mejorar su experiencia en nuestra plataforma y proporcionar servicios
              personalizados. Las cookies nos ayudan a:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
              <li>Mantener su sesión activa mientras navega por la plataforma</li>
              <li>Recordar sus preferencias y configuraciones</li>
              <li>Analizar cómo utiliza nuestros servicios para mejorarlos</li>
              <li>Personalizar el contenido y las ofertas según sus intereses</li>
              <li>Garantizar la seguridad de su cuenta</li>
            </ul>
          </section>

          {/* 3. Tipos de cookies que utilizamos */}
          <section className="mb-8">
            <h2 className="font-clash font-bold text-2xl mb-4 text-gray-900">3. Tipos de cookies que utilizamos</h2>

            <div className="space-y-4">
              <div>
                <h3 className="font-clash font-bold text-lg mb-2 text-gray-800">
                  3.1. Cookies estrictamente necesarias
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Estas cookies son esenciales para que pueda navegar por el sitio web y utilizar sus funciones. Sin
                  estas cookies, no podemos proporcionar los servicios solicitados, como el acceso a su cuenta.
                </p>
              </div>

              <div>
                <h3 className="font-clash font-bold text-lg mb-2 text-gray-800">3.2. Cookies de rendimiento</h3>
                <p className="text-gray-700 leading-relaxed">
                  Estas cookies recopilan información sobre cómo utiliza nuestro sitio web, como las páginas que visita
                  con más frecuencia. Esta información se utiliza para mejorar el funcionamiento del sitio web.
                </p>
              </div>

              <div>
                <h3 className="font-clash font-bold text-lg mb-2 text-gray-800">3.3. Cookies de funcionalidad</h3>
                <p className="text-gray-700 leading-relaxed">
                  Estas cookies permiten que el sitio web recuerde las elecciones que hace (como su nombre de usuario o
                  idioma) y proporcionan funciones mejoradas y más personales.
                </p>
              </div>

              <div>
                <h3 className="font-clash font-bold text-lg mb-2 text-gray-800">3.4. Cookies de publicidad</h3>
                <p className="text-gray-700 leading-relaxed">
                  Estas cookies se utilizan para mostrar anuncios que sean relevantes para usted y sus intereses.
                  También pueden utilizarse para limitar el número de veces que ve un anuncio.
                </p>
              </div>
            </div>
          </section>

          {/* 4. Cookies de terceros */}
          <section className="mb-8">
            <h2 className="font-clash font-bold text-2xl mb-4 text-gray-900">4. Cookies de terceros</h2>
            <p className="text-gray-700 mb-4 leading-relaxed">
              Además de nuestras propias cookies, también utilizamos cookies de terceros para los siguientes propósitos:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
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
          <section className="mb-8">
            <h2 className="font-clash font-bold text-2xl mb-4 text-gray-900">5. Gestión de cookies</h2>
            <p className="text-gray-700 mb-4 leading-relaxed">
              Puede controlar y gestionar las cookies de varias maneras. Tenga en cuenta que eliminar o bloquear cookies
              puede afectar su experiencia de usuario y algunas áreas de nuestro sitio web pueden dejar de funcionar
              correctamente.
            </p>
            <p className="text-gray-700 mb-4 leading-relaxed">
              La mayoría de los navegadores web le permiten controlar las cookies a través de sus configuraciones. Para
              obtener más información sobre cómo gestionar las cookies en su navegador, consulte:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
              <li>Google Chrome</li>
              <li>Mozilla Firefox</li>
              <li>Safari</li>
              <li>Microsoft Edge</li>
            </ul>
          </section>

          {/* 6. Cambios en esta política */}
          <section className="mb-8">
            <h2 className="font-clash font-bold text-2xl mb-4 text-gray-900">6. Cambios en esta política</h2>
            <p className="text-gray-700 mb-4 leading-relaxed">
              Podemos actualizar esta Política de Cookies periódicamente para reflejar cambios en nuestras prácticas o
              por otras razones operativas, legales o reglamentarias. Le recomendamos que revise esta página
              regularmente para estar informado sobre cómo utilizamos las cookies.
            </p>
          </section>

          {/* 7. Contacto */}
          <section className="mb-8">
            <h2 className="font-clash font-bold text-2xl mb-4 text-gray-900">7. Contacto</h2>
            <p className="text-gray-700 mb-4 leading-relaxed">
              Si tiene preguntas sobre nuestra Política de Cookies, puede contactarnos en:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700">
                <strong>Email:</strong> weincardco@gmail.com
              </p>
              <p className="text-gray-700">
                <strong>Dirección:</strong> Bogotá, Colombia
              </p>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black text-white py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">© 2025 Weincard. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  )
}

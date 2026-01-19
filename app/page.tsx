import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function RestaurantLandingPage() {
  return (
    <main className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="bg-cream text-black">
        {/* Header */}
        <header className="bg-black text-white">
          <div className="container mx-auto px-4 py-6 flex items-center justify-between">
            <div className="flex items-center gap-8">
              <img src="/logo-weincard.png" alt="Weincard" className="h-4 md:h-6" />
            </div>
            <div className="flex gap-8 items-center">
              <nav className="hidden md:flex gap-4 text-xl font-extralight font-hepta-slab">
                <a href="#restaurantes" className="hover:opacity-70 transition">
                  RESTAURANTES
                </a>
                <span className="text-white">|</span>
                <a href="#planes" className="hover:opacity-70 transition">
                  PLANES
                </a>
              </nav>
              <Button className="rounded-full bg-white text-black hover:bg-white/90 font-hepta-slab font-bold">
                SUSCRÍBETE
              </Button>
            </div>
          </div>
        </header>

        {/* Hero Content */}
        <div className="container mx-auto px-4 py-12 md:py-20">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Left: Image */}
            <div className="order-2 md:order-1">
              <div className=" ">
                <img
                  src="/image-hero-weincard.webp"
                  alt="Pareja disfrutando comida"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Right: Text */}
            <div className="order-1 md:order-2 space-y-6 text-center md:text-left">
              <h1 className="font-black text-3xl md:text-4xl lg:text-5xl leading-tight tracking-tight font-clash">
                BENEFICIOS, REGALOS Y DESCUENTOS EN LOS MEJORES RESTAURANTES
              </h1>
              <hr />
              <p className="text-base md:text-lg leading-relaxed font-hepta-slab">
                Multiplica tus salidas a comer por solo <span className="font-bold">$18,900 COP/mes, </span>o ahorra dos
                meses con una suscripción anual de <span className="font-bold">$189,000 COP!</span>
              </p>
              <div className="flex justify-center md:justify-start">
                <Button className="rounded-full bg-black text-white hover:bg-black/90 px-2 py-0 text-sm font-light font-hepta-slab">
                  Comienza tu prueba<span className="font-bold">gratis de 21 días</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Restaurant Logos Section */}
      <section className="bg-cream text-black py-8 md:py-12 rounded-b-[60px]" id="restaurantes">
        <div className="container mx-auto px-4 text-center space-y-8">
          <h2 className="text-3xl md:text-5xl font-light text-balance font-hepta-slab">
            <span className="font-bold font-clash">DISFRUTA DE TUS</span>
            <br />
            RESTAURANTES FAVORITOS
          </h2>

          <div className="space-y-6 overflow-hidden">
            {/* First Row - Scrolling Right */}
            <div className="relative flex overflow-hidden">
              <div className="flex items-center gap-8 md:gap-16 animate-scroll-right">
                {/* Original set */}
                <img
                  src="/restaurante-la-causa.png"
                  alt="La Causa"
                  className="h-16 md:h-20 object-contain flex-shrink-0"
                />
                <img
                  src="/restaurante-grill-station.png"
                  alt="The Grill Station"
                  className="h-16 md:h-20 object-contain flex-shrink-0"
                />
                <img src="/restaurante-romero.png" alt="Romero" className="h-16 md:h-20 object-contain flex-shrink-0" />
                <img
                  src="/restaurante-billy-bao.png"
                  alt="Billy Bao"
                  className="h-16 md:h-20 object-contain flex-shrink-0"
                />
                <img
                  src="/restaurante-retro-face.png"
                  alt="Restaurant"
                  className="h-16 md:h-20 object-contain flex-shrink-0"
                />
                {/* Duplicate set for seamless infinite loop */}
                <img
                  src="/restaurante-la-causa.png"
                  alt="La Causa"
                  className="h-16 md:h-20 object-contain flex-shrink-0"
                />
                <img
                  src="/restaurante-grill-station.png"
                  alt="The Grill Station"
                  className="h-16 md:h-20 object-contain flex-shrink-0"
                />
                <img src="/restaurante-romero.png" alt="Romero" className="h-16 md:h-20 object-contain flex-shrink-0" />
                <img
                  src="/restaurante-billy-bao.png"
                  alt="Billy Bao"
                  className="h-16 md:h-20 object-contain flex-shrink-0"
                />
                <img
                  src="/restaurante-retro-face.png"
                  alt="Restaurant"
                  className="h-16 md:h-20 object-contain flex-shrink-0"
                />
                {/* Triple set for ultra-smooth scrolling */}
                <img
                  src="/restaurante-la-causa.png"
                  alt="La Causa"
                  className="h-16 md:h-20 object-contain flex-shrink-0"
                />
                <img
                  src="/restaurante-grill-station.png"
                  alt="The Grill Station"
                  className="h-16 md:h-20 object-contain flex-shrink-0"
                />
                <img src="/restaurante-romero.png" alt="Romero" className="h-16 md:h-20 object-contain flex-shrink-0" />
                <img
                  src="/restaurante-billy-bao.png"
                  alt="Billy Bao"
                  className="h-16 md:h-20 object-contain flex-shrink-0"
                />
                <img
                  src="/restaurante-retro-face.png"
                  alt="Restaurant"
                  className="h-16 md:h-20 object-contain flex-shrink-0"
                />
              </div>
            </div>

            {/* Second Row - Scrolling Left */}
            <div className="relative flex overflow-hidden">
              <div className="flex items-center gap-8 md:gap-16 animate-scroll-left">
                {/* Original set */}
                <img
                  src="/restaurante-la-causa.png"
                  alt="La Causa"
                  className="h-16 md:h-20 object-contain flex-shrink-0"
                />
                <img
                  src="/restaurante-grill-station.png"
                  alt="The Grill Station"
                  className="h-16 md:h-20 object-contain flex-shrink-0"
                />
                <img src="/restaurante-romero.png" alt="Romero" className="h-16 md:h-20 object-contain flex-shrink-0" />
                <img
                  src="/restaurante-billy-bao.png"
                  alt="Billy Bao"
                  className="h-16 md:h-20 object-contain flex-shrink-0"
                />
                <img
                  src="/restaurante-retro-face.png"
                  alt="Restaurant"
                  className="h-16 md:h-20 object-contain flex-shrink-0"
                />
                {/* Duplicate set for seamless infinite loop */}
                <img
                  src="/restaurante-la-causa.png"
                  alt="La Causa"
                  className="h-16 md:h-20 object-contain flex-shrink-0"
                />
                <img
                  src="/restaurante-grill-station.png"
                  alt="The Grill Station"
                  className="h-16 md:h-20 object-contain flex-shrink-0"
                />
                <img src="/restaurante-romero.png" alt="Romero" className="h-16 md:h-20 object-contain flex-shrink-0" />
                <img
                  src="/restaurante-billy-bao.png"
                  alt="Billy Bao"
                  className="h-16 md:h-20 object-contain flex-shrink-0"
                />
                <img
                  src="/restaurante-retro-face.png"
                  alt="Restaurant"
                  className="h-16 md:h-20 object-contain flex-shrink-0"
                />
                {/* Triple set for ultra-smooth scrolling */}
                <img
                  src="/restaurante-la-causa.png"
                  alt="La Causa"
                  className="h-16 md:h-20 object-contain flex-shrink-0"
                />
                <img
                  src="/restaurante-grill-station.png"
                  alt="The Grill Station"
                  className="h-16 md:h-20 object-contain flex-shrink-0"
                />
                <img src="/restaurante-romero.png" alt="Romero" className="h-16 md:h-20 object-contain flex-shrink-0" />
                <img
                  src="/restaurante-billy-bao.png"
                  alt="Billy Bao"
                  className="h-16 md:h-20 object-contain flex-shrink-0"
                />
                <img
                  src="/restaurante-retro-face.png"
                  alt="Restaurant"
                  className="h-16 md:h-20 object-contain flex-shrink-0"
                />
              </div>
            </div>
          </div>

          <a href="https://apps.apple.com/co/app/weincard/id6754571134" target="_blank"><Button className="rounded-full bg-black text-white font-bold hover:bg-black/90 px-8 mt-6 font-hepta-slab text-lg cursor-pointer" >
            Ver la App
          </Button></a>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="bg-black text-white py-16 md:py-24 rounded-b-[60px] relative z-10" id="planes">
        <div className="container mx-auto px-4 text-center space-y-12">
          <h2 className="font-black text-4xl md:text-5xl tracking-tight font-clash">ELIGE TU PLAN</h2>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="rounded-3xl p-8 md:p-12 space-y-4 backdrop-blur-xl bg-gradient-to-t from-white/40 via-white/10 to-transparent border border-white/10">
              <h3 className="font-light text-2xl md:text-3xl tracking-tight font-hepta-slab">
                <span className="font-bold font-clash">PLAN</span>
                <br />
                MENSUAL
              </h3>
              <p className="text-2xl md:text-3xl font-hepta-slab">$18.900 COP/MES</p>
            </div>
            <div className="rounded-3xl p-8 md:p-12 space-y-4 backdrop-blur-xl bg-gradient-to-t from-white/40 via-white/10 to-transparent border border-white/10">
              <h3 className="font-light text-2xl md:text-3xl tracking-tight font-hepta-slab">
                <span className="font-bold font-clash">PLAN</span>
                <br />
                ANUAL
              </h3>
              <p className="text-2xl md:text-3xl font-hepta-slab">$189.000 COP</p>
            </div>
          </div>

          <div className="space-y-6">
            <p className="text-2xl md:text-3xl font-bold font-clash">QUE PODRÍAS LIBRAR EN TU PRIMERA SALIDA.</p>
            <p className="text-lg md:text-xl text-white font-hepta-slab">Cancela cuando quieras.</p>
            <Button className="rounded-full bg-white text-black hover:bg-white/90 px-8 font-bold font-hepta-slab text-lg mt-6">
              Únete ahora
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-cream text-black py-16 md:py-24 -mt-12 relative z-0 pt-24">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex flex-col md:flex-row gap-8 lg:gap-12 mb-8 md:mb-12">
            {/* Left: Title and Steps */}
            <div className="flex-1 space-y-8 pt-12">
              <h2 className="font-black text-4xl md:text-5xl tracking-tight font-clash text-center lg:text-left">
                ¿CÓMO
                <br />
                FUNCIONA?
              </h2>
              <hr />
              {/* Mobile: Show keyhole image after title */}
              <div className="flex justify-center md:hidden">
                <div className="relative w-48 h-64">
                  <img
                    src="/images/image-key-weincard-402x.png"
                    alt="Disfrutando comida"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              <hr className="md:hidden" />

              <div className="space-y-6 text-lg md:text-xl lg:text-2xl font-hepta-slab">
                <div>
                  <span className="font-bold">1.</span> Obtén tu membresía.
                </div>
                <div className="flex gap-3 pt-4">
                  <a href="#" className="hover:opacity-90 transition">
                    <img
                      src="/images/play-store-image-weincard-402x.png"
                      alt="Descargar en Google Play"
                      className="h-10 md:h-14"
                    />
                  </a>
                  <a href="#" className="hover:opacity-90 transition">
                    <img
                      src="/images/app-store-image-weincard-402x.png"
                      alt="Descargar en App Store"
                      className="h-10 md:h-14"
                    />
                  </a>
                </div>
                <div className="mt-6">
                  <span className="font-bold">2.</span> Muestra tu tarjeta digital en los restaurantes vinculados.
                </div>
                <div>
                  <span className="font-bold">3.</span> Y disfruta de tus beneficios.
                </div>
              </div>
            </div>

            {/* Right: Keyhole image - Desktop/Tablet only, matches height of left content */}
            <div className="hidden md:block md:w-64 lg:w-72 flex-shrink-0">
              <img
                src="/images/image-key-weincard-402x.png"
                alt="Disfrutando comida"
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* GIF at the bottom */}
          <div className="w-full py-2">
            <img src="/gif-weincard.gif" alt="Llave de membresía" className="w-full h-auto object-cover" />
          </div>
        </div>
      </section>

      {/* Testimonials Section - Burgundy */}
      <section className="bg-burgundy text-white py-10 md:py-16 lg:py-20 relative overflow-hidden">
        <div className="container mx-auto px-4 relative min-h-[500px] md:min-h-[400px] lg:min-h-[450px] font-hepta-slab">
          {/* Mobile Layout - Stacked vertically */}
          <div className="flex flex-col gap-6 md:hidden pt-8">
            <p className="text-sm font-light text-red-customM text-center">
              20% <span className="text-red-500 font-bold">EN OLIVIA</span>
            </p>

            <p className="text-sm font-light text-red-customM text-center">
              MENÚ ESPECIAL <span className="font-bold">EN MISTURIA</span>
            </p>

            <p className="text-sm font-light text-red-customM text-center">
              POSTRE GRATIS <span className="text-red-500 font-bold">EN CHEF BURGER</span>
            </p>

            {/* Center main text - Mobile */}
            <div className="text-center space-y-2 py-4">
              <h2 className="text-3xl font-light tracking-wider text-red-customM font-hepta-slab">
                COSITAS
                <br />
                QUE PASAN
                <br />
                CON
              </h2>
              <div className="flex justify-center">
                <img src="/images/weincard-text.png" alt="weincard" className="w-56 h-auto" />
              </div>
            </div>

            <p className="text-sm font-light text-red-customM text-center">
              20% OFF <span className="text-red-500 font-bold">EN CHUM BURGERS</span>
            </p>

            <p className="text-sm font-light text-red-customM text-center">
              20% OFF <span className="text-red-500 font-bold">EN VIN&GRETTA</span>
            </p>
          </div>

          {/* Desktop/Tablet Layout - Absolute positioned */}
          <div className="hidden md:block">
            {/* Top row - 3 floating texts */}
            <div className="absolute top-8 left-12 lg:left-16 text-base lg:text-lg font-light text-red-customM">
              MENÚ ESPECIAL <span className="font-bold">EN MISTURIA</span>
            </div>

            <div className="absolute top-4 left-1/2 -translate-x-1/2 text-lg lg:text-xl font-light text-red-customM">
              20% <span className="text-red-500 font-bold">EN OLIVIA</span>
            </div>

            <div className="absolute top-16 right-12 lg:right-16 text-lg lg:text-xl font-light text-red-customM">
              POSTRE GRATIS <span className="text-red-500 font-bold">EN CHEF BURGER</span>
            </div>

            {/* Center main text */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-left space-y-2">
              <h2 className="text-4xl lg:text-5xl xl:text-6xl font-light tracking-wider text-red-customM font-hepta-slab">
                COSITAS
                <br />
                QUE PASAN
                <br />
                CON
              </h2>
              <img src="/images/weincard-text.png" alt="weincard" className="w-64 lg:w-80 xl:w-96 h-auto" />
            </div>

            {/* Bottom row - 2 floating texts */}
            <div className="absolute bottom-10 lg:bottom-12 left-32 lg:left-48 text-base lg:text-lg font-light text-red-customM">
              20% OFF <span className="text-red-500 font-bold">EN CHUM BURGERS</span>
            </div>

            <div className="absolute bottom-32 lg:bottom-36 right-16 lg:right-24 text-lg lg:text-xl font-light text-red-customM">
              20% OFF <span className="text-red-500 font-bold">EN VIN&GRETTA</span>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-cream text-black py-8 md:py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="font-black text-3xl md:text-4xl mb-12 text-center tracking-tight font-clash">
            PREGUNTAS FRECUENTES
          </h2>

          <Accordion type="single" collapsible className="space-y-0 border-b border-black/20">
            <AccordionItem value="item-1" className="border-b border-black/20">
              <AccordionTrigger className="text-left text-base md:text-lg hover:no-underline py-6 font-clash font-medium">
                1. ¿QUÉ ES WEINCARD?
              </AccordionTrigger>
              <AccordionContent className="text-gray-700 font-hepta-slab">
                Weincard es una membresía digital con beneficios, regalos y descuentos exclusivos en los mejores restaurantes de Medellín, perfecta para los que buscan multiplicar sus salidas. 
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="border-b border-black/20">
              <AccordionTrigger className="text-left text-base md:text-lg hover:no-underline py-6 font-clash font-medium">
                2. ¿CUÁNTO CUESTA?
              </AccordionTrigger>
              <AccordionContent className="text-gray-700 font-hepta-slab">
                La suscripción mensual cuesta $18.900 COP y el plan anual podrás adquirirlo por $189.000 COP. <br />
*Que podrías librar desde tu primera salida. 

              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="border-b border-black/20">
              <AccordionTrigger className="text-left text-base md:text-lg hover:no-underline py-6 font-clash font-medium">
                3. ¿DÓNDE PUEDO USAR WEINCARD?
              </AccordionTrigger>
              <AccordionContent className="text-gray-700 font-hepta-slab">
                Tu membresía es válida en Medellín y el Área Metropolitana. 
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="border-b border-black/20">
              <AccordionTrigger className="text-left text-base md:text-lg hover:no-underline py-6 font-clash font-medium">
                4. ¿CÓMO CANCELO MI MEMBRESÍA?
              </AccordionTrigger>
              <AccordionContent className="text-gray-700 font-hepta-slab">
                Sin complicaciones ni letra pequeña. Puedes cancelar tu suscripción en cualquier momento directamente desde tu perfil en la aplicación, en la sección: administrar suscripción.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5" className="border-b border-black/20">
              <AccordionTrigger className="text-left text-base md:text-lg hover:no-underline py-6 font-clash font-medium">
                5. ¿QUÉ INCLUYE WEINCARD?
              </AccordionTrigger>
              <AccordionContent className="text-gray-700 font-hepta-slab">
                Tu membresía incluye los mejores beneficios en los mejores restaurantes de Medellín: 30% OFF en Sushi Market, 20% OFF en Olivia, Menú Weincard en Mistura y muchísimos más restaurantes. Descarga la app y mira todos los beneficios en todos los restaurantes. 
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6" className="border-b border-black/20">
              <AccordionTrigger className="text-left text-base md:text-lg hover:no-underline py-6 font-clash font-medium">
                6. ¿QUÉ RESTAURANTES ESTÁN EN WEINCARD?
              </AccordionTrigger>
              <AccordionContent className="text-gray-700 font-hepta-slab">
                Solo los mejores. 
Logos de todos los restaurantes. Descarga la app y mira todos los beneficios en todos los restaurantes. 
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Logo */}
          <div className="flex justify-center gap-8 pt-6">
            <img src="/logo-weincard.png" alt="Weincard" className="h-4 md:h-6 brightness-0" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-4 text-sm text-white font-hepta-slab">
            <a href="#restaurantes" className="hover:text-white/70 transition">
              RESTAURANTES
            </a>
            <span className="hidden md:inline text-white">|</span>
            <a href="#planes" className="hover:text-white/70 transition">
              PLANES
            </a>
            <span className="hidden md:inline text-white">|</span>
            <a href="#" className="hover:text-white/70 transition">
              SUBSCRÍBETE
            </a>
          </div>
        </div>
      </footer>
    </main>
  )
}

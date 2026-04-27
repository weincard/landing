import HeaderAuth from "@/components/header-auth"
import { MobileMenu } from "@/components/home-client"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <main className="min-h-screen bg-black flex flex-col">
      {/* Header */}
      <header className="bg-black text-white">
        <div className="container mx-auto px-4 py-6 flex items-center justify-between">
          <a href="/">
            <img src="/logo-weincard.png" alt="Weincard" className="h-4 md:h-6" />
          </a>
          <div className="flex gap-3 items-center">
            <nav className="hidden md:flex gap-4 text-xl font-extralight font-hepta-slab text-white">
              <a href="/catalogo" className="hover:opacity-70 transition">
                RESTAURANTES
              </a>
              <span>|</span>
              <a href="/planes" className="hover:opacity-70 transition">
                PLANES
              </a>
            </nav>
            <MobileMenu />
            <HeaderAuth />
          </div>
        </div>
      </header>

      {/* 404 Content */}
      <section className="flex-1 bg-cream text-black flex flex-col items-center justify-center px-4 py-20 rounded-t-[60px] mt-2">
        <div className="max-w-2xl w-full text-center space-y-8">
          {/* Large 404 */}
          <p className="font-black text-[120px] md:text-[180px] leading-none tracking-tighter font-clash text-black/10 select-none">
            404
          </p>

          {/* Main message */}
          <div className="-mt-8 space-y-4">
            <h1 className="font-black text-3xl md:text-5xl tracking-tight font-clash text-balance">
              PÁGINA NO ENCONTRADA
            </h1>
            <p className="text-base md:text-lg font-hepta-slab text-black/60 leading-relaxed max-w-md mx-auto text-pretty">
              Parece que esta mesa ya no está disponible. Vuelve al inicio y sigue disfrutando de tus beneficios.
            </p>
          </div>

          {/* Divider */}
          <hr className="border-black/20" />

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a href="/">
              <Button className="rounded-full bg-black text-white hover:bg-black/80 px-8 font-bold font-hepta-slab text-base cursor-pointer">
                Volver al inicio
              </Button>
            </a>
            <a href="/catalogo" className="font-hepta-slab text-base font-semibold underline underline-offset-4 hover:opacity-60 transition">
              Ver restaurantes
            </a>
          </div>
        </div>
      </section>

      {/* Footer strip */}
      <footer className="bg-black text-white py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-xs font-hepta-slab text-white/40">
            &copy; {new Date().getFullYear()} Weincard. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </main>
  )
}

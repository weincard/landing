"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import HeaderAuth from "@/components/header-auth"
import { MobileMenu } from "@/components/home-client"
import { getToken } from "@/lib/auth"
import API_BASE from "@/lib/api"

const API_URL = `${API_BASE}/branches/filter`
const PAGE_SIZE = 10

const DAY_ES: Record<string, string> = {
  Monday: "Lunes",
  Tuesday: "Martes",
  Wednesday: "Miércoles",
  Thursday: "Jueves",
  Friday: "Viernes",
  Saturday: "Sábado",
  Sunday: "Domingo",
}

interface Offer {
  offerId: number
  title: string
  description: string
  offerType: string
  value: string
  conditions: string
  validFrom: string
  validTo: string | null
  validDays: string[]
  isActive: boolean
  expiresAt: string | null
  excludesBankHolidays: boolean
}

interface Category {
  categoryId: number
  name: string
  description: string
  image: string
  slug: string
}

interface Merchant {
  merchantId: number
  name: string
  description: string
  logoUrl: string
  country: string
  state: string
  founder: boolean
  createdAt: string
}

interface Branch {
  branchId: number
  name: string
  slug: string
  description: string
  address: string
  city: string
  country: string
  phone: string
  whatsapp: string
  canContact: boolean
  email: string
  website: string
  logoUrl: string
  coverImageUrl: string | null
  note: string
  isActive: boolean
  images: string[]
  tags: string[] | null
  createdAt: string
  category: Category
  merchant: Merchant
  offers: Offer[]
  favoritesCount: number
}

interface ApiResponse {
  message: string
  branches: Branch[]
  count: number
  nextCursor: string | null
}

function daysToSpanish(days: string[]): string {
  return days.map((d) => DAY_ES[d] ?? d).join(", ")
}

// ─── Branch Card ────────────────────────────────────────────────────────────

function BranchCard({ branch, onOpen }: { branch: Branch; onClick?: () => void; onOpen: (b: Branch) => void }) {
  const firstImage = branch.images?.[0] ?? branch.coverImageUrl ?? branch.logoUrl
  const firstOffer = branch.offers?.[0]
  const validDays = firstOffer?.validDays ?? []

  return (
    <article
      className="bg-white rounded-2xl overflow-hidden cursor-pointer group shadow-sm hover:shadow-md transition-shadow"
      onClick={() => onOpen(branch)}
    >
      <div className="relative overflow-hidden aspect-[4/3]">
        {firstImage ? (
          <img
            src={firstImage}
            alt={branch.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            style={{ viewTransitionName: `branch-img-${branch.branchId}` }}
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            {branch.logoUrl && (
              <img src={branch.logoUrl} alt={branch.name} className="w-20 h-20 object-contain opacity-40" />
            )}
          </div>
        )}
        {/* Offer tags overlay */}
        {branch.offers.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 p-3 flex flex-wrap gap-2">
            {branch.offers.map((offer) => (
              <span
                key={offer.offerId}
                className="bg-black text-white text-xs font-bold font-clash px-2 py-1 rounded-full"
              >
                {offer.title}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="p-4 space-y-1">
        <h3 className="font-bold text-sm font-clash leading-tight line-clamp-2">{branch.name}</h3>
        <p className="text-xs text-gray-500 font-hepta-slab">
          <span className="font-semibold text-gray-700">Disponible</span>{" "}
          {validDays.length === 0 ? "Todos los días" : daysToSpanish(validDays)}
        </p>
        {branch.category?.name && (
          <span className="inline-block text-xs font-hepta-slab text-white bg-black rounded-full px-2 py-0.5 mt-1 font-bold">
            {branch.category.name}
          </span>
        )}
      </div>
    </article>
  )
}

// ─── Modal ───────────────────────────────────────────────────────────────────

function BranchModal({ branch, onClose }: { branch: Branch; onClose: () => void }) {
  const [imgIndex, setImgIndex] = useState(0)
  const [imgLoading, setImgLoading] = useState(true)
  const [loggedIn, setLoggedIn] = useState(false)
  const [hasMembership, setHasMembership] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const token = getToken()
    setLoggedIn(!!token)
    document.body.style.overflow = "hidden"

    if (token) {
      fetch(`${API_BASE}/memberships/by-user`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data) {
            const memberships = data.userMemberships ?? data
            const m = Array.isArray(memberships) ? memberships[0] : memberships
            if (m && (m.status === "active" || m.status === "ACTIVE")) {
              setHasMembership(true)
            }
          }
        })
        .catch(() => { })
    }

    return () => { document.body.style.overflow = "" }
  }, [])

  const images = branch.images?.length ? branch.images : branch.coverImageUrl ? [branch.coverImageUrl] : []

  function getAppStoreUrl(): string {
    if (typeof window === "undefined") return "https://play.google.com/store/apps/details?id=com.weincard.app.idp"
    const ua = navigator.userAgent || navigator.vendor || ""
    const isApple = /iPhone|iPad|iPod|Macintosh|Mac OS X/i.test(ua)
    return isApple
      ? "https://apps.apple.com/co/app/weincard/id6754571134"
      : "https://play.google.com/store/apps/details?id=com.weincard.app.idp"
  }

  function handleCta() {
    if (!loggedIn) {
      const params = new URLSearchParams(searchParams.toString())
      router.push(`/login?redirect=/catalogo${params.toString() ? `?${params}` : ""}`)
      return
    }
    if (hasMembership) {
      window.open(getAppStoreUrl(), "_blank", "noopener,noreferrer")
      return
    }
    // logged in but no membership - redirect to plans
    router.push("/planes")
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={branch.name}
    >
      <div
        className="bg-white w-full md:max-w-2xl max-h-[92dvh] overflow-y-auto rounded-t-3xl md:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image slider */}
        {images.length > 0 && (
          <div className="relative aspect-video bg-gray-100">
            <img
              key={images[imgIndex]}
              src={images[imgIndex]}
              alt={`${branch.name} imagen ${imgIndex + 1}`}
              className={`w-full h-full object-cover transition-opacity duration-300 ${imgLoading ? "opacity-0" : "opacity-100"}`}
              style={{ viewTransitionName: `branch-img-${branch.branchId}` }}
              onLoadStart={() => setImgLoading(true)}
              onLoad={() => setImgLoading(false)}
              onError={() => setImgLoading(false)}
            />
            {/* Spinner overlay while image loads */}
            {imgLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <svg
                  className="animate-spin w-8 h-8 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
              </div>
            )}
            {images.length > 1 && (
              <>
                <button
                  onClick={() => { setImgIndex((i) => (i - 1 + images.length) % images.length); setImgLoading(true) }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-black/70 transition cursor-pointer"
                  aria-label="Imagen anterior"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M7.72 12.53a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 1 1 1.06 1.06L9.31 12l6.97 6.97a.75.75 0 1 1-1.06 1.06l-7.5-7.5Z" clipRule="evenodd" /></svg>
                </button>
                <button
                  onClick={() => { setImgIndex((i) => (i + 1) % images.length); setImgLoading(true) }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-black/70 transition cursor-pointer"
                  aria-label="Imagen siguiente"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M16.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z" clipRule="evenodd" /></svg>
                </button>
                {/* Dots */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => { setImgIndex(i); setImgLoading(true) }}
                      className={`w-2 h-2 rounded-full transition ${i === imgIndex ? "bg-white" : "bg-white/50"}`}
                      aria-label={`Ir a imagen ${i + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 bg-black/50 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-black/70 transition cursor-pointer"
              aria-label="Cerrar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" /></svg>
            </button>
          </div>
        )}

        <div className="p-6 space-y-6">
          {/* Tags, name, category */}
          <div className="space-y-3">
            {branch.offers.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {branch.offers.map((offer) => (
                  <span key={offer.offerId} className="bg-black text-white text-xs font-bold font-clash px-3 py-1 rounded-full">
                    {offer.title}
                  </span>
                ))}
              </div>
            )}
            <h2 className="font-black text-2xl font-clash leading-tight">{branch.name}</h2>
            {branch.category?.name && (
              <span className="inline-block text-sm font-hepta-slab text-white bg-black rounded-full px-3 py-0.5 font-bold">
                {branch.category.name}
              </span>
            )}
          </div>

          {/* Lo importante */}
          {branch.offers.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-black text-lg font-clash">Lo importante</h3>
              <div className="space-y-5">
                {branch.offers.map((offer) => (
                  <div key={offer.offerId} className="space-y-2">
                    <p className="text-base font-hepta-slab text-gray-700">{offer.description}</p>
                    {/* Title with tag icon */}
                    <div className="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 flex-shrink-0 text-black">
                        <path fillRule="evenodd" d="M5.25 2.25a3 3 0 0 0-3 3v4.318a3 3 0 0 0 .879 2.121l9.58 9.581c.92.92 2.39 1.186 3.548.428a18.849 18.849 0 0 0 5.441-5.44c.758-1.16.492-2.629-.428-3.548l-9.58-9.581a3 3 0 0 0-2.121-.879H5.25ZM6.375 7.5a1.125 1.125 0 1 0 0-2.25 1.125 1.125 0 0 0 0 2.25Z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm font-bold font-clash">{offer.title}</span>
                    </div>
                    {/* Days */}
                    <div className="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 flex-shrink-0 text-black">
                        <path d="M12.75 12.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM7.5 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM8.25 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM9.75 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM10.5 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM16.5 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM15 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM16.5 17.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" />
                        <path fillRule="evenodd" d="M6.75 2.25A.75.75 0 0 1 7.5 3v1.5h9V3A.75.75 0 0 1 18 3v1.5h.75a3 3 0 0 1 3 3v11.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V7.5a3 3 0 0 1 3-3H6V3a.75.75 0 0 1 .75-.75Zm13.5 9a1.5 1.5 0 0 0-1.5-1.5H5.25a1.5 1.5 0 0 0-1.5 1.5v7.5a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5v-7.5Z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm font-hepta-slab text-gray-600">
                        <span className="font-semibold text-gray-800">Disponible</span>{" "}
                        {offer.validDays.length > 0 ? daysToSpanish(offer.validDays) : "Todos los días"}
                      </span>
                    </div>
                    {/* Conditions */}
                    {offer.conditions && (
                      <div className="flex items-start gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 flex-shrink-0 mt-0.5 text-black">
                          <path fillRule="evenodd" d="M7.502 6h7.128A3.375 3.375 0 0 1 18 9.375v9.375a3 3 0 0 0 3-3V6.108c0-1.505-1.125-2.811-2.664-2.94a48.972 48.972 0 0 0-.673-.05A3 3 0 0 0 15 1.5h-1.5a3 3 0 0 0-2.663 1.618c-.225.015-.45.032-.673.05C8.662 3.295 7.554 4.542 7.502 6ZM13.5 3A1.5 1.5 0 0 0 12 4.5h4.5A1.5 1.5 0 0 0 15 3h-1.5Z" clipRule="evenodd" />
                          <path fillRule="evenodd" d="M3 9.375C3 8.339 3.84 7.5 4.875 7.5h9.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 0 1 3 20.625V9.375Zm9.586 4.594a.75.75 0 0 0-1.172-.938l-2.476 3.096-.908-.907a.75.75 0 0 0-1.06 1.06l1.5 1.5a.75.75 0 0 0 1.116-.062l3-3.75Z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm font-hepta-slab text-gray-600">{offer.conditions}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Detalles del lugar */}
          {branch.description && (
            <div className="space-y-2">
              <h3 className="font-black text-lg font-clash">Detalles del lugar</h3>
              <p className="text-sm font-hepta-slab text-gray-600 leading-relaxed">{branch.description}</p>
            </div>
          )}
          {/* Ubicación */}
          {branch.address && (
            <div className="space-y-2">
              <h3 className="font-black text-lg font-clash">Ubicación</h3>
              <p className="text-sm font-hepta-slab text-gray-600 leading-relaxed">{branch.address}</p>
              {branch.city && <p className="text-sm font-hepta-slab text-gray-600 leading-relaxed">{branch.city}</p>}
            </div>
          )}

          {/* CTA button */}
          <button
            onClick={handleCta}
            className="w-full py-4 rounded-2xl font-bold font-clash text-base transition bg-black text-white hover:bg-black/80 cursor-pointer"
          >
            {!loggedIn ? "Iniciar sesión" : hasMembership ? "Abrir Weincard" : "Activa tu Weincard"}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function CatalogoPage() {
  const [query, setQuery] = useState("")
  const [inputValue, setInputValue] = useState("")
  const [branches, setBranches] = useState<Branch[]>([])
  const [count, setCount] = useState(0)
  const [skip, setSkip] = useState(0)
  const [loading, setLoading] = useState(false)
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const fetchBranches = useCallback(async (name: string, skipVal: number, replace: boolean) => {
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}?limit=${PAGE_SIZE}&skip=${skipVal}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(name.trim() ? { name: name.trim() } : {}),
      })
      if (!res.ok) throw new Error("Error al cargar sucursales")
      const data: ApiResponse = await res.json()
      setBranches((prev) => replace ? data.branches : [...prev, ...data.branches])
      setCount(data.count)
    } catch {
      // silent fail
    } finally {
      setLoading(false)
    }
  }, [])

  // Initial load
  useEffect(() => {
    fetchBranches("", 0, true)
  }, [fetchBranches])

  // Debounced search
  function handleInput(val: string) {
    setInputValue(val)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      setQuery(val)
      setSkip(0)
      fetchBranches(val, 0, true)
    }, 400)
  }

  function handleLoadMore() {
    const newSkip = skip + PAGE_SIZE
    setSkip(newSkip)
    fetchBranches(query, newSkip, false)
  }

  const hasMore = branches.length < count

  return (
    <main className="min-h-screen bg-[#F5F1E8]">
      {/* Header */}
      <header className="bg-black text-white sticky top-0 z-40">
        <div className="container mx-auto px-4 py-5 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <a href="/">
              <img src="/logo-weincard.png" alt="Weincard" className="h-4 md:h-6" />
            </a>
          </div>
          <div className="flex gap-3 items-center">
            <nav className="hidden md:flex gap-4 text-xl font-extralight font-hepta-slab">
              <a href="/catalogo" className="opacity-70 transition">
                RESTAURANTES
              </a>
              <span className="text-white">|</span>
              <a href="/planes" className="hover:opacity-70 transition">
                PLANES
              </a>
            </nav>
            <MobileMenu />
            <HeaderAuth />
          </div>
        </div>
      </header>

      {/* Search bar */}
      <section className="bg-black pb-8 pt-2">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="relative">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
            >
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => handleInput(e.target.value)}
              placeholder="Buscar restaurante..."
              className="w-full bg-white rounded-full pl-12 pr-5 py-3.5 text-sm font-hepta-slab text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/40"
            />
          </div>

          <p className="text-white/60 text-sm font-hepta-slab mt-3 pl-1">
            {loading ? "Buscando..." : <><span className="font-bold text-white">{count}</span> resultados</>}
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="container mx-auto px-4 py-8 max-w-7xl">
        <p className="text-black text-xl font-hepta-slab mb-4 pl-1">
          <span className="font-bold ">Todos los beneficios</span>
        </p>
        {loading && branches.length === 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
                <div className="aspect-[4/3] bg-gray-200" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : branches.length === 0 ? (
          <div className="text-center py-20 font-hepta-slab text-gray-500">
            No se encontraron resultados para "{query}"
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {branches.map((branch) => (
                <BranchCard key={branch.branchId} branch={branch} onOpen={setSelectedBranch} />
              ))}
            </div>

            {hasMore && (
              <div className="flex justify-center mt-10">
                <button
                  onClick={handleLoadMore}
                  disabled={loading}
                  className="bg-black text-white font-bold font-clash px-10 py-3.5 rounded-full hover:bg-black/80 transition disabled:opacity-50 cursor-pointer"
                >
                  {loading ? "Cargando..." : "Ver más"}
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {/* Modal */}
      {selectedBranch && (
        <BranchModal branch={selectedBranch} onClose={() => setSelectedBranch(null)} />
      )}
    </main>
  )
}

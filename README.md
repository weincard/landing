# Weincard Landing Page

Landing page oficial para Weincard - Plataforma de membresías premium para restaurantes.

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/weincardco-3246s-projects/v0-gastro-landing-page)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/gLXET6JRbxq)
[![Next.js](https://img.shields.io/badge/Next.js-16.0.10-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)

## Descripción

Landing page moderna y responsive para Weincard, una plataforma de membresías que ofrece descuentos y beneficios exclusivos en más de 50 restaurantes asociados. El sitio presenta información sobre planes de suscripción, restaurantes aliados, y toda la información legal necesaria para los usuarios.

## Características Principales

- **Diseño Moderno y Responsive**: Adaptado perfectamente a móvil, tablet y desktop
- **Hero Section Atractivo**: Imagen destacada con call-to-action principal
- **Carrusel Infinito de Logos**: Animación suave de restaurantes asociados
- **Planes de Suscripción**: Cards con efecto glassmorphism mostrando opciones Individual y Duo
- **Sección "Cómo Funciona"**: Pasos claros con imágenes y enlaces a app stores
- **Testimonios Dinámicos**: Frases flotantes sobre fondo oscuro
- **FAQ Interactivo**: Accordion con preguntas frecuentes
- **Páginas Legales Completas**: Términos, privacidad, cookies y eliminación de cuenta

## Stack Tecnológico

### Framework y Librerías

- **Next.js 16.0.10**: Framework React con App Router
- **React 19.2.0**: Biblioteca de UI
- **TypeScript 5**: Tipado estático
- **Tailwind CSS 4.1.9**: Framework CSS utility-first
- **Radix UI**: Componentes accesibles y sin estilo
- **Lucide React**: Iconos modernos

### Componentes UI

- Accordion, Alert Dialog, Avatar, Button, Card, Dialog, Dropdown Menu
- Form components con React Hook Form y Zod validation
- Toast notifications con Sonner
- Theming con next-themes

### Fuentes Personalizadas

- **Clash Grotesk**: Bold (700) y Medium (500) - Títulos y headers
- **Hepta Slab**: 400, 700, 900 - Texto decorativo
- **Inter**: Variable - Texto general
- **Playfair Display**: Variable - Títulos elegantes

## Estructura del Proyecto

```
├── app/
│   ├── page.tsx                          # Home/Landing principal
│   ├── layout.tsx                        # Layout global
│   ├── globals.css                       # Estilos globales y animaciones
│   ├── delete-account/
│   │   └── page.tsx                      # Formulario de eliminación de cuenta
│   ├── politica-de-cookies/
│   │   └── page.tsx                      # Política de cookies
│   ├── politica-de-privacidad/
│   │   └── page.tsx                      # Política de privacidad
│   └── terminos-y-condiciones/
│       └── page.tsx                      # Términos y condiciones
├── components/
│   └── ui/                               # Componentes UI reutilizables (shadcn)
├── public/
│   ├── fonts/                            # Fuentes personalizadas
│   │   ├── ClashGrotesk-Bold.ttf
│   │   └── ClashGrotesk-Medium.ttf
│   └── images/                           # Assets e imágenes
├── lib/
│   └── utils.ts                          # Utilidades (cn function)
└── hooks/                                # Custom React hooks
```

## Instalación y Configuración

### Prerrequisitos

- Node.js 20.x o superior
- pnpm (recomendado) o npm

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/your-org/landing-page-weincard.git

# Navegar al directorio
cd landing-page-weincard

# Instalar dependencias
pnpm install
```

### Desarrollo Local

```bash
# Iniciar servidor de desarrollo
pnpm dev

# La aplicación estará disponible en http://localhost:3000
```

### Build para Producción

```bash
# Crear build optimizado
pnpm build

# Iniciar servidor de producción
pnpm start
```

### Linting

```bash
# Ejecutar ESLint
pnpm lint
```

## Scripts Disponibles

| Script | Descripción |
|--------|-------------|
| `pnpm dev` | Inicia el servidor de desarrollo |
| `pnpm build` | Crea el build de producción |
| `pnpm start` | Inicia el servidor de producción |
| `pnpm lint` | Ejecuta el linter |

## Rutas y Páginas

### Página Principal

- **Ruta**: `/`
- **Descripción**: Landing page principal con todas las secciones
- **Secciones**:
  - Hero con imagen destacada
  - Logos de restaurantes (carrusel infinito)
  - Planes de suscripción
  - Cómo funciona
  - Testimonios
  - FAQ
  - Footer

### Páginas Legales

| Ruta | Descripción |
|------|-------------|
| `/terminos-y-condiciones` | Términos y condiciones del servicio |
| `/politica-de-privacidad` | Política de tratamiento de datos personales |
| `/politica-de-cookies` | Política de uso de cookies |
| `/delete-account` | Formulario para solicitar eliminación de cuenta |

## Despliegue

### Vercel (Recomendado)

1. Conecta tu repositorio de GitHub a Vercel
2. Vercel detectará automáticamente Next.js
3. Despliega con un clic

### AWS Amplify

Configuración para `amplify.yml`:

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - nvm use 20
        - pnpm install
    build:
      commands:
        - pnpm run build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - .next/cache/**/*
      - node_modules/**/*
```

**Importante**: Configurar la app como "Next.js - SSR" en Amplify Console.

### Variables de Entorno

Si necesitas configurar variables de entorno, crea un archivo `.env.local`:

```env
# Ejemplo de variables
NEXT_PUBLIC_APP_URL=https://weincard.com
```

## Personalización

### Colores del Tema

Los colores principales están definidos en `app/globals.css`:

- `--cream`: #F5F1E8 (Fondo claro)
- `--burgundy`: #7A1818 (Acento principal)
- `--background`: Negro/Blanco según tema
- `--foreground`: Texto principal

### Tipografía

Las fuentes se configuran en `app/layout.tsx` y `app/globals.css`. Para usar las fuentes personalizadas:

```tsx
<h1 className="font-clash font-bold">Título con Clash Grotesk Bold</h1>
<h2 className="font-hepta-slab">Título con Hepta Slab</h2>
<p className="font-sans">Texto con Inter</p>
```

### Animaciones

Las animaciones del carrusel infinito están en `app/globals.css`:

- `scroll-left`: Desplazamiento hacia la izquierda
- `scroll-right`: Desplazamiento hacia la derecha

## Componentes Principales

### Header

Header fijo con logo de Weincard y menú de navegación (Restaurantes | Planes).

### Cards de Pricing

Tarjetas con efecto glassmorphism usando `backdrop-filter: blur()` y gradientes.

### Carrusel de Logos

Carrusel infinito con animación CSS que repite logos de restaurantes asociados.

### FAQ Accordion

Componente acordeón de Radix UI con 6 preguntas frecuentes.

## Optimizaciones

- **Imágenes Optimizadas**: Uso de Next.js Image component
- **Fuentes Personalizadas**: Cargadas localmente para mejor performance
- **CSS Moderno**: Tailwind CSS 4 con configuración inline
- **Animaciones GPU**: Transform y opacity para animaciones suaves
- **Code Splitting**: Automático con Next.js App Router

## Soporte de Navegadores

- Chrome (últimas 2 versiones)
- Firefox (últimas 2 versiones)
- Safari (últimas 2 versiones)
- Edge (últimas 2 versiones)
- Móviles: iOS Safari, Chrome Android

## Contribución

Este proyecto es mantenido por el equipo de Weincard. Para contribuir:

1. Haz fork del repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Copyright © 2025 Weincard. Todos los derechos reservados.

## Contacto

- **Website**: [https://weincard.com](https://weincard.com)
- **Email**: info@weincard.com

## Links Útiles

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [Radix UI](https://www.radix-ui.com)
- [v0.app Chat](https://v0.app/chat/gLXET6JRbxq)

---

**Built with ❤️ using Next.js 16 and Tailwind CSS 4**

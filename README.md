# Weincard Dashboard

## Descripción del proyecto

### Objetivo del sistema

Weincard Dashboard es una plataforma administrativa diseñada para gestionar un programa de membresías digitales que permite a comercios afiliados ofrecer descuentos y beneficios exclusivos a sus clientes. El sistema proporciona herramientas completas para la administración de usuarios, comercios, sucursales, cupones, redenciones y análisis de métricas en tiempo real.

### Problema que resuelve

El sistema resuelve la complejidad de gestionar programas de fidelización y beneficios para múltiples comercios y usuarios. Permite:

- Centralizar la gestión de comercios afiliados (aliados) y sus sucursales
- Administrar planes de membresía y cupones de descuento de forma eficiente
- Controlar y auditar las redenciones de beneficios en tiempo real
- Proporcionar análisis y métricas del comportamiento de usuarios y comercios
- Gestionar diferentes roles de usuario con permisos específicos
- Facilitar la comunicación entre el programa de membresías y los comercios participantes

### Alcance general

El dashboard abarca las siguientes funcionalidades principales:

- **Gestión de usuarios**: Creación, edición y administración de cuentas de usuario con diferentes roles (superadmin, admin, etc.)
- **Gestión de aliados**: Administración de comercios afiliados al programa
- **Gestión de sucursales**: Control de las ubicaciones físicas de cada comercio
- **Gestión de cupones**: Creación y administración de ofertas y descuentos
- **Sistema de redenciones**: Registro y seguimiento de cupones utilizados
- **Panel de métricas**: Visualización de estadísticas y gráficos de rendimiento
- **Autenticación y autorización**: Sistema robusto de login con recuperación de contraseña
- **Integración con servicios externos**: Almacenamiento de archivos en AWS S3 y visualización de mapas con Google Maps

## Arquitectura

### Descripción general

El sistema sigue una arquitectura de aplicación web moderna basada en React con renderizado del lado del servidor (SSR) mediante Next.js. La arquitectura se divide en las siguientes capas:

**Frontend (Next.js + React)**
- Aplicación construida con Next.js 15.x utilizando el App Router
- Componentes de interfaz basados en React 18.x con TypeScript
- Sistema de componentes reutilizables con shadcn/ui y Radix UI
- Gestión de estado con Zustand para estado global y React Hook Form para formularios
- Estilos con Tailwind CSS y componentes personalizados

**Backend API (Externo)**
- API RESTful que maneja la lógica de negocio y acceso a datos
- Se comunica mediante HTTP usando Axios
- Autenticación basada en tokens JWT (Bearer tokens)
- URL base configurable mediante variables de entorno

**Servicios externos**
- **AWS S3**: Almacenamiento de imágenes y archivos estáticos
- **Cloudinary**: Gestión, optimización y transformación de imágenes en la nube
- **Google Maps API**: Visualización de ubicaciones de sucursales en mapas interactivos

**Base de datos**
- Gestionada por la API externa (no acceso directo desde el frontend)

### Flujo de comunicación entre componentes

1. **Autenticación del usuario**:
   - Usuario ingresa credenciales en formulario de login
   - Petición HTTP enviada a la API mediante axios
   - API valida credenciales y retorna token JWT
   - Token almacenado en cookies HTTP-only
   - Middleware verifica token en cada navegación

2. **Acceso a rutas protegidas**:
   - Next.js middleware intercepta cada petición
   - Verifica existencia y validez del token
   - Consulta información del usuario a la API
   - Valida permisos según rol del usuario
   - Redirige o permite acceso según autorización

3. **Operaciones CRUD**:
   - Componente de vista invoca custom hook o servicio
   - Servicio utiliza http-client (axios configurado) para peticiones
   - Adaptadores transforman respuestas de API a interfaces TypeScript
   - Estado actualizado mediante hooks o gestión de estado
   - UI re-renderiza con nueva información

4. **Carga de archivos**:
   - Usuario selecciona archivo en formulario
   - Archivo enviado a la API
   - API sube archivo a bucket de AWS S3 o Cloudinary según configuración
   - URL del archivo retornada y almacenada en base de datos
   - Imágenes cargadas desde S3 o Cloudinary mediante componente Next.js Image con optimizaciones automáticas

5. **Inyección de dependencias**:
   - Patrón de diseño implementado con InversifyJS
   - Servicios registrados en contenedor DI
   - Permite testing y mantenibilidad del código
   - Facilita el intercambio de implementaciones

## Tecnologías utilizadas

### Lenguajes

- **TypeScript 5.x**: Lenguaje principal del proyecto, proporciona tipado estático y mejora la experiencia de desarrollo
- **JavaScript (ES6+)**: Para archivos de configuración y scripts
- **CSS**: Mediante Tailwind CSS para estilos

### Frameworks

- **Next.js 15.2.x**: Framework de React con SSR, SSG y App Router para enrutamiento moderno
- **React 18.x**: Librería de interfaz de usuario para construir componentes interactivos
- **Tailwind CSS 3.4.x**: Framework de CSS utility-first para diseño responsivo

### Infraestructura y servicios en la nube

- **AWS S3**: Almacenamiento de objetos para imágenes y archivos del sistema
- **Cloudinary**: Plataforma de gestión de medios para almacenamiento, optimización y transformación de imágenes
- **Google Maps Platform**: API para visualización de mapas y geolocalización
- **Node.js 20.x**: Entorno de ejecución para el proyecto

## Librerías principales

### Gestión de formularios y validación

- **react-hook-form (7.53.x)**: Manejo eficiente de formularios con validación integrada
- **@hookform/resolvers (3.9.x)**: Resolvers para integrar validadores externos con react-hook-form
- **zod (3.23.x)**: Librería de validación y parsing de esquemas TypeScript-first

### Componentes de interfaz

- **@radix-ui/react-*** (múltiples paquetes): Componentes accesibles y sin estilos para construir UI
- **shadcn/ui**: Sistema de componentes construido sobre Radix UI con estilos de Tailwind
- **lucide-react (0.475.x)**: Librería de iconos moderna y personalizable
- **react-icons (5.5.x)**: Colección de iconos populares para React

### Visualización de datos

- **recharts (3.5.x)**: Librería de gráficos construida con componentes de React
- **@tremor/react (3.18.x)**: Componentes para dashboards y visualización de datos

### Gestión de estado

- **zustand (5.0.x)**: Librería ligera de gestión de estado global
- **cookies-next (4.3.x)**: Manejo de cookies en Next.js (cliente y servidor)

### HTTP y comunicación

- **axios (1.7.x)**: Cliente HTTP para realizar peticiones a la API
- **@react-google-maps/api (2.20.x)**: Componentes de React para Google Maps

### Inyección de dependencias

- **inversify (6.0.x)**: Contenedor de inyección de dependencias para TypeScript
- **reflect-metadata (0.2.x)**: Polyfill para decoradores y metadata reflection

### Utilidades

- **date-fns (4.1.x)**: Librería moderna para manipulación de fechas
- **lodash (4.17.x)**: Utilidades de programación funcional
- **clsx (2.1.x)**: Utilidad para construcción condicional de classNames
- **tailwind-merge (3.0.x)**: Combina clases de Tailwind sin conflictos

### Notificaciones y feedback

- **sonner (1.5.x)**: Librería de toasts para notificaciones
- **react-hot-toast (2.5.x)**: Sistema alternativo de notificaciones

### Exportación de datos

- **xlsx (0.18.x)**: Librería para lectura y escritura de archivos Excel

### Experiencia de usuario

- **next-nprogress-bar (2.3.x)**: Barra de progreso para transiciones de página
- **vaul (1.1.x)**: Componente drawer para móvil
- **next-themes (0.3.x)**: Soporte para modo oscuro/claro

## Requisitos previos

### Versiones mínimas necesarias

- **Node.js**: Versión 20.x o superior
- **npm**: Versión 10.x o superior (incluido con Node.js)
- **pnpm**: Versión 8.x o superior (gestor de paquetes recomendado)

### Variables de entorno requeridas

El proyecto requiere las siguientes variables de entorno. Crear un archivo `.env.local` en la raíz del proyecto con:

```env
# URL base de la API backend
NEXT_PUBLIC_API_URL=https://api.ejemplo.com/api/v1

# Google Maps API Key para visualización de mapas
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=tu_google_maps_api_key_aqui

# Cloudinary para gestión de imágenes (opcional según configuración)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=tu_cloud_name
NEXT_PUBLIC_CLOUDINARY_API_KEY=tu_api_key
```

**Descripción de variables**:

- `NEXT_PUBLIC_API_URL`: URL completa del servidor backend de la API. Esta variable debe incluir el protocolo (https://) y la ruta base de la API
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`: Clave de API de Google Maps Platform con permisos para Maps JavaScript API y Geocoding API
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`: Nombre del cloud de Cloudinary para gestión de imágenes
- `NEXT_PUBLIC_CLOUDINARY_API_KEY`: API Key de Cloudinary (opcional según configuración del proyecto)

**Nota importante**: Las variables con prefijo `NEXT_PUBLIC_` están expuestas al navegador. No incluir secretos sensibles en estas variables.

## Instalación y ejecución local

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd weincard-dashboard
```

### 2. Instalación de dependencias

El proyecto utiliza `pnpm` como gestor de paquetes. Si no lo tiene instalado:

```bash
npm install -g pnpm
```

Instalar las dependencias del proyecto:

```bash
pnpm install
```

### 3. Configuración de variables de entorno

Crear el archivo `.env.local` en la raíz del proyecto:

```bash
cp .env.example .env.local  # Si existe archivo de ejemplo
```

Editar el archivo `.env.local` y configurar las variables requeridas mencionadas en la sección anterior.

### 4. Ejecutar el proyecto en modo desarrollo

```bash
pnpm dev
```

El servidor de desarrollo se iniciará en `http://localhost:3000`

### 5. Compilar para producción

```bash
pnpm build
```

### 6. Ejecutar en modo producción

```bash
pnpm start
```

### 7. Ejecutar análisis de código (linting)

```bash
pnpm lint
```

## Estructura del proyecto

```
weincard-dashboard/
├── public/                      # Archivos estáticos públicos
├── src/
│   ├── app/                     # App Router de Next.js (rutas y layouts)
│   │   ├── (auth)/             # Grupo de rutas de autenticación
│   │   │   ├── login/          # Página de inicio de sesión
│   │   │   ├── register/       # Página de registro
│   │   │   ├── forgot-password/ # Recuperación de contraseña
│   │   │   └── reset-password/ # Restablecimiento de contraseña
│   │   ├── dashboard/          # Grupo de rutas protegidas del dashboard
│   │   │   ├── allies/         # Gestión de comercios afiliados
│   │   │   ├── branches/       # Gestión de sucursales
│   │   │   ├── coupons/        # Gestión de cupones y ofertas
│   │   │   ├── redemptions/    # Seguimiento de redenciones
│   │   │   ├── users/          # Administración de usuarios
│   │   │   └── profile/        # Perfil del usuario actual
│   │   ├── layout.tsx          # Layout raíz de la aplicación
│   │   ├── page.tsx            # Página principal (redirige según rol)
│   │   └── globals.css         # Estilos globales
│   ├── components/             # Componentes React reutilizables
│   │   ├── ui/                 # Componentes base de UI (shadcn/ui)
│   │   └── AppSideBar/         # Componentes de navegación lateral
│   ├── config/                 # Configuraciones del proyecto
│   │   ├── http-client.ts      # Cliente HTTP configurado (Axios)
│   │   ├── protocols/          # Interfaces y protocolos
│   │   └── routes/             # Definición de rutas de la aplicación
│   ├── data/                   # Capa de datos
│   │   ├── adapters/           # Adaptadores para transformar datos de API
│   │   ├── errors/             # Manejo de errores personalizado
│   │   └── interfaces/         # Interfaces TypeScript de dominio
│   ├── hooks/                  # Custom hooks de React
│   ├── lib/                    # Librerías y utilidades
│   │   ├── di/                 # Configuración de inyección de dependencias
│   │   └── utils.ts            # Funciones de utilidad generales
│   ├── modules/                # Módulos de negocio organizados por dominio
│   │   ├── auth/               # Lógica de autenticación
│   │   ├── ally/               # Lógica de aliados/comercios
│   │   ├── branches/           # Lógica de sucursales
│   │   ├── coupons/            # Lógica de cupones
│   │   ├── redemptions/        # Lógica de redenciones
│   │   ├── users/              # Lógica de usuarios
│   │   ├── memberships/        # Lógica de membresías
│   │   └── s3/                 # Integración con AWS S3
│   ├── types/                  # Definiciones de tipos TypeScript
│   ├── utilities/              # Funciones auxiliares
│   │   ├── enums/              # Enumeraciones
│   │   └── helpers/            # Funciones helper
│   ├── views/                  # Componentes de vista (páginas completas)
│   │   ├── Allies/             # Vistas de aliados
│   │   ├── Branches/           # Vistas de sucursales
│   │   ├── Coupons/            # Vistas de cupones
│   │   ├── Dashboard/          # Vista principal del dashboard
│   │   ├── Profile/            # Vistas de perfil
│   │   ├── Redemptions/        # Vistas de redenciones
│   │   └── Users/              # Vistas de usuarios
│   └── middleware.ts           # Middleware de Next.js (autenticación/autorización)
├── .env.local                  # Variables de entorno (no versionado)
├── next.config.mjs             # Configuración de Next.js
├── tailwind.config.ts          # Configuración de Tailwind CSS
├── tsconfig.json               # Configuración de TypeScript
├── package.json                # Dependencias y scripts
└── pnpm-lock.yaml              # Lock file de dependencias

```

### Propósito de las carpetas principales

- **app/**: Contiene la estructura de rutas de la aplicación usando el App Router de Next.js. Cada carpeta representa una ruta y puede contener layouts, páginas y componentes específicos
- **components/**: Componentes React reutilizables en toda la aplicación. La subcarpeta `ui/` contiene componentes base del sistema de diseño
- **config/**: Configuraciones centralizadas como el cliente HTTP, URLs de la API y rutas de la aplicación
- **data/**: Capa de acceso a datos con adaptadores para transformar respuestas de la API a modelos de dominio
- **hooks/**: Custom hooks de React para lógica reutilizable
- **lib/**: Librerías y utilidades compartidas, incluyendo configuración de inyección de dependencias
- **modules/**: Organización de la lógica de negocio por dominios. Cada módulo contiene servicios, interfaces y lógica específica
- **views/**: Componentes de vista que representan páginas completas o secciones grandes de la aplicación
- **middleware.ts**: Middleware de Next.js que intercepta peticiones para validar autenticación y autorización

## Notas importantes

### Consideraciones de seguridad

1. **Tokens de autenticación**: Los tokens JWT se almacenan en cookies HTTP-only para prevenir ataques XSS. No almacenar tokens en localStorage
2. **Variables de entorno**: Nunca versionar el archivo `.env.local` en el repositorio. Utilizar `.env.example` como plantilla
3. **API Keys públicas**: Las variables con prefijo `NEXT_PUBLIC_` son expuestas al cliente. No incluir secretos sensibles en estas variables
4. **CORS**: Asegurar que la API backend tenga configurado CORS correctamente para permitir peticiones desde el dominio del dashboard
5. **Cookies**: Las cookies de sesión tienen configurado `httpOnly: true` y `path: /` para máxima seguridad

### Configuraciones sensibles

Las siguientes configuraciones requieren atención especial:

1. **Dominios de imágenes**: En `next.config.mjs` están configurados los dominios permitidos para el componente `next/image`. Al agregar nuevos buckets de S3 o CDNs, actualizar la configuración de `remotePatterns`

2. **Middleware de autenticación**: El archivo `middleware.ts` controla el acceso a rutas. Modificar con cuidado las reglas de autorización basadas en roles

3. **Cliente HTTP**: Los interceptores de Axios en `http-client.ts` manejan errores globales. Personalizar según necesidades de la aplicación

4. **Roles de usuario**: La aplicación soporta diferentes roles (superadmin, admin, etc.). Asegurar que los permisos estén correctamente configurados en backend y frontend

### Recomendaciones para ambientes de staging/producción

1. **Variables de entorno por ambiente**:
   - Crear archivos `.env.staging` y `.env.production` con las URLs correctas de cada ambiente
   - Configurar el pipeline de CI/CD para usar las variables correctas según el ambiente

2. **Compilación optimizada**:
   - Ejecutar `pnpm build` genera una versión optimizada de la aplicación
   - Verificar que no haya errores de TypeScript antes de desplegar
   - Habilitar análisis de bundle para optimizar el tamaño de la aplicación

3. **Monitoreo y logs**:
   - Implementar herramientas de monitoreo de errores (ej: Sentry)
   - Configurar logs estructurados para facilitar debugging en producción
   - Monitorear métricas de rendimiento y Web Vitals

4. **Caché y CDN**:
   - Configurar headers de caché apropiados para assets estáticos
   - Utilizar CDN para servir la aplicación en producción
   - Configurar políticas de caché de Next.js según necesidades

5. **SEO y metadatos**:
   - Configurar metadatos apropiados en cada página usando metadata API de Next.js
   - Implementar sitemap.xml y robots.txt si es necesario

6. **Acceso y permisos**:
   - Limitar acceso a variables de entorno solo a personal autorizado
   - Implementar políticas de IAM en AWS S3 para restringir acceso a buckets
   - Rotar periódicamente las API keys de servicios externos

7. **Respaldos**:
   - Asegurar que el código esté versionado en un repositorio privado
   - Mantener respaldos de la configuración de infraestructura
   - Documentar procesos de rollback en caso de problemas

8. **Actualizaciones**:
   - Revisar y actualizar dependencias regularmente para parches de seguridad
   - Probar actualizaciones en ambiente de staging antes de producción
   - Mantener documentación actualizada con cada cambio significativo

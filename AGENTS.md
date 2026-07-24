# CLAUDE.md — Global Hotel Panamá · Rediseño del sitio web

> Contexto permanente del proyecto. Léelo completo antes de tocar código.
> Si algo no está definido aquí, **pregunta antes de asumir** (ver §10).

---

## 1. Qué estamos construyendo

Rediseño y reconstrucción del sitio de **Global Hotel Panamá** — hotel boutique de lujo en la
Twist Tower, distrito Obarrio, Ciudad de Panamá.

El sitio actual es una landing de una sola página, solo en inglés, sin analítica, que manda
toda reserva a un motor externo. Objetivos del rediseño, en orden de prioridad:

1. **Aumentar la reserva directa** — el CTA de reservar debe ser el elemento más visible de
   cada pantalla, y el huésped debe poder elegir fechas *antes* de salir del sitio.
2. **Español + inglés** — hoy solo inglés, en un mercado mayoritariamente hispanohablante.
3. **Contenido por habitación** — existe una sección de habitaciones redactada
   (`rooms.txt`) que **nunca se publicó**. Hay que publicarla y darle URL propia a cada tipo.
4. **Rendimiento y SEO** — competimos contra Marriott, Hilton, RIU y Sortis. No ganamos en
   presupuesto; ganamos en velocidad, claridad y contenido local.

**No** construimos un motor de reservas. Disponibilidad y cobro los sigue manejando el
proveedor externo (§4).

---

## 2. Materiales de referencia

| Archivo | Qué es | Cómo usarlo |
|---|---|---|
| `referencia/sitio-actual/` | HTML+CSS reales del sitio en producción | **Fuente de verdad** de marca, tokens, enlaces, favicon, textos y assets |
| `referencia/sitio-actual/rooms.txt` | Sección de habitaciones redactada, sin publicar | Fuente de los datos de habitaciones (§3) |
| `referencia/preview-ghp.html` | Mockup aprobado del rediseño | **Fuente de verdad de la dirección visual y de layout** |
| `referencia/stitch-preview.html` | Mockup alterno (Stitch), paleta clara | Solo para funciones puntuales que Juan confirme. **No** usar su paleta |
| `referencia/comparativa-hoteles-panama.html` | Análisis competitivo vs 5 hoteles de la ciudad | Justifica las mejoras priorizadas |

Los dos previews implementan el **mismo conjunto de funciones** (barra sticky, menú móvil,
burbuja de chat, toggle de idioma, contadores animados, revelados al scroll). La diferencia
real es estética. Ver §10, pregunta 12.

---

## 3. Datos reales del hotel — no inventar nada

| Campo | Valor |
|---|---|
| Nombre | Global Hotel Panama |
| Operador | Twist Hotels Corp · Global Companies Group |
| Dirección | Calle 54 Este & Av. Samuel Lewis, Obarrio, Ciudad de Panamá |
| Teléfono | `+507 280 6400` → `tel:+5072806400` |
| Habitaciones | 60 habitaciones y suites |
| Año de apertura | 2011 |
| Check-in | 3:00 PM |
| Cancelación | Gratis hasta 48 h antes. Sin depósito; solo tarjeta como garantía |
| Aeropuerto | Tocumen (PTY), ~22 km / ~20 min |
| Coordenadas | 8.984860, -79.521279 |
| Google Place ID | `0x8faca8fb5412501b:0xfcd06db566124035` |

**Espacios:** piscina exterior y jacuzzi (piso 12) · gimnasio y sala de masajes (piso 12) ·
restaurante y wine bar (planta baja) · 4 salas de juntas + espacio de eventos (piso 12).

**Amenidades (8, tal cual el sitio actual):** Rooftop Pool · Fitness Center · Fine Dining ·
Business Center · Secure Parking · Free Wi-Fi · Airport Transfer · 24-hr Concierge.

**Cercanías:** 10 min a Casco Viejo · 20 min a Tocumen · 2 km a Cinta Costera/Balboa ·
4.4 km a Parque Metropolitano · caminando a supermercados y restaurantes · cerca de la
estación de Metro Vía Argentina · junto a Soho Mall.

**Reseñas (números reales del sitio):** 8.6 general · 3.4k reseñas · 9.0 staff · 9.2 limpieza.

### Habitaciones (de `rooms.txt`)

| Categoría | Nombre | Desde | Características |
|---|---|---|---|
| Standard | Double Queen Room | $98/noche | City View · 2 camas queen · Wi-Fi gratis |
| Deluxe | King Bed Room | $120/noche | Skyline View · cama king · balcón |
| Premium | Ultra-Luxury Suite | $173/noche | Bay View · suite completa · iPod dock |

**En todas:** TV HD por cable · minibar y cafetera · caja fuerte electrónica y tocador ·
Wi-Fi de alta velocidad · baño privado con secadora y amenidades · servicio a la habitación
y operadora 24 h.

> ⚠️ **Inconsistencia real a resolver:** el hero del sitio dice `$110+ Per Night`, la sección
> de reserva dice "desde $98" y `rooms.txt` dice `$98`. Hay que unificar. Ver §10, pregunta 5.
> ⚠️ El "iPod dock" delata que el texto tiene años. Revisar con operaciones antes de publicar.

---

## 4. Integraciones y enlaces reales

```
Motor de reservas (Book Now, abre en pestaña nueva):
  https://secuream3.e-gdscloud.com/globalhotelpanama/light/

Dominio del proveedor, con páginas por tipo de habitación:
  http://www.globalpanamahotel.com/en-US/room-type/135382   → Global Executive Superior King
  http://www.globalpanamahotel.com/en-US/room-type/135378   → Global City View · King Bed

Mapa: iframe de Google Maps embed con el place ID de arriba
Enlace a mapas: https://maps.google.com/?q=Global+Hotel+Panama
```

**Estado actual de terceros:** el sitio **no tiene analítica, ni GTM, ni chat, ni banner de
cookies**. Los únicos externos son Google Fonts y el iframe del mapa. Partimos de cero limpio.

**Reglas:**

- Todo CTA de reserva apunta al motor `e-gdscloud`, con `target="_blank"` y
  `rel="noopener noreferrer"`.
- **Nunca** simules una reserva ni pidas datos de tarjeta en nuestro sitio.
- La barra de fechas debe construir un **deep link** al motor con fechas y huéspedes.
  Aún no está confirmado si el motor acepta parámetros de query. Aísla toda esa lógica en
  `src/components/booking/buildBookingUrl.ts`, con la URL base como fallback, para que
  cambiar el formato sea una edición de una línea y un test.
- Asksuite (chat) se integra como snippet de terceros, diferido, cuando llegue.
- Reseñas: estáticas con los números reales. Si el bloque dice "actualizado hoy", tiene que
  serlo de verdad. No simules dinamismo.

---

## 5. Stack

**Astro 5 + TypeScript + CSS nativo con custom properties.**

Por qué Astro y no Next/React:

- El sitio es casi todo contenido estático. Astro envía **cero JavaScript por defecto** e
  hidrata solo las islas que lo necesitan: barra de fechas, galería, menú móvil, chat.
- **i18n integrado** con rutas `/es/` y `/en/` — que es exactamente la mejora #2.
- `astro:assets` optimiza imágenes en build (AVIF/WebP, `srcset`, dimensiones). Crítico:
  el banco de fotos original pesa entre 2 y 8 MB por imagen.
- **Content Collections** definen habitaciones y ofertas en Markdown con esquema tipado, sin
  CMS al inicio, y permiten migrar a un CMS después sin reescribir plantillas.
- Los componentes `.astro` son HTML: el CSS y el markup existentes migran casi tal cual, sin
  reescribir a JSX.

**No usar Tailwind aquí.** El CSS del sitio y del preview ya está afinado a mano con
variables; convertirlo a utilidades es trabajo perdido y degrada el control tipográfico.
Usamos `src/styles/tokens.css` + estilos con scope por componente.

Dependencias mínimas. Antes de instalar cualquier librería, justifícala en una línea.

---

## 6. Dirección visual

Base: **`preview-ghp.html`**. Es la versión aprobada.

**Excepción importante:** el preview usa un dorado más brillante (`#c8a24b`) y un negro más
cálido (`#1a1612`) que los reales de marca. **Manda la marca real.** Usa los tokens de abajo,
sacados de `assets/css/styles.css` del sitio en producción.

### Tokens

```css
:root {
  /* Marca — tomados del sitio en producción */
  --gold:        #B8965A;
  --gold-light:  #D4AF7A;
  --cream:       #F9F5EE;
  --charcoal:    #1C1C1C;
  --mid:         #4A4A4A;
  --soft:        #8A8A8A;
  --white:       #FFFFFF;
  --divider:     rgba(184,150,90,0.25);

  /* Tipografía — idénticas al sitio y al preview */
  --font-display: 'Cormorant Garamond', Georgia, serif;
  --font-body:    'DM Sans', system-ui, sans-serif;

  /* Sistema */
  --radius:       0;      /* esquinas rectas siempre: lenguaje arquitectónico */
  --nav-h:        80px;
  --section-gap:  120px;  /* 80px en móvil */
  --container:    1200px;
}
```

Fuentes cargadas: `Cormorant Garamond` 300/400/600 + itálicas 300/400 · `DM Sans` 300/400/500.
Subset latino, `font-display: swap`, `preconnect` a `fonts.gstatic.com`.

### Reglas de diseño

- **Titulares:** Cormorant Garamond en peso ligero, con la palabra clave en itálica dorada.
  Es el gesto de marca existente (`Above the *Panama* Skyline`, `A *Boutique* Urban
  Sanctuary`). Consérvalo — es lo que hace reconocible al sitio.
- **Contraste del hero:** el titular va sobre foto. Aplica scrim o gradiente hasta cumplir
  WCAG AA (4.5:1 en cuerpo, 3:1 en display). Blanco puro sobre foto clara no basta.
- **Jerarquía del CTA:** "Reservar" en dorado sólido, generoso, sin competencia visual de
  enlaces secundarios en la misma zona.
- **Botones e inputs:** esquinas a 90°. Inputs con solo borde inferior; etiqueta arriba en
  mayúsculas con `letter-spacing: .15em`.
- **Movimiento:** revelados escalonados al scroll y contadores animados en las stats del
  hero. Todo debe desactivarse bajo `@media (prefers-reduced-motion: reduce)`.
- **Imágenes:** siempre vía `astro:assets`, `alt` descriptivo en el idioma de la página,
  `loading="lazy"` salvo el hero.

### Assets existentes

`favicon.ico` (32×32) · `logo.png` (793×256, RGBA) · `hello.jpeg` (1024×1365) ·
`lobby.jpg` (1920×1280) · `room.jpeg` (1024×1365).

Faltan: favicon SVG, `apple-touch-icon`, imágenes Open Graph, logo vectorial y **al menos una
foto por tipo de habitación** (las tarjetas de `rooms.txt` usan dibujos SVG de relleno, no
fotos). Ver §10.

---

## 7. Arquitectura de carpetas

```
ghp-web/
├── CLAUDE.md
├── astro.config.mjs
├── referencia/                    # material de origen, solo lectura, fuera del build
│   ├── sitio-actual/
│   ├── preview-ghp.html
│   ├── stitch-preview.html
│   └── comparativa-hoteles-panama.html
├── src/
│   ├── content/
│   │   ├── config.ts              # esquemas Zod de las colecciones
│   │   ├── rooms/{es,en}/         # standard-double-queen.md, deluxe-king.md, suite.md
│   │   └── offers/{es,en}/        # larga-estancia.md, fin-de-semana.md, corporativo.md
│   ├── i18n/
│   │   ├── ui.ts                  # diccionario de strings de interfaz
│   │   └── utils.ts               # getLang(), t(), rutas alternas para hreflang
│   ├── components/
│   │   ├── layout/                # Nav, Footer, LangToggle, MobileMenu
│   │   ├── booking/               # BookingBar, StickyBookingBar, buildBookingUrl.ts
│   │   ├── sections/              # Hero, Stats, About, Amenities, Rooms, Offers,
│   │   │                          # Location, Reviews, ReserveCta
│   │   └── ui/                    # Button, Card, Icon, Gallery, Reveal
│   ├── layouts/
│   │   └── Base.astro             # <head>, SEO, hreflang, JSON-LD, favicon
│   ├── pages/
│   │   ├── index.astro            # redirección según idioma del navegador
│   │   ├── es/
│   │   │   ├── index.astro
│   │   │   ├── habitaciones/index.astro
│   │   │   ├── habitaciones/[slug].astro
│   │   │   ├── ofertas.astro
│   │   │   ├── ubicacion.astro
│   │   │   └── contacto.astro
│   │   └── en/                    # espejo: rooms/, offers, location, contact
│   ├── styles/
│   │   ├── tokens.css
│   │   └── global.css
│   └── assets/images/             # originales; Astro los optimiza en build
└── public/
    ├── favicon.ico · favicon.svg · apple-touch-icon.png · site.webmanifest
    ├── robots.txt
    └── og/
```

**Multipágina, no one-page.** Cada tipo de habitación necesita URL indexable propia — es la
brecha más grande frente a la competencia.

---

## 8. Requisitos no negociables

**Accesibilidad**
- Navegable al 100% con teclado; foco visible en todo control interactivo.
- Un solo `<h1>` por página; jerarquía de encabezados sin saltos.
- `lang` correcto en `<html>` y en cualquier fragmento que cambie de idioma.
- Contraste AA verificado, no estimado.

**Rendimiento** — objetivo Lighthouse ≥ 95 en móvil
- LCP < 2.5 s en 4G simulado; el hero se precarga.
- Cero JS en páginas que no lo necesiten.
- Ninguna imagen servida por encima de 200 KB.

**SEO**
- `hreflang` recíproco entre `/es/` y `/en/`, más `x-default`.
- JSON-LD `Hotel` con dirección, teléfono, geo, `priceRange` y `aggregateRating` usando los
  números reales de §3.
- `canonical` por página. Sitemap y `robots.txt` generados.

**Contenido**
- Español e inglés siempre en paridad. Si un texto no está traducido, la página no se
  publica — no se rellena con inglés.
- Cero datos inventados sobre el hotel. Si falta un dato, se pregunta.

---

## 9. Fases

| Fase | Alcance | Criterio de cierre |
|---|---|---|
| 0 | Andamiaje: Astro, tokens, layout base, i18n, favicon, head SEO | `npm run build` limpio; `/es/` y `/en/` responden |
| 1 | Home completa en ambos idiomas, secciones estáticas | Paridad visual con `preview-ghp.html`, tokens de marca reales |
| 2 | Barra de fechas + `buildBookingUrl()` + CTAs al motor | El deep link abre el motor con las fechas correctas |
| 3 | Colección de habitaciones + `/habitaciones/[slug]` + galería | Una página por tipo, con foto y tarifa desde |
| 4 | Ofertas, ubicación, contacto, formularios | Los formularios entregan a un destino real |
| 5 | Optimización de imágenes, Lighthouse, auditoría a11y, JSON-LD | Métricas objetivo cumplidas y medidas |
| 6 | Asksuite, analítica, despliegue, DNS | Sitio en producción |

Una fase a la vez. Al cerrar cada una: build limpio, capturas desktop + móvil, y un resumen
corto de lo que quedó pendiente.

---

## 10. PREGUNTA ANTES DE ASUMIR

Estas decisiones **no están tomadas**. No las resuelvas por tu cuenta. Pregúntaselas a Juan
agrupadas al inicio de la sesión y espera respuesta. Si una respuesta no llega, deja un
`TODO(juan):` explícito en el código y sigue con lo demás.

**Bloqueantes**

1. ¿Dónde está hospedado hoy `globalhotelpanama.com` y quién controla el DNS? ¿Es un sitio
   propio o entregado por el proveedor (NH/Destines)? ¿Lo reemplazamos o conviven?
2. Motor `e-gdscloud`: ¿acepta parámetros de URL para fechas, huéspedes y código promocional?
   ¿Existe widget o iframe embebible, o solo redirección? ¿Hay contacto técnico del proveedor?
3. Hay **dos dominios vivos**: `globalhotelpanama.com` (marketing) y `globalpanamahotel.com`
   (proveedor, con las páginas de tipo de habitación). ¿Se consolidan? ¿Cuál es el canónico?
   Si no se consolidan, hay contenido duplicado compitiendo en Google.

**Contenido**

4. Los nombres de habitación no coinciden entre fuentes: `rooms.txt` dice *Double Queen /
   King Bed / Ultra-Luxury Suite*, y el motor dice *Global Executive Superior King / Global
   City View*. ¿Cuáles son los oficiales de marca? ¿Hay más de tres tipos?
5. La tarifa mínima aparece como `$98` y como `$110+`. ¿Cuál va? ¿Se actualiza por temporada?
6. `rooms.txt` menciona "iPod dock" — ¿sigue vigente? ¿Quién valida el inventario de amenidades?
7. ¿Quién escribe y aprueba el español? ¿Hay textos oficiales o los redactamos para revisión?
8. Fotos: hay ~25 imágenes de 2–8 MB en el material. ¿Están licenciadas? ¿Hay al menos una
   foto real por tipo de habitación, o hace falta sesión fotográfica?
9. ¿Existe manual de marca y logo vectorial (SVG/AI)? Hoy solo hay PNG de 793×256.
10. ¿Existen política de privacidad, términos y política de cookies, o hay que redactarlas?

**Técnicas**

11. Asksuite: ¿ya está contratado y tienes el snippet? ¿Se instala en ambos idiomas?
12. Del preview de Stitch, **¿qué elementos concretos quieres conservar?** Ambos previews
    tienen las mismas funciones; lo que cambia es la estética. Si te gusta algo puntual
    (íconos Material, el nav claro, el ritmo de 120 px, el estilo de tarjetas), dilo
    explícitamente.
13. Reseñas de Google: ¿hay acceso al Business Profile o a la API, o van estáticas?
14. Formularios de eventos/grupos/contacto: ¿a qué correo entregan? ¿Se puede usar un
    servicio externo (Formspree, Resend) o debe quedarse dentro de la infraestructura del hotel?
15. Analítica: ¿GA4, GTM, o nada? ¿Requisito de consentimiento de cookies?
16. Despliegue: ¿Cloudflare Pages / Netlify / Vercel, o servidor propio del hotel?

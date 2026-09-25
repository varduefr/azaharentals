# Reglas y Pautas del Proyecto: Azahar Rentals

## Rol y Persona
Actúa como **Ingeniero de Software Senior** y **Especialista en SEO Técnico** enfocado en el sector de **Real Estate y Turismo / Alquiler Vacacional (Hospitality)**.

---

## Directrices de Ingeniería de Software

1. **Arquitectura y Calidad de Código:**
   - Código modular, limpio y estrictamente tipado con **TypeScript**.
   - Separación estricta de componentes, utilidades y datos.
   - Cero advertencias o errores en `npm run lint` y `npm run build`.
   - Manejo defensivo de fallos: fallbacks de imágenes (`onError`), sanitización y validación estricta en formularios.

2. **Rendimiento y Core Web Vitals:**
   - **LCP (Largest Contentful Paint):** Optimización del recurso Hero (`loading="eager"`, `fetchpriority="high"` si aplica, preconexiones de fuentes).
   - **CLS (Cumulative Layout Shift):** Dimensiones y aspect ratios definidos para evitar saltos en la carga de recursos multimedia o elementos dinámicos.
   - **INP (Interaction to Next Paint):** Handlers de eventos directos, estados optimistas y transiciones fluidas.
   - Carga diferida (`loading="lazy"`, `decoding="async"`) para todas las imágenes y recursos fuera del viewport inicial.

3. **Accesibilidad (a11y - WCAG AA):**
   - Atributos `aria-label`, `aria-expanded`, `role="tablist"` / `role="tab"` en elementos interactivos complejos.
   - Contrastes de color certificados sobre fondos claros y oscuros.
   - Navegabilidad completa por teclado y enfoque visual identificable.

---

## Directrices de SEO Técnico (Real Estate & Turismo)

1. **Jerarquía Semántica HTML5:**
   - **Un único `<h1>` por página** orientado a la intención de búsqueda transaccional y local principal:  
     *Gestión de Alojamientos Turísticos y Alquiler Vacacional en Castellón*.
   - Uso riguroso de `<main>`, `<header>`, `<nav>`, `<article>`, `<section>` y `<footer>`.
   - Encabezados `<h2>` y `<h3>` estructurados sin saltos de nivel y con palabras clave semánticas del sector (rentabilidad vacacional, licencias turísticas GVA, limpieza hotelera, check-in 24/7, municipios clave de la Costa de Castellón).

2. **SEO Local y Palabras Clave de Alta Intención:**
   - Cobertura geolocalizada de municipios: Castellón de la Plana, Peñíscola, Benicàssim, Oropesa del Mar, Vinaròs, Benicarló, Alcossebre.
   - Términos clave: *Gestión de alojamientos turísticos en Castellón*, *Alquiler vacacional Costa de Azahar*, *Licencia turística Comunidad Valenciana (VT)*, *Rentabilidad alquiler turístico*.

3. **Datos Estructurados (JSON-LD Schema.org):**
   - Entidades principales: `RealEstateAgent`, `LocalBusiness`, `LodgingBusiness`, `Accommodation`, `OfferCatalog`, `FAQPage`.
   - Coordenadas geográficas, horarios de atención, teléfonos de contacto local y servicios ofrecidos.

4. **Metadatos y Rastreo:**
   - Meta `title` optimizado (< 60 caracteres) con keyword principal y marca.
   - Meta `description` persuasiva (< 155 caracteres) con llamada a la acción clara para propietarios o huéspedes.
   - Etiquetas Open Graph y Twitter Cards completas, canonical URL y etiquetas geo-etiquetadas (`geo.region: ES-CS`, `geo.placename: Castellón de la Plana`).

5. **Cumplimiento Normativo y Confianza en Real Estate:**
   - Visibilidad obligatoria de los números de registro turístico oficial (VT) en cada propiedad.
   - Referencia al marco legal vigente de la Generalitat Valenciana (Decreto ley 9/2024 de viviendas turísticas) para transmitir máxima autoridad y confianza a los propietarios.

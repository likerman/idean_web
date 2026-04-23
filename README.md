# IDEAN Web

Sitio institucional estático para el Instituto de Estudios Andinos Don Pablo Groeber (IDEAN), construido como una base pública liviana y mantenible.

## Estructura

- `index.html` y páginas HTML en la raíz: superficies públicas del sitio.
- `assets/js/site-config.js`: configuración global del sitio.
- `assets/js/site.js`: render compartido de header, footer y páginas basadas en datos.
- `assets/css/styles.css`: sistema visual compartido y layouts.
- `assets/data/*.json`: contenido editable.
- `assets/images/`: logos e imágenes reutilizadas del material existente.

## Cómo se renderiza

- El sitio usa HTML estático más un script ES module (`assets/js/site.js`).
- Header, footer y varios bloques internos se renderizan desde datos JSON.
- Cada página HTML define un `data-page` y placeholders (`data-*`) que el script completa.

## Mantenimiento de contenido

### Noticias

Editar `assets/data/news.json`.

Cada noticia admite:
- `slug`
- `date`
- `displayDate`
- `category`
- `title`
- `summary`
- `excerpt`
- `image`
- `imageAlt`
- `body`
- `sourceUrl`
- `sourceLabel`

### Publicaciones

Editar `assets/data/publications.json`.

Campos actuales:
- `year`
- `title`
- `authors`
- `venue`
- `summary`
- `href`
- `kind`

### Tesis

Editar `assets/data/theses.json`.

Campos actuales:
- `year`
- `title`
- `author`
- `summary`
- `href`
- `kind`

### Personas

Editar `assets/data/people.json`.

Estructura:
- `coverageNote`
- `groups[]`
  - `id`
  - `title`
  - `description`
  - `people[]`

Cada persona puede incluir:
- `id`
- `name`
- `role`
- `affiliation`
- `area`
- `summary`
- `email`
- `relatedResearchAreas`
- `relatedLabs`
- `sourceLabel`
- `sourceUrl`

### Áreas de investigación

Editar `assets/data/research-areas.json`.

Campos actuales:
- `id`
- `slug`
- `title`
- `focus`
- `summary`
- `description`
- `keywords`
- `relatedLabs`
- `relatedPeople`
- `relatedPublications`

### Laboratorios

Editar `assets/data/labs.json`.

Campos actuales:
- `id`
- `slug`
- `title`
- `category`
- `summary`
- `description`
- `capabilities`
- `methods`
- `relatedResearchAreas`
- `relatedPeople`
- `image`
- `imageAlt`
- `sourceLabel`
- `sourceUrl`

### Servicios

Editar `assets/data/services.json`.

Estructura:
- `overview`
- `coverageNote`
- `items[]`

Cada servicio puede incluir:
- `id`
- `scope`
- `title`
- `summary`
- `description`
- `relatedLabs`
- `relatedResearchAreas`
- `contactPath`
- `sourceLabel`
- `sourceUrl`

### Contacto e información institucional

Editar:
- `assets/js/site-config.js` para navegación, título, resumen general y metadata global.
- `assets/data/contact.json` para canales de contacto, ubicación y enlaces institucionales.
- `assets/data/institutional.json` para la página Institucional.

## Cobertura parcial actual

Las siguientes áreas siguen en normalización:
- directorio completo de miembros
- inventario institucional completo de laboratorios
- catálogo exhaustivo de servicios
- mapeo completo de URLs históricas
- proyectos institucionales y descargas científicas

## Compatibilidad de URLs

Ver `assets/data/legacy-url-map.json`.

Ese archivo documenta equivalencias entre el sitio histórico y la nueva arquitectura.

Estado actual:
- algunas equivalencias están implementadas sólo como destino nuevo
- los redirects reales de servidor todavía no están configurados en este proyecto

## Limitaciones conocidas

- No hay backend ni CMS.
- No hay filtros complejos ni buscador interno.
- Las páginas de noticias individuales usan query string (`noticia.html?slug=...`) por simplicidad.
- Parte del contenido fue consolidado a partir de fuentes públicas y todavía requiere validación institucional final.

## QA básico recomendado antes de publicar

1. Validar que todos los JSON sigan siendo válidos.
2. Revisar que las imágenes referenciadas existan.
3. Comprobar navegación y links externos.
4. Verificar en móvil y desktop.
5. Confirmar con IDEAN:
   - autoridades actuales
   - teléfonos/internos
   - cobertura de personas
   - inventario de laboratorios
   - catálogo de servicios

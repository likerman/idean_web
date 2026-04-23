# Notas de QA final

## Qué se verificó

- `node scripts/validate-data.mjs`
- `node --check assets/js/site.js`
- validación de JSON con `python3 -m json.tool`
- navegación principal y footer a nivel código
- seguridad básica de enlaces externos (`noopener noreferrer`)
- existencia de imágenes locales referenciadas
- capturas con Chrome headless en páginas clave

## Hallazgos corregidos en esta fase

1. Se corrigió una inconsistencia entre autoridades públicas y perfiles personales.
2. Se corrigió un bug de runtime en homepage por cambio de esquema en `services.json`.
3. Se endureció el manejo de errores de carga para que el sitio no quede silenciosamente vacío.
4. Se mejoró el cierre del menú móvil y su comportamiento con `Escape`, click en links y cambio de breakpoint.
5. Se reforzó el manejo de texto largo y overflow en títulos y bloques editoriales.
6. Se agregó favicon para evitar requests 404 innecesarios.

## Revisión visual

Se realizaron capturas con Chrome headless sobre:

- `index.html`
- `novedades.html`
- `servicios.html`
- `contacto.html`

### Resultado

- Desktop: jerarquía, cards y shell general se comportan de forma consistente.
- Narrow viewport headless: se redujeron riesgos de overflow y clipping, pero sigue siendo recomendable una revisión manual final en teléfono real o en emulación completa del navegador antes de publicar.

## Limitación explícita

La revisión visual de esta fase no sustituye una validación manual final en:

- Chrome desktop
- Safari/iOS
- Android Chrome
- al menos un viewport tablet

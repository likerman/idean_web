# Checklist de lanzamiento

## Validación institucional

- Confirmar autoridades vigentes
- Confirmar correo institucional público
- Confirmar teléfonos e internos
- Confirmar directorio de personas que puede mostrarse públicamente
- Confirmar inventario de laboratorios visible
- Confirmar catálogo de servicios publicable

## Validación técnica

- Ejecutar `node scripts/validate-data.mjs`
- Verificar que todos los JSON sigan siendo válidos
- Verificar que las imágenes referenciadas existan
- Probar navegación principal y footer
- Probar apertura/cierre del menú móvil
- Revisar enlaces externos y `mailto:` / `tel:`

## Validación visual mínima

- Revisar `index.html` en desktop y móvil
- Revisar `institucional.html`
- Revisar `novedades.html`
- Revisar `noticia.html?slug=...`
- Revisar `produccion-cientifica.html`
- Revisar `miembros.html`
- Revisar `investigacion.html`
- Revisar `laboratorios.html`
- Revisar `servicios.html`
- Revisar `contacto.html`

## Publicación

- Definir si habrá reemplazo total del sitio histórico o convivencia temporal
- Elegir estrategia de redirects según `docs/PUBLICATION_NOTES.md`
- Configurar redirects mínimos de secciones y noticias migradas
- Publicar en staging o entorno de prueba
- Hacer revisión final con IDEAN antes de producción

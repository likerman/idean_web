# Registro de validación institucional

## Objetivo

Dejar visibles los puntos que todavía requieren confirmación institucional antes de publicación final.

## Estado por dataset

| Dataset / archivo | Estado actual | Requiere validación institucional |
| --- | --- | --- |
| `assets/data/institutional.json` | Estructura estable y usable | Confirmar autoridades actuales y cualquier cambio en estructura de gobierno |
| `assets/data/contact.json` | Publicable con advertencia | Confirmar teléfono, internos FCEN y canal principal de contacto |
| `assets/data/news.json` | Publicable | Validar si las categorías editoriales elegidas son las definitivas |
| `assets/data/publications.json` | Base inicial correcta | Ampliar cobertura y verificar si debe mostrarse DOI o acceso directo al paper |
| `assets/data/theses.json` | Base inicial correcta | Confirmar si deben distinguirse tesis doctorales, de licenciatura y becas |
| `assets/data/scientific-links.json` | Publicable | Confirmar si falta sumar repositorios o perfiles oficiales |
| `assets/data/scientific-output.json` | Publicable como resumen de homepage | Revisar si los ítems seleccionados siguen siendo los más representativos |
| `assets/data/people.json` | Cobertura parcial explícita | Completar directorio oficial y validar cargos/roles públicos |
| `assets/data/research-areas.json` | Publicable | Confirmar nombres finales de áreas y relaciones con grupos/laboratorios |
| `assets/data/labs.json` | Cobertura parcial explícita | Confirmar inventario oficial de laboratorios, grupos y capacidades |
| `assets/data/services.json` | Catálogo inicial explícito | Confirmar qué capacidades deben publicarse como servicios institucionales |
| `assets/data/legacy-url-map.json` | Documentación inicial correcta | Completar mapeo de URLs históricas antes de redirects definitivos |

## Puntos críticos previos a publicación

1. Confirmar autoridades vigentes y consistencia entre `institutional.json`, `contact.json` y cualquier documento público de CONICET.
2. Confirmar si `idean@gl.fcen.uba.ar` es el correo público principal para consultas institucionales generales.
3. Confirmar si `+54 11 4576-3400 int. 200` y los internos `58336 / 58337` siguen vigentes.
4. Validar si el directorio de personas puede publicarse como parcial o si conviene esperar el listado oficial completo.
5. Validar si el catálogo actual de servicios debe publicarse tal como está o con una nota institucional más restrictiva.

## Validación técnica disponible

Ejecutar:

```bash
node scripts/validate-data.mjs
```

Ese script valida:

- JSON legible y consistente
- campos requeridos
- referencias cruzadas entre datasets
- existencia de imágenes locales referenciadas
- enlaces básicos obligatorios
- posibles inconsistencias de autoridades/cargos

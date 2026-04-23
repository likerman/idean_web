# Notas de publicación y redirects

## Stack actual

El proyecto se publica como sitio estático:

- páginas HTML en raíz
- estilos en `assets/css/styles.css`
- render compartido en `assets/js/site.js`
- contenido editable en `assets/data/*.json`

No hay backend ni router dinámico del lado del servidor.

## Compatibilidad actual

Hoy la compatibilidad histórica es documental, no automática:

- el nuevo sitio ya tiene destinos equivalentes para las secciones principales;
- el mapeo inicial vive en `assets/data/legacy-url-map.json`;
- los redirects reales todavía no están configurados.

## Estrategia recomendada de publicación

### Opción A: publicación estática simple

Publicar el nuevo sitio sin redirects históricos.

Ventajas:

- implementación inmediata
- menor riesgo técnico

Desventajas:

- enlaces antiguos indexados o compartidos seguirán apuntando al sitio histórico o a URLs inexistentes

### Opción B: publicación estática + redirects de servidor

Opción recomendada si el nuevo sitio reemplaza al histórico en el mismo dominio.

Agregar redirects `301` del lado del servidor para:

- secciones históricas generales
- categorías de WordPress ya reemplazadas
- noticias ya migradas individualmente

## Redirects mínimos recomendados

### Secciones

- `/category/noticias/` -> `/novedades.html`
- `/category/publicaciones/` -> `/produccion-cientifica.html`
- `/los-andes/` -> `/investigacion.html`

### Noticias ya migradas

- `/2025/03/07/el-lago-torre-en-riesgo-podria-un-deslizamiento-provocar-una-inundacion-catastrofica/` -> `/noticia.html?slug=lago-torre-riesgo-inundacion`
- `/2021/09/24/don-pablo-groeber-un-grande-de-la-geologia-andina/` -> `/noticia.html?slug=don-pablo-groeber-legado-geologia-andina`
- `/2021/04/23/evolucion-tectono-estratigrafica-de-la-cordillera-de-la-costa-y-la-depresion-central-de-chile-central-sur-36o30-42os/` -> `/noticia.html?slug=evolucion-tectonica-costa-chile-centro-sur`
- `/2016/05/13/amilcar-herrera-en-el-departamento-de-ciencias-geologicas-homenaje-al-geologo-y-pensador-latinoamericano/` -> `/noticia.html?slug=homenaje-amilcar-herrera`

## Ejemplo Apache / `.htaccess`

```apacheconf
RewriteEngine On

RewriteRule ^category/noticias/?$ /novedades.html [R=301,L]
RewriteRule ^category/publicaciones/?$ /produccion-cientifica.html [R=301,L]
RewriteRule ^los-andes/?$ /investigacion.html [R=301,L]

RewriteRule ^2025/03/07/el-lago-torre-en-riesgo-podria-un-deslizamiento-provocar-una-inundacion-catastrofica/?$ /noticia.html?slug=lago-torre-riesgo-inundacion [R=301,L]
RewriteRule ^2021/09/24/don-pablo-groeber-un-grande-de-la-geologia-andina/?$ /noticia.html?slug=don-pablo-groeber-legado-geologia-andina [R=301,L]
RewriteRule ^2021/04/23/evolucion-tectono-estratigrafica-de-la-cordillera-de-la-costa-y-la-depresion-central-de-chile-central-sur-36o30-42os/?$ /noticia.html?slug=evolucion-tectonica-costa-chile-centro-sur [R=301,L]
RewriteRule ^2016/05/13/amilcar-herrera-en-el-departamento-de-ciencias-geologicas-homenaje-al-geologo-y-pensador-latinoamericano/?$ /noticia.html?slug=homenaje-amilcar-herrera [R=301,L]
```

## Ejemplo Nginx

```nginx
location = /category/noticias/ { return 301 /novedades.html; }
location = /category/publicaciones/ { return 301 /produccion-cientifica.html; }
location = /los-andes/ { return 301 /investigacion.html; }

location = /2025/03/07/el-lago-torre-en-riesgo-podria-un-deslizamiento-provocar-una-inundacion-catastrofica/ {
  return 301 /noticia.html?slug=lago-torre-riesgo-inundacion;
}
location = /2021/09/24/don-pablo-groeber-un-grande-de-la-geologia-andina/ {
  return 301 /noticia.html?slug=don-pablo-groeber-legado-geologia-andina;
}
location = /2021/04/23/evolucion-tectono-estratigrafica-de-la-cordillera-de-la-costa-y-la-depresion-central-de-chile-central-sur-36o30-42os/ {
  return 301 /noticia.html?slug=evolucion-tectonica-costa-chile-centro-sur;
}
location = /2016/05/13/amilcar-herrera-en-el-departamento-de-ciencias-geologicas-homenaje-al-geologo-y-pensador-latinoamericano/ {
  return 301 /noticia.html?slug=homenaje-amilcar-herrera;
}
```

## Casos todavía no resueltos

1. No está completo el mapeo de todas las entradas históricas del sitio viejo.
2. Las noticias nuevas usan query string (`noticia.html?slug=...`), por lo que conviene conservar los redirects a nivel servidor y no intentar resolverlos sólo desde frontend.
3. Si el sitio nuevo convive temporalmente con el sitio histórico, conviene publicar primero bajo un subdirectorio o subdominio de prueba y activar redirects recién cuando IDEAN valide contenido y estructura.

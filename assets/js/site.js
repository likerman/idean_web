import { siteConfig } from "./site-config.js";

const page = document.body.dataset.page ?? "home";
const isHome = page === "home";

async function fetchJson(path) {
  const response = await fetch(path);
  if (!response.ok) throw new Error(`No se pudo cargar ${path}`);
  return response.json();
}

function activeNavigationHref() {
  if (page === "novedad") return "novedades.html";
  return pageFileName();
}

function renderHeader() {
  const links = siteConfig.navigation
    .map(
      (item) => `
        <li class="nav__item">
          <a class="nav__link ${activeNavigationHref() === item.href ? "is-active" : ""}" href="${item.href}">${item.label}</a>
        </li>
      `
    )
    .join("");

  return `
    <header class="site-header" data-header>
      <div class="topbar">
        <div class="container topbar__inner">
          <p class="topbar__eyebrow">${siteConfig.eyebrow}</p>
          <p class="topbar__affiliations">${siteConfig.affiliations.join(" · ")}</p>
        </div>
      </div>
      <div class="container header-shell">
        <div class="header-card">
          <a class="brand" href="index.html" aria-label="${siteConfig.fullName}">
            <img class="brand__mark" src="assets/images/institutional/logo-idean.png" alt="IDEAN" />
            <span class="brand__text">
              <span class="brand__name">${siteConfig.siteName}</span>
              <span class="brand__full">${siteConfig.fullName}</span>
            </span>
          </a>

          <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav">
            <span class="nav-toggle__line"></span>
            <span class="nav-toggle__line"></span>
            <span class="nav-toggle__line"></span>
            <span class="sr-only">Abrir navegación principal</span>
          </button>

          <nav class="site-nav" id="site-nav" aria-label="Navegación principal">
            <ul class="nav__list">
              ${links}
            </ul>
            <div class="site-nav__actions">
              <a class="button button--ghost" href="novedades.html">Ver novedades</a>
              <a class="button button--primary" href="contacto.html">Contacto</a>
            </div>
          </nav>
        </div>
      </div>
    </header>
  `;
}

function getNewsHref(item) {
  return `noticia.html?slug=${encodeURIComponent(item.slug)}`;
}

function renderFooter() {
  const principal = siteConfig.footerNavigation.principal
    .map((item) => `<li><a href="${item.href}">${item.label}</a></li>`)
    .join("");

  const institutional = siteConfig.footerNavigation.institutional
    .map(
      (item) =>
        `<li><a href="${item.href}" ${item.href.startsWith("http") ? 'target="_blank" rel="noopener noreferrer"' : ""}>${item.label}</a></li>`
    )
    .join("");

  return `
    <footer class="site-footer">
      <div class="container footer-grid">
        <section class="footer-panel footer-panel--brand">
          <img class="footer-logo" src="assets/images/institutional/logo-idean.png" alt="IDEAN" />
          <p class="footer-kicker">Instituto UBA-CONICET de geociencias</p>
          <p class="footer-summary">${siteConfig.summary}</p>
        </section>

        <nav class="footer-panel" aria-label="Navegación del sitio">
          <h2 class="footer-title">Secciones</h2>
          <ul class="footer-list">${principal}</ul>
        </nav>

        <nav class="footer-panel" aria-label="Enlaces institucionales">
          <h2 class="footer-title">Institucional</h2>
          <ul class="footer-list">${institutional}</ul>
        </nav>

        <section class="footer-panel" aria-label="Contacto institucional">
          <h2 class="footer-title">Contacto</h2>
          <ul class="footer-list footer-list--plain">
            <li><a href="mailto:${siteConfig.contact.email}">${siteConfig.contact.email}</a></li>
            <li>${siteConfig.contact.phone}</li>
            <li>${siteConfig.contact.address}</li>
            <li>${siteConfig.contact.city}</li>
          </ul>
        </section>
      </div>
    </footer>
  `;
}

function pageFileName() {
  const path = window.location.pathname.split("/").pop();
  return path && path.length > 0 ? path : "index.html";
}

function setCurrentYear() {
  document.querySelectorAll("[data-current-year]").forEach((node) => {
    node.textContent = String(new Date().getFullYear());
  });
}

function initNavigation() {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".site-nav");
  const header = document.querySelector("[data-header]");

  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const expanded = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!expanded));
    nav.classList.toggle("is-open", !expanded);
  });

  window.addEventListener("scroll", () => {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 20);
  });
}

function createSectionHeader({ eyebrow, title, description, linkLabel, linkHref }) {
  return `
    <div class="section-header">
      <div>
        <p class="section-header__eyebrow">${eyebrow}</p>
        <h2 class="section-header__title">${title}</h2>
        ${description ? `<p class="section-header__description">${description}</p>` : ""}
      </div>
      ${linkLabel && linkHref ? `<a class="button button--ghost button--small" href="${linkHref}">${linkLabel}</a>` : ""}
    </div>
  `;
}

function newsCard(item) {
  return `
    <article class="card card--news">
      <img class="card__media" src="${item.image}" alt="${item.imageAlt || item.title}" />
      <div class="card__body">
        <div class="meta-row">
          <span class="pill">${item.category}</span>
          <time datetime="${item.date}">${item.displayDate}</time>
        </div>
        <h3 class="card__title">${item.title}</h3>
        <p class="card__text">${item.summary}</p>
        <a class="card__link" href="${getNewsHref(item)}">Leer artículo</a>
      </div>
    </article>
  `;
}

function researchCard(item) {
  return `
    <article class="card card--research">
      <div class="card__body">
        <p class="pill">${item.focus}</p>
        <h3 class="card__title">${item.title}</h3>
        <p class="card__text">${item.summary}</p>
      </div>
    </article>
  `;
}

function peopleLinks(person) {
  const items = [];
  if (person.email) items.push(`<a class="card__link-inline" href="mailto:${person.email}">${person.email}</a>`);
  if (person.sourceUrl) {
    items.push(`<a class="card__link-inline" href="${person.sourceUrl}" target="_blank" rel="noopener noreferrer">${person.sourceLabel}</a>`);
  }
  return items.join("");
}

function relationChips(items) {
  if (!items || items.length === 0) return "";
  return `<div class="chip-row">${items.map((item) => `<span class="chip">${item}</span>`).join("")}</div>`;
}

function personCard(person) {
  return `
    <article class="person-card">
      <div class="person-card__header">
        <div class="person-card__avatar" aria-hidden="true">
          <img src="assets/images/institutional/seal-idean.png" alt="" />
        </div>
        <div>
          <h3 class="person-card__name">${person.name}</h3>
          <p class="person-card__role">${person.role}</p>
        </div>
      </div>
      <p class="person-card__affiliation">${person.affiliation}</p>
      <p class="person-card__area">${person.area}</p>
      <p class="card__text">${person.summary}</p>
      ${relationChips([...(person.relatedResearchAreasLabels ?? []), ...(person.relatedLabsLabels ?? [])])}
      <div class="person-card__links">${peopleLinks(person)}</div>
    </article>
  `;
}

function labCard(item) {
  return `
    <article class="card card--lab">
      <img class="card__media" src="${item.image}" alt="${item.imageAlt || item.title}" />
      <div class="card__body">
        <p class="pill">${item.category}</p>
        <h3 class="card__title">${item.title}</h3>
        <p class="card__text">${item.summary}</p>
      </div>
    </article>
  `;
}

function outputCard(item) {
  return `
    <article class="card card--compact">
      <div class="meta-row">
        <span class="pill">${item.type}</span>
        <span>${item.year}</span>
      </div>
      <h3 class="card__title">${item.title}</h3>
      <p class="card__text">${item.summary}</p>
      <a class="card__link" href="${item.href}" target="_blank" rel="noopener noreferrer">Consultar</a>
    </article>
  `;
}

function outputListItem(item, metaLabel) {
  return `
    <article class="list-item">
      <div class="list-item__meta">
        <span class="pill">${metaLabel || item.kind || item.type}</span>
        <span>${item.year}</span>
      </div>
      <h3 class="list-item__title">${item.title}</h3>
      <p class="list-item__secondary">${item.authors || item.author || item.venue || ""}</p>
      <p class="list-item__text">${item.summary}</p>
      <a class="card__link" href="${item.href}" target="_blank" rel="noopener noreferrer">Consultar registro</a>
    </article>
  `;
}

function resourceItem(item) {
  return `
    <article class="card card--compact">
      <h3 class="card__title">${item.title}</h3>
      <p class="card__text">${item.summary}</p>
      <a class="card__link" href="${item.href}" target="_blank" rel="noopener noreferrer">Abrir enlace</a>
    </article>
  `;
}

function infoCard(item) {
  return `
    <article class="info-card">
      <p class="info-card__label">${item.label}</p>
      <h3 class="info-card__value">${item.value}</h3>
      ${item.note ? `<p class="info-card__note">${item.note}</p>` : ""}
    </article>
  `;
}

function findById(items, id) {
  return items.find((item) => item.id === id);
}

function mapLabels(ids, items) {
  if (!ids) return [];
  return ids
    .map((id) => findById(items, id))
    .filter(Boolean)
    .map((item) => item.title || item.name);
}

function serviceCard(item) {
  return `
    <article class="card card--compact">
      <p class="pill">${item.scope}</p>
      <h3 class="card__title">${item.title}</h3>
      <p class="card__text">${item.summary}</p>
    </article>
  `;
}

function serviceDetailCard(item, labs, researchAreas) {
  const labLabels = mapLabels(item.relatedLabs, labs);
  const researchLabels = mapLabels(item.relatedResearchAreas, researchAreas);

  return `
    <article class="service-card">
      <div class="meta-row">
        <span class="pill">${item.scope}</span>
      </div>
      <h3 class="service-card__title">${item.title}</h3>
      <p class="service-card__summary">${item.description || item.summary}</p>
      ${relationChips([...(labLabels ?? []), ...(researchLabels ?? [])])}
      <div class="service-card__meta">
        ${labLabels.length > 0 ? `<p><strong>Laboratorios relacionados:</strong> ${labLabels.join(", ")}</p>` : ""}
        ${researchLabels.length > 0 ? `<p><strong>Áreas relacionadas:</strong> ${researchLabels.join(", ")}</p>` : ""}
      </div>
      <div class="service-card__actions">
        <a class="button button--ghost button--small" href="${item.contactPath}">Canal de contacto</a>
        <a class="card__link" href="${item.sourceUrl}" target="_blank" rel="noopener noreferrer">${item.sourceLabel}</a>
      </div>
    </article>
  `;
}

function contactPanel() {
  return `
    <section class="contact-panel">
      <div>
        <p class="section-header__eyebrow">Contacto</p>
        <h2 class="section-header__title">IDEAN en Ciudad Universitaria</h2>
        <p class="section-header__description">
          Canal institucional para consultas académicas, científicas y de articulación con otras instituciones.
        </p>
      </div>
      <dl class="contact-list">
        <div><dt>Correo</dt><dd><a href="mailto:${siteConfig.contact.email}">${siteConfig.contact.email}</a></dd></div>
        <div><dt>Teléfono</dt><dd>${siteConfig.contact.phone}</dd></div>
        <div><dt>Dirección</dt><dd>${siteConfig.contact.address}<br />${siteConfig.contact.city}</dd></div>
      </dl>
    </section>
  `;
}

function contactCard(item) {
  const tag = item.href ? "a" : "span";
  const attrs = item.href
    ? `${tag === "a" ? `href="${item.href}"` : ""} ${item.href.startsWith("http") ? 'target="_blank" rel="noopener noreferrer"' : ""}`
    : "";

  return `
    <article class="info-card">
      <p class="info-card__label">${item.label}</p>
      <${tag} class="contact-value" ${attrs}>${item.value}</${tag}>
    </article>
  `;
}

async function renderHome() {
  const [news, researchAreas, labs, output, services] = await Promise.all([
    fetchJson("assets/data/news.json"),
    fetchJson("assets/data/research-areas.json"),
    fetchJson("assets/data/labs.json"),
    fetchJson("assets/data/scientific-output.json"),
    fetchJson("assets/data/services.json")
  ]);

  const hero = document.querySelector("[data-home-hero]");
  const about = document.querySelector("[data-home-about]");
  const research = document.querySelector("[data-home-research]");
  const updates = document.querySelector("[data-home-news]");
  const capabilities = document.querySelector("[data-home-labs]");
  const production = document.querySelector("[data-home-output]");
  const servicesBlock = document.querySelector("[data-home-services]");
  const contact = document.querySelector("[data-home-contact]");

  if (hero) {
    hero.innerHTML = `
      <div class="hero__content">
        <p class="hero__eyebrow">Universidad de Buenos Aires · CONICET</p>
        <h1 class="hero__title">${siteConfig.fullName}</h1>
        <p class="hero__lead">
          Los objetivos del instituto están dirigidos a entender la formación de la Cordillera de los Andes, su relación con los desplazamientos de la placa Sudamericana y los procesos geológicos asociados.
        </p>
        <div class="hero__actions">
          <a class="button button--primary" href="institucional.html">Conocé el instituto</a>
          <a class="button button--ghost" href="novedades.html">Ver novedades</a>
        </div>
      </div>
      <aside class="hero__aside" aria-label="Imagen institucional del instituto">
        <figure class="hero__figure">
          <img src="assets/images/gallery/hero-andean-institute.jpg" alt="Paisaje andino asociado a las líneas de trabajo del instituto" />
        </figure>
        <div class="hero__facts">
          <article class="fact-card">
            <strong>Andes</strong>
            <span>Estudio de cadenas montañosas, cuencas, riesgos y evolución regional.</span>
          </article>
          <article class="fact-card">
            <strong>Geociencias</strong>
            <span>Investigación básica, formación avanzada y producción científica.</span>
          </article>
          <article class="fact-card">
            <strong>UBA-CONICET</strong>
            <span>Inserción académica e institucional en Ciudad Universitaria.</span>
          </article>
        </div>
      </aside>
    `;
  }

  if (about) {
    about.innerHTML = `
      <div class="split-panel">
        <div class="split-panel__content">
          ${createSectionHeader({
            eyebrow: "Institucional",
            title: "Una plataforma de investigación para comprender la evolución de los Andes",
            description:
              "De acuerdo con su perfil institucional, IDEAN orienta sus objetivos al estudio de la formación de la Cordillera de los Andes, su evolución paleogeográfica y su importancia para la comprensión de recursos naturales y riesgos geológicos."
          })}
          <p class="body-copy">
            La base académica del instituto articula grupos y laboratorios vinculados a tectónica, paleontología, sedimentología, geodinámica, vulcanismo, glaciología y otros campos de las Ciencias de la Tierra con fuerte anclaje regional.
          </p>
        </div>
        <figure class="split-panel__media">
          <img src="assets/images/gallery/institutional-profile.jpg" alt="Trabajo de campo e infraestructura científica vinculada al IDEAN" />
        </figure>
      </div>
    `;
  }

  if (research) {
    research.innerHTML = `
      ${createSectionHeader({
        eyebrow: "Investigación",
        title: "Áreas prioritarias del instituto",
        description:
          "Selección inicial basada en la estructura temática visible en el sitio actual y en publicaciones públicas asociadas al instituto.",
        linkLabel: "Ver investigación",
        linkHref: "investigacion.html"
      })}
      <div class="card-grid card-grid--research">
        ${researchAreas.map(researchCard).join("")}
      </div>
    `;
  }

  if (updates) {
    updates.innerHTML = `
      ${createSectionHeader({
        eyebrow: "Novedades",
        title: "Noticias recientes y difusión institucional",
        description:
          "Bloque preparado para conectarse a una carga editable de noticias en próximas fases.",
        linkLabel: "Ir al archivo",
        linkHref: "novedades.html"
      })}
      <div class="card-grid card-grid--news">
        ${news.slice(0, 4).map(newsCard).join("")}
      </div>
    `;
  }

  if (capabilities) {
    capabilities.innerHTML = `
      ${createSectionHeader({
        eyebrow: "Laboratorios y capacidades",
        title: "Plataformas y capacidades científicas",
        description:
          "Resumen inicial de laboratorios, grupos o capacidades institucionales presentes en el ecosistema actual de IDEAN.",
        linkLabel: "Ver laboratorios",
        linkHref: "laboratorios.html"
      })}
      <div class="card-grid card-grid--labs">
        ${labs.map(labCard).join("")}
      </div>
    `;
  }

  if (production) {
    production.innerHTML = `
      ${createSectionHeader({
        eyebrow: "Producción científica",
        title: "Publicaciones, tesis y contribuciones académicas",
        description:
          "Accesos de referencia a artículos y tesis asociados a IDEAN ya disponibles en sitios públicos e institucionales.",
        linkLabel: "Ver producción",
        linkHref: "produccion-cientifica.html"
      })}
      <div class="card-grid card-grid--compact">
        ${output.map(outputCard).join("")}
      </div>
    `;
  }

  if (servicesBlock) {
    servicesBlock.innerHTML = `
      ${createSectionHeader({
        eyebrow: "Servicios y vinculación",
        title: "Capacidades institucionales proyectadas a formación y cooperación",
        description:
          "Presentación inicial de capacidades del instituto basada en sus objetivos públicos y en el perfil de sus actividades científicas.",
        linkLabel: "Ver servicios",
        linkHref: "servicios.html"
      })}
      <div class="card-grid card-grid--compact">
        ${services.map(serviceCard).join("")}
      </div>
    `;
  }

  if (contact) {
    contact.innerHTML = contactPanel();
  }
}

async function renderMembersPage() {
  const [peopleData, researchAreas, labs] = await Promise.all([
    fetchJson("assets/data/people.json"),
    fetchJson("assets/data/research-areas.json"),
    fetchJson("assets/data/labs.json")
  ]);

  const target = document.querySelector("[data-members-page]");
  if (!target) return;

  const groupsHtml = peopleData.groups
    .map((group) => {
      const normalizedPeople = group.people.map((person) => ({
        ...person,
        relatedResearchAreasLabels: mapLabels(person.relatedResearchAreas, researchAreas),
        relatedLabsLabels: mapLabels(person.relatedLabs, labs)
      }));

      return `
        <section class="editorial-block">
          ${createSectionHeader({
            eyebrow: "Miembros",
            title: group.title,
            description: group.description
          })}
          <div class="person-grid">
            ${normalizedPeople.map(personCard).join("")}
          </div>
        </section>
      `;
    })
    .join("");

  target.innerHTML = `
    <section class="editorial-block">
      <article class="status-note">
        <h2 class="section-header__title">${peopleData.coverageNote.title}</h2>
        <p class="section-header__description">${peopleData.coverageNote.text}</p>
      </article>
    </section>
    ${groupsHtml}
  `;
}

function researchDetailBlock(area, labs, people) {
  const labsLabels = mapLabels(area.relatedLabs, labs);
  const peopleLabels = mapLabels(area.relatedPeople, people);

  return `
    <article class="research-detail">
      <div class="research-detail__intro">
        <p class="pill">${area.focus}</p>
        <h3 class="research-detail__title">${area.title}</h3>
        <p class="research-detail__summary">${area.description || area.summary}</p>
      </div>
      ${relationChips(area.keywords)}
      <div class="research-detail__meta">
        ${labsLabels.length > 0 ? `<p><strong>Laboratorios relacionados:</strong> ${labsLabels.join(", ")}</p>` : ""}
        ${peopleLabels.length > 0 ? `<p><strong>Perfiles asociados:</strong> ${peopleLabels.join(", ")}</p>` : ""}
        ${area.relatedPublications && area.relatedPublications.length > 0 ? `<p><strong>Producción vinculada:</strong> ${area.relatedPublications.join("; ")}</p>` : ""}
      </div>
    </article>
  `;
}

async function renderResearchPage() {
  const [researchAreas, labs, peopleData] = await Promise.all([
    fetchJson("assets/data/research-areas.json"),
    fetchJson("assets/data/labs.json"),
    fetchJson("assets/data/people.json")
  ]);

  const target = document.querySelector("[data-research-page]");
  if (!target) return;

  const people = peopleData.groups.flatMap((group) => group.people);

  target.innerHTML = `
    <section class="editorial-block">
      ${createSectionHeader({
        eyebrow: "Panorama",
        title: "Investigación organizada por líneas temáticas",
        description:
          "La sección consolida áreas científicas visibles en fuentes públicas del instituto y las vincula con laboratorios, perfiles y producción ya incorporada en el sitio."
      })}
      <div class="info-grid info-grid--three">
        <article class="info-card">
          <p class="info-card__label">Áreas</p>
          <h3 class="info-card__value">${researchAreas.length}</h3>
          <p class="info-card__note">Líneas principales normalizadas en esta fase.</p>
        </article>
        <article class="info-card">
          <p class="info-card__label">Laboratorios vinculados</p>
          <h3 class="info-card__value">${labs.length}</h3>
          <p class="info-card__note">Plataformas y grupos conectados a la agenda científica.</p>
        </article>
        <article class="info-card">
          <p class="info-card__label">Perfiles asociados</p>
          <h3 class="info-card__value">${people.length}</h3>
          <p class="info-card__note">Referencias personales públicas ya identificadas.</p>
        </article>
      </div>
    </section>

    <section class="editorial-block">
      ${createSectionHeader({
        eyebrow: "Líneas de investigación",
        title: "Áreas prioritarias y dominios de trabajo",
        description:
          "Cada bloque resume una línea temática, sus métodos o dominios, y sus relaciones iniciales con laboratorios y personas."
      })}
      <div class="card-grid card-grid--research">
        ${researchAreas.map(researchCard).join("")}
      </div>
    </section>

    <section class="editorial-block">
      ${createSectionHeader({
        eyebrow: "Detalle",
        title: "Desarrollo por línea",
        description: "Lectura más completa de las áreas ya normalizadas para el nuevo sitio."
      })}
      <div class="stack-grid">
        ${researchAreas.map((area) => researchDetailBlock(area, labs, people)).join("")}
      </div>
    </section>
  `;
}

function capabilityList(items) {
  if (!items || items.length === 0) return "";
  return `<ul class="capability-list">${items.map((item) => `<li>${item}</li>`).join("")}</ul>`;
}

function labDetailBlock(lab, researchAreas, people) {
  const researchLabels = mapLabels(lab.relatedResearchAreas, researchAreas);
  const peopleLabels = mapLabels(lab.relatedPeople, people);

  return `
    <article class="lab-detail">
      <div class="lab-detail__media">
        <img src="${lab.image}" alt="${lab.imageAlt || lab.title}" />
      </div>
      <div class="lab-detail__body">
        <div class="meta-row">
          <span class="pill">${lab.category}</span>
        </div>
        <h3 class="lab-detail__title">${lab.title}</h3>
        <p class="lab-detail__summary">${lab.description || lab.summary}</p>
        <div class="two-column-layout two-column-layout--narrow">
          <div>
            <h4 class="subsection-title">Capacidades</h4>
            ${capabilityList(lab.capabilities)}
          </div>
          <div>
            <h4 class="subsection-title">Métodos y notas</h4>
            ${capabilityList(lab.methods)}
          </div>
        </div>
        <div class="lab-detail__meta">
          ${researchLabels.length > 0 ? `<p><strong>Áreas relacionadas:</strong> ${researchLabels.join(", ")}</p>` : ""}
          ${peopleLabels.length > 0 ? `<p><strong>Perfiles asociados:</strong> ${peopleLabels.join(", ")}</p>` : ""}
        </div>
        <a class="card__link" href="${lab.sourceUrl}" target="_blank" rel="noopener noreferrer">${lab.sourceLabel}</a>
      </div>
    </article>
  `;
}

async function renderLabsPage() {
  const [labs, researchAreas, peopleData] = await Promise.all([
    fetchJson("assets/data/labs.json"),
    fetchJson("assets/data/research-areas.json"),
    fetchJson("assets/data/people.json")
  ]);

  const target = document.querySelector("[data-labs-page]");
  if (!target) return;

  const people = peopleData.groups.flatMap((group) => group.people);

  target.innerHTML = `
    <section class="editorial-block">
      ${createSectionHeader({
        eyebrow: "Panorama",
        title: "Laboratorios, grupos y capacidades",
        description:
          "La sección separa laboratorios, grupos y capacidades metodológicas para evitar una lectura indiferenciada de servicios, áreas y equipos."
      })}
      <div class="card-grid card-grid--labs">
        ${labs.map(labCard).join("")}
      </div>
    </section>

    <section class="editorial-block">
      ${createSectionHeader({
        eyebrow: "Detalle",
        title: "Plataformas y grupos relevados",
        description:
          "La información se apoya en referencias públicas de IDEAN, Exactas UBA, Nex Ciencia y Biblioteca Digital."
      })}
      <div class="stack-grid">
        ${labs.map((lab) => labDetailBlock(lab, researchAreas, people)).join("")}
      </div>
    </section>
  `;
}

async function renderInstitutionalPage() {
  const data = await fetchJson("assets/data/institutional.json");
  const target = document.querySelector("[data-institutional-page]");
  if (!target) return;

  target.innerHTML = `
    <section class="editorial-block">
      <div class="split-panel">
        <div class="split-panel__content">
          ${createSectionHeader({
            eyebrow: data.overview.eyebrow,
            title: data.overview.title,
            description: data.overview.paragraphs[0]
          })}
          <div class="rich-text">
            ${data.overview.paragraphs.slice(1).map((paragraph) => `<p>${paragraph}</p>`).join("")}
          </div>
        </div>
        <div class="info-grid">
          ${data.overview.facts.map(infoCard).join("")}
        </div>
      </div>
    </section>

    <section class="editorial-block">
      ${createSectionHeader({
        eyebrow: "Historia e identidad",
        title: data.history.title,
        description: data.history.paragraphs[0]
      })}
      <div class="two-column-layout">
        <div class="rich-text">
          ${data.history.paragraphs.slice(1).map((paragraph) => `<p>${paragraph}</p>`).join("")}
        </div>
        <div class="stack-grid">
          ${data.history.highlights
            .map(
              (item) => `
                <article class="card card--compact">
                  <h3 class="card__title">${item.title}</h3>
                  <p class="card__text">${item.text}</p>
                </article>
              `
            )
            .join("")}
        </div>
      </div>
    </section>

    <section class="editorial-block">
      <div class="two-column-layout">
        <div>
          ${createSectionHeader({
            eyebrow: "Autoridades",
            title: data.authorities.title,
            description: "Información institucional pública incorporada en esta fase."
          })}
          <div class="stack-grid">
            ${data.authorities.cards.map(infoCard).join("")}
          </div>
        </div>
        <div>
          ${createSectionHeader({
            eyebrow: "Inserción",
            title: data.relationships.title,
            description: "Relación institucional del instituto con UBA, FCEN y CONICET."
          })}
          <div class="stack-grid">
            ${data.relationships.items
              .map(
                (item) => `
                  <article class="card card--compact">
                    <h3 class="card__title">${item.title}</h3>
                    <p class="card__text">${item.text}</p>
                  </article>
                `
              )
              .join("")}
          </div>
        </div>
      </div>
    </section>

    <section class="editorial-block">
      <article class="status-note">
        <h2 class="section-header__title">${data.governanceNote.title}</h2>
        <p class="section-header__description">${data.governanceNote.text}</p>
      </article>
    </section>

    <section class="editorial-block">
      ${createSectionHeader({
        eyebrow: "Documentos",
        title: data.documents.title,
        description: "Referencias públicas utilizadas para consolidar esta primera migración institucional."
      })}
      <div class="card-grid card-grid--compact">
        ${data.documents.items
          .map(
            (item) => `
              <article class="card card--compact">
                <h3 class="card__title">${item.label}</h3>
                <a class="card__link" href="${item.href}" target="_blank" rel="noopener noreferrer">Abrir documento</a>
              </article>
            `
          )
          .join("")}
      </div>
    </section>
  `;
}

async function renderNewsIndexPage() {
  const news = await fetchJson("assets/data/news.json");
  const target = document.querySelector("[data-news-index]");
  if (!target) return;

  const [featured, ...rest] = news;

  target.innerHTML = `
    <section class="editorial-block">
      ${createSectionHeader({
        eyebrow: "Novedades",
        title: "Archivo editorial y actualidad institucional",
        description:
          "La sección reorganiza noticias del sitio actual de IDEAN en un formato más legible, reusable y preparado para edición futura."
      })}
      <article class="featured-article">
        <img class="featured-article__media" src="${featured.image}" alt="${featured.imageAlt || featured.title}" />
        <div class="featured-article__body">
          <div class="meta-row">
            <span class="pill">${featured.category}</span>
            <time datetime="${featured.date}">${featured.displayDate}</time>
          </div>
          <h2 class="featured-article__title">${featured.title}</h2>
          <p class="featured-article__excerpt">${featured.excerpt}</p>
          <div class="featured-article__actions">
            <a class="button button--primary" href="${getNewsHref(featured)}">Leer artículo</a>
            <a class="button button--ghost" href="${featured.sourceUrl}" target="_blank" rel="noopener noreferrer">Fuente original</a>
          </div>
        </div>
      </article>
    </section>

    <section class="editorial-block">
      ${createSectionHeader({
        eyebrow: "Archivo",
        title: "Más noticias del instituto",
        description: "Listado inicial basado en contenidos ya publicados en el sitio histórico de IDEAN."
      })}
      <div class="card-grid card-grid--news">
        ${rest.map(newsCard).join("")}
      </div>
    </section>
  `;
}

function getQueryParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

async function renderNewsArticle() {
  const slug = getQueryParam("slug");
  const target = document.querySelector("[data-news-article]");
  if (!target) return;

  const news = await fetchJson("assets/data/news.json");
  const article = news.find((item) => item.slug === slug) ?? news[0];
  const related = news.filter((item) => item.slug !== article.slug).slice(0, 2);

  document.title = `${article.title} | IDEAN`;

  target.innerHTML = `
    <article class="article-layout">
      <nav class="breadcrumb" aria-label="Breadcrumb">
        <a href="index.html">Inicio</a>
        <span>/</span>
        <a href="novedades.html">Novedades</a>
      </nav>

      <header class="article-header">
        <div class="meta-row meta-row--article">
          <span class="pill">${article.category}</span>
          <time datetime="${article.date}">${article.displayDate}</time>
        </div>
        <h1 class="article-title">${article.title}</h1>
        <p class="article-excerpt">${article.excerpt}</p>
      </header>

      <figure class="article-figure">
        <img src="${article.image}" alt="${article.imageAlt || article.title}" />
      </figure>

      <div class="article-prose">
        ${article.body.map((paragraph) => `<p>${paragraph}</p>`).join("")}
      </div>

      <footer class="article-footer">
        <a class="button button--ghost" href="novedades.html">Volver a novedades</a>
        <a class="button button--primary" href="${article.sourceUrl}" target="_blank" rel="noopener noreferrer">${article.sourceLabel}</a>
      </footer>
    </article>

    <aside class="related-block">
      ${createSectionHeader({
        eyebrow: "Relacionadas",
        title: "Otras noticias",
        description: "Selección breve de notas ya migradas al nuevo formato editorial."
      })}
      <div class="card-grid card-grid--compact">
        ${related.map(newsCard).join("")}
      </div>
    </aside>
  `;
}

async function renderScientificOutputPage() {
  const [publications, theses, links] = await Promise.all([
    fetchJson("assets/data/publications.json"),
    fetchJson("assets/data/theses.json"),
    fetchJson("assets/data/scientific-links.json")
  ]);

  const target = document.querySelector("[data-output-page]");
  if (!target) return;

  target.innerHTML = `
    <section class="editorial-block">
      ${createSectionHeader({
        eyebrow: "Panorama",
        title: "Producción científica y accesos académicos",
        description:
          "La sección organiza publicaciones, tesis y referencias externas disponibles en fuentes públicas vinculadas a IDEAN."
      })}
      <div class="info-grid info-grid--three">
        <article class="info-card">
          <p class="info-card__label">Publicaciones</p>
          <h3 class="info-card__value">${publications.length}</h3>
          <p class="info-card__note">Registros iniciales incorporados en esta fase.</p>
        </article>
        <article class="info-card">
          <p class="info-card__label">Tesis</p>
          <h3 class="info-card__value">${theses.length}</h3>
          <p class="info-card__note">Tesis de grado identificadas en fuentes públicas.</p>
        </article>
        <article class="info-card">
          <p class="info-card__label">Recursos externos</p>
          <h3 class="info-card__value">${links.length}</h3>
          <p class="info-card__note">Repositorios y referencias institucionales para consulta.</p>
        </article>
      </div>
    </section>

    <section class="editorial-block">
      ${createSectionHeader({
        eyebrow: "Publicaciones",
        title: "Artículos y contribuciones académicas",
        description: "Registros destacados utilizados como base para una colección más amplia en fases siguientes."
      })}
      <div class="list-stack">
        ${publications.map((item) => outputListItem(item, item.kind)).join("")}
      </div>
    </section>

    <section class="editorial-block">
      ${createSectionHeader({
        eyebrow: "Tesis",
        title: "Tesis y formación avanzada",
        description: "Selección inicial de tesis localizadas en la Biblioteca Digital de Exactas UBA."
      })}
      <div class="list-stack">
        ${theses.map((item) => outputListItem(item, item.kind)).join("")}
      </div>
    </section>

    <section class="editorial-block">
      ${createSectionHeader({
        eyebrow: "Recursos",
        title: "Repositorios, perfiles y archivo institucional",
        description: "Puentes de consulta hacia fuentes externas ya activas."
      })}
      <div class="card-grid card-grid--compact">
        ${links.map(resourceItem).join("")}
      </div>
    </section>

    <section class="editorial-block">
      <article class="status-note">
        <h2 class="section-header__title">Proyectos institucionales</h2>
        <p class="section-header__description">
          La normalización de proyectos, descargas y otros documentos científicos específicos queda marcada para la próxima fase, cuando se consolide un relevamiento completo del contenido actual.
        </p>
      </article>
    </section>
  `;
}

async function renderServicesPage() {
  const [servicesData, labs, researchAreas] = await Promise.all([
    fetchJson("assets/data/services.json"),
    fetchJson("assets/data/labs.json"),
    fetchJson("assets/data/research-areas.json")
  ]);

  const target = document.querySelector("[data-services-page]");
  if (!target) return;

  target.innerHTML = `
    <section class="editorial-block">
      ${createSectionHeader({
        eyebrow: "Servicios",
        title: servicesData.overview.title,
        description: servicesData.overview.description
      })}
      <article class="status-note">
        <h2 class="section-header__title">${servicesData.coverageNote.title}</h2>
        <p class="section-header__description">${servicesData.coverageNote.text}</p>
      </article>
    </section>

    <section class="editorial-block">
      ${createSectionHeader({
        eyebrow: "Capacidades",
        title: "Catálogo inicial de servicios y apoyo institucional",
        description:
          "Presentación de capacidades públicas ya identificadas y vinculadas con laboratorios, formación y cooperación científica."
      })}
      <div class="stack-grid">
        ${servicesData.items.map((item) => serviceDetailCard(item, labs, researchAreas)).join("")}
      </div>
    </section>
  `;
}

async function renderContactPage() {
  const contactData = await fetchJson("assets/data/contact.json");
  const target = document.querySelector("[data-contact-page]");
  if (!target) return;

  target.innerHTML = `
    <section class="editorial-block">
      ${createSectionHeader({
        eyebrow: "Contacto",
        title: contactData.intro.title,
        description: contactData.intro.description
      })}
      <div class="info-grid info-grid--three">
        ${contactData.cards.map(contactCard).join("")}
      </div>
    </section>

    <section class="editorial-block">
      <div class="two-column-layout">
        <article class="contact-panel">
          <h2 class="section-header__title">${contactData.location.title}</h2>
          <p class="section-header__description">${contactData.location.address}</p>
          <p class="body-copy">${contactData.location.city}</p>
          <p><a class="card__link" href="${contactData.location.mapUrl}" target="_blank" rel="noopener noreferrer">${contactData.location.mapLabel}</a></p>
          <div class="rich-text">
            ${contactData.visitNotes.map((note) => `<p>${note}</p>`).join("")}
          </div>
        </article>

        <article class="contact-panel">
          <h2 class="section-header__title">Referencias institucionales</h2>
          <div class="stack-grid">
            ${contactData.authorities
              .map(
                (item) => `
                  <article class="info-card">
                    <p class="info-card__label">${item.label}</p>
                    <h3 class="info-card__value">${item.value}</h3>
                    <p class="info-card__note">${item.source}</p>
                  </article>
                `
              )
              .join("")}
          </div>
        </article>
      </div>
    </section>

    <section class="editorial-block">
      ${createSectionHeader({
        eyebrow: "Enlaces",
        title: "Canales y referencias útiles",
        description: "Accesos a perfiles institucionales y recursos públicos vinculados al instituto."
      })}
      <div class="card-grid card-grid--compact">
        ${contactData.institutionalLinks
          .map(
            (item) => `
              <article class="card card--compact">
                <h3 class="card__title">${item.label}</h3>
                <a class="card__link" href="${item.href}" target="_blank" rel="noopener noreferrer">Abrir enlace</a>
              </article>
            `
          )
          .join("")}
      </div>
    </section>
  `;
}

function renderPageHero() {
  const target = document.querySelector("[data-page-hero]");
  if (!target || isHome) return;

  const config = siteConfig.pages[page];
  if (!config) return;

  target.innerHTML = `
    <div class="page-hero__content">
      <p class="section-header__eyebrow">${config.kicker}</p>
      <h1 class="page-hero__title">${config.title}</h1>
      <p class="page-hero__lead">${config.lead}</p>
    </div>
  `;
}

async function initPages() {
  if (page === "home") {
    await renderHome();
    return;
  }

  renderPageHero();

  if (page === "institucional") {
    await renderInstitutionalPage();
  }

  if (page === "miembros") {
    await renderMembersPage();
  }

  if (page === "investigacion") {
    await renderResearchPage();
  }

  if (page === "laboratorios") {
    await renderLabsPage();
  }

  if (page === "novedades") {
    await renderNewsIndexPage();
  }

  if (page === "novedad") {
    await renderNewsArticle();
  }

  if (page === "produccion-cientifica") {
    await renderScientificOutputPage();
  }

  if (page === "servicios") {
    await renderServicesPage();
  }

  if (page === "contacto") {
    await renderContactPage();
  }
}

document.querySelector("[data-site-header]").innerHTML = renderHeader();
document.querySelector("[data-site-footer]").innerHTML = renderFooter();
setCurrentYear();
initNavigation();
initPages().catch((error) => {
  console.error(error);
});

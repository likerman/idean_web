import { access, readFile } from "node:fs/promises";
import path from "node:path";

const rootDir = process.cwd();
const dataDir = path.join(rootDir, "assets", "data");

const errors = [];
const warnings = [];

function pushError(message) {
  errors.push(message);
}

function pushWarning(message) {
  warnings.push(message);
}

function ensure(condition, message) {
  if (!condition) pushError(message);
}

function ensureWarning(condition, message) {
  if (!condition) pushWarning(message);
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function isValidUrl(value) {
  return isNonEmptyString(value) && /^(https?:\/\/|mailto:|tel:|\/)/.test(value);
}

function isValidPathOrUrl(value) {
  return isValidUrl(value) || isNonEmptyString(value);
}

function normalizeName(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\bdr?a?\.?\s+/gi, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

async function fileExists(relativePath) {
  try {
    await access(path.join(rootDir, relativePath));
    return true;
  } catch {
    return false;
  }
}

async function readJson(name) {
  const filePath = path.join(dataDir, name);
  const raw = await readFile(filePath, "utf8");
  return JSON.parse(raw);
}

function unique(values) {
  return [...new Set(values)];
}

function collectDuplicateIds(items, label) {
  const ids = items.map((item) => item.id).filter(Boolean);
  const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
  unique(duplicates).forEach((id) => pushError(`${label}: id duplicado "${id}"`));
}

function collectDuplicateSlugs(items, label) {
  const slugs = items.map((item) => item.slug).filter(Boolean);
  const duplicates = slugs.filter((slug, index) => slugs.indexOf(slug) !== index);
  unique(duplicates).forEach((slug) => pushError(`${label}: slug duplicado "${slug}"`));
}

function validateLinkField(value, label) {
  ensure(isValidUrl(value), `${label}: enlace faltante o inválido`);
}

async function main() {
  const [
    contact,
    institutional,
    labs,
    legacyMap,
    news,
    peopleData,
    publications,
    researchAreas,
    scientificLinks,
    scientificOutput,
    services,
    theses
  ] = await Promise.all([
    readJson("contact.json"),
    readJson("institutional.json"),
    readJson("labs.json"),
    readJson("legacy-url-map.json"),
    readJson("news.json"),
    readJson("people.json"),
    readJson("publications.json"),
    readJson("research-areas.json"),
    readJson("scientific-links.json"),
    readJson("scientific-output.json"),
    readJson("services.json"),
    readJson("theses.json")
  ]);

  ensure(Array.isArray(news) && news.length > 0, "news.json: debe contener al menos una noticia");
  if (Array.isArray(news)) {
    const slugs = news.map((item) => item.slug).filter(Boolean);
    unique(slugs.filter((slug, index) => slugs.indexOf(slug) !== index)).forEach((slug) =>
      pushError(`news.json: slug duplicado "${slug}"`)
    );

    for (const [index, item] of news.entries()) {
      const prefix = `news.json[${index}]`;
      ["slug", "date", "displayDate", "category", "title", "summary", "excerpt", "image", "sourceUrl", "sourceLabel"].forEach((field) =>
        ensure(isNonEmptyString(item[field]), `${prefix}: campo requerido faltante "${field}"`)
      );
      ensure(Array.isArray(item.body) && item.body.length > 0, `${prefix}: body debe ser un array con contenido`);
      validateLinkField(item.sourceUrl, `${prefix}.sourceUrl`);
      if (isNonEmptyString(item.image)) {
        ensure(await fileExists(item.image), `${prefix}: imagen no encontrada "${item.image}"`);
      }
    }
  }

  const people = Array.isArray(peopleData.groups) ? peopleData.groups.flatMap((group) => group.people || []) : [];
  ensure(isNonEmptyString(peopleData.coverageNote?.title), "people.json: coverageNote.title faltante");
  ensure(isNonEmptyString(peopleData.coverageNote?.text), "people.json: coverageNote.text faltante");
  ensure(Array.isArray(peopleData.groups) && peopleData.groups.length > 0, "people.json: groups debe contener al menos un grupo");
  collectDuplicateIds(people, "people.json");

  if (Array.isArray(peopleData.groups)) {
    for (const [groupIndex, group] of peopleData.groups.entries()) {
      const prefix = `people.json.groups[${groupIndex}]`;
      ["id", "title", "description"].forEach((field) =>
        ensure(isNonEmptyString(group[field]), `${prefix}: campo requerido faltante "${field}"`)
      );
      ensure(Array.isArray(group.people) && group.people.length > 0, `${prefix}: people debe contener al menos un perfil`);
      for (const [personIndex, person] of (group.people || []).entries()) {
        const personPrefix = `${prefix}.people[${personIndex}]`;
        ["id", "name", "role", "affiliation", "area", "summary", "sourceLabel", "sourceUrl"].forEach((field) =>
          ensure(isNonEmptyString(person[field]), `${personPrefix}: campo requerido faltante "${field}"`)
        );
        validateLinkField(person.sourceUrl, `${personPrefix}.sourceUrl`);
      }
    }
  }

  ensure(Array.isArray(researchAreas) && researchAreas.length > 0, "research-areas.json: debe contener áreas");
  collectDuplicateIds(researchAreas, "research-areas.json");
  collectDuplicateSlugs(researchAreas, "research-areas.json");

  const researchIds = new Set(researchAreas.map((item) => item.id));
  const personIds = new Set(people.map((item) => item.id));

  for (const [index, area] of researchAreas.entries()) {
    const prefix = `research-areas.json[${index}]`;
    ["id", "slug", "title", "focus", "summary", "description"].forEach((field) =>
      ensure(isNonEmptyString(area[field]), `${prefix}: campo requerido faltante "${field}"`)
    );
    ensure(Array.isArray(area.keywords), `${prefix}: keywords debe ser un array`);
  }

  ensure(Array.isArray(labs) && labs.length > 0, "labs.json: debe contener laboratorios o grupos");
  collectDuplicateIds(labs, "labs.json");
  collectDuplicateSlugs(labs, "labs.json");
  const labIds = new Set(labs.map((item) => item.id));

  for (const [index, lab] of labs.entries()) {
    const prefix = `labs.json[${index}]`;
    ["id", "slug", "title", "category", "summary", "description", "image", "sourceLabel", "sourceUrl"].forEach((field) =>
      ensure(isNonEmptyString(lab[field]), `${prefix}: campo requerido faltante "${field}"`)
    );
    ensure(Array.isArray(lab.capabilities), `${prefix}: capabilities debe ser un array`);
    ensure(Array.isArray(lab.methods), `${prefix}: methods debe ser un array`);
    validateLinkField(lab.sourceUrl, `${prefix}.sourceUrl`);
    ensure(await fileExists(lab.image), `${prefix}: imagen no encontrada "${lab.image}"`);
  }

  for (const [index, area] of researchAreas.entries()) {
    const prefix = `research-areas.json[${index}]`;
    (area.relatedLabs || []).forEach((id) => ensure(labIds.has(id), `${prefix}: relatedLabs refiere un id inexistente "${id}"`));
    (area.relatedPeople || []).forEach((id) =>
      ensure(personIds.has(id), `${prefix}: relatedPeople refiere un id inexistente "${id}"`)
    );
  }

  for (const [index, lab] of labs.entries()) {
    const prefix = `labs.json[${index}]`;
    (lab.relatedResearchAreas || []).forEach((id) =>
      ensure(researchIds.has(id), `${prefix}: relatedResearchAreas refiere un id inexistente "${id}"`)
    );
    (lab.relatedPeople || []).forEach((id) =>
      ensure(personIds.has(id), `${prefix}: relatedPeople refiere un id inexistente "${id}"`)
    );
  }

  ensure(Array.isArray(publications) && publications.length > 0, "publications.json: debe contener publicaciones");
  for (const [index, item] of publications.entries()) {
    const prefix = `publications.json[${index}]`;
    ["year", "title", "authors", "venue", "summary", "href", "kind"].forEach((field) =>
      ensure(isNonEmptyString(item[field]), `${prefix}: campo requerido faltante "${field}"`)
    );
    validateLinkField(item.href, `${prefix}.href`);
  }

  ensure(Array.isArray(theses) && theses.length > 0, "theses.json: debe contener tesis");
  for (const [index, item] of theses.entries()) {
    const prefix = `theses.json[${index}]`;
    ["year", "title", "author", "summary", "href", "kind"].forEach((field) =>
      ensure(isNonEmptyString(item[field]), `${prefix}: campo requerido faltante "${field}"`)
    );
    validateLinkField(item.href, `${prefix}.href`);
  }

  ensure(Array.isArray(scientificLinks) && scientificLinks.length > 0, "scientific-links.json: debe contener recursos");
  for (const [index, item] of scientificLinks.entries()) {
    const prefix = `scientific-links.json[${index}]`;
    ["title", "summary", "href"].forEach((field) =>
      ensure(isNonEmptyString(item[field]), `${prefix}: campo requerido faltante "${field}"`)
    );
    validateLinkField(item.href, `${prefix}.href`);
  }

  ensure(Array.isArray(scientificOutput) && scientificOutput.length > 0, "scientific-output.json: debe contener ítems");
  for (const [index, item] of scientificOutput.entries()) {
    const prefix = `scientific-output.json[${index}]`;
    ["type", "year", "title", "summary", "href"].forEach((field) =>
      ensure(isNonEmptyString(item[field]), `${prefix}: campo requerido faltante "${field}"`)
    );
    validateLinkField(item.href, `${prefix}.href`);
  }

  ensure(isNonEmptyString(services.overview?.title), "services.json: overview.title faltante");
  ensure(isNonEmptyString(services.overview?.description), "services.json: overview.description faltante");
  ensure(isNonEmptyString(services.coverageNote?.title), "services.json: coverageNote.title faltante");
  ensure(isNonEmptyString(services.coverageNote?.text), "services.json: coverageNote.text faltante");
  ensure(Array.isArray(services.items) && services.items.length > 0, "services.json: items debe contener al menos un servicio");
  collectDuplicateIds(services.items || [], "services.json");

  for (const [index, item] of (services.items || []).entries()) {
    const prefix = `services.json.items[${index}]`;
    ["id", "scope", "title", "summary", "description", "contactPath", "sourceLabel", "sourceUrl"].forEach((field) =>
      ensure(isNonEmptyString(item[field]), `${prefix}: campo requerido faltante "${field}"`)
    );
    ensure(isValidPathOrUrl(item.contactPath), `${prefix}.contactPath: ruta o enlace faltante`);
    validateLinkField(item.sourceUrl, `${prefix}.sourceUrl`);
    (item.relatedLabs || []).forEach((id) => ensure(labIds.has(id), `${prefix}: relatedLabs refiere un id inexistente "${id}"`));
    (item.relatedResearchAreas || []).forEach((id) =>
      ensure(researchIds.has(id), `${prefix}: relatedResearchAreas refiere un id inexistente "${id}"`)
    );
  }

  ensure(isNonEmptyString(contact.intro?.title), "contact.json: intro.title faltante");
  ensure(isNonEmptyString(contact.intro?.description), "contact.json: intro.description faltante");
  ensure(Array.isArray(contact.cards) && contact.cards.length >= 2, "contact.json: cards debe contener al menos dos canales");
  ensure(isNonEmptyString(contact.location?.title), "contact.json: location.title faltante");
  ensure(isNonEmptyString(contact.location?.address), "contact.json: location.address faltante");
  ensure(isNonEmptyString(contact.location?.city), "contact.json: location.city faltante");
  validateLinkField(contact.location?.mapUrl, "contact.json.location.mapUrl");
  ensure(Array.isArray(contact.authorities) && contact.authorities.length > 0, "contact.json: authorities debe contener referencias");
  ensure(Array.isArray(contact.institutionalLinks) && contact.institutionalLinks.length > 0, "contact.json: institutionalLinks debe contener enlaces");

  for (const [index, item] of contact.cards.entries()) {
    const prefix = `contact.json.cards[${index}]`;
    ["label", "value", "href"].forEach((field) => ensure(isNonEmptyString(item[field]), `${prefix}: campo requerido faltante "${field}"`));
    validateLinkField(item.href, `${prefix}.href`);
  }

  ensure(isNonEmptyString(institutional.overview?.eyebrow), "institutional.json: overview.eyebrow faltante");
  ensure(isNonEmptyString(institutional.overview?.title), "institutional.json: overview.title faltante");
  ensure(Array.isArray(institutional.overview?.paragraphs) && institutional.overview.paragraphs.length > 0, "institutional.json: overview.paragraphs faltante");
  ensure(Array.isArray(institutional.authorities?.cards) && institutional.authorities.cards.length > 0, "institutional.json: authorities.cards faltante");
  ensure(Array.isArray(institutional.documents?.items) && institutional.documents.items.length > 0, "institutional.json: documents.items faltante");
  institutional.documents.items.forEach((item, index) => validateLinkField(item.href, `institutional.json.documents.items[${index}].href`));

  ensure(Array.isArray(legacyMap) && legacyMap.length > 0, "legacy-url-map.json: debe contener equivalencias");
  const legacyKeys = legacyMap.map((item) => item.legacy);
  unique(legacyKeys.filter((value, index) => legacyKeys.indexOf(value) !== index)).forEach((legacy) =>
    pushError(`legacy-url-map.json: entrada legacy duplicada "${legacy}"`)
  );
  for (const [index, item] of legacyMap.entries()) {
    const prefix = `legacy-url-map.json[${index}]`;
    ["legacy", "new", "status", "notes"].forEach((field) =>
      ensure(isNonEmptyString(item[field]), `${prefix}: campo requerido faltante "${field}"`)
    );
  }

  const publicAuthorities = new Set((contact.authorities || []).map((item) => normalizeName(item.value)));
  const institutionalAuthorityNames = new Set((institutional.authorities?.cards || []).map((item) => normalizeName(item.value)));
  publicAuthorities.forEach((name) =>
    ensureWarning(institutionalAuthorityNames.has(name), `institutional.json: la autoridad "${name}" no figura en authorities.cards`)
  );

  for (const person of people) {
    if (/director(a)?\s+del\s+idean|director(a)?\s+actual/i.test(person.role) && !publicAuthorities.has(normalizeName(person.name))) {
      pushWarning(`people.json: "${person.name}" aparece con un rol de dirección no alineado con contact.json.authorities`);
    }
  }

  if (warnings.length > 0) {
    console.log("Warnings:");
    warnings.forEach((message) => console.log(`- ${message}`));
  }

  if (errors.length > 0) {
    console.error("Errors:");
    errors.forEach((message) => console.error(`- ${message}`));
    process.exit(1);
  }

  console.log(`Validated ${12} data files with ${warnings.length} warning(s) and no errors.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

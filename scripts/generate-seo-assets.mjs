import { mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { MOVIE_DETAILS, SERIES_DETAILS } from "../franchise-data.js";
import { SEASONS } from "../season-data.js";
import { SERIES_SEASON_DETAILS } from "../series-season-data.js";

var ROOT = resolve(import.meta.dirname, "..");
var PUBLIC_DIR = resolve(ROOT, "public");
var SITE_URL = "https://fdahnet.github.io/Star-Trek-T.O.S.-web";
var SITE_NAME = "Universo Star Trek";
var DEFAULT_IMAGE = "https://images.prismic.io/star-trek-untold/aL5fimGNHVfTOv8Y_ST60_16x9_Site.png?auto=format,compress";
var DEFAULT_IMAGE_ALT = "Universo Star Trek con series, temporadas y peliculas";
var TODAY = new Date().toISOString().slice(0, 10);

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function normalizeText(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function limitText(value, maxLength) {
  var text = normalizeText(value);

  if (text.length <= maxLength) {
    return text;
  }

  return text.slice(0, maxLength - 1).replace(/\s+\S*$/, "").trim() + "…";
}

function toAbsoluteUrl(pathname) {
  if (pathname === "index.html") {
    return SITE_URL + "/";
  }

  return SITE_URL + "/" + pathname;
}

function createCollectionSchema(name, description, pathname) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: name,
    description: description,
    url: toAbsoluteUrl(pathname),
    inLanguage: "es",
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_URL + "/"
    }
  };
}

function createSeriesSchema(series, description, seasonEntry) {
  return {
    "@context": "https://schema.org",
    "@type": "TVSeries",
    name: series.title,
    description: description,
    url: toAbsoluteUrl("serie-" + series.slug + ".html"),
    numberOfSeasons: seasonEntry ? seasonEntry.seasons.length : undefined,
    inLanguage: "es",
    genre: ["Ciencia ficción", "Aventura"],
    image: DEFAULT_IMAGE,
    isPartOf: {
      "@type": "CreativeWorkSeries",
      name: "Star Trek"
    }
  };
}

function createMovieSchema(movie, description) {
  return {
    "@context": "https://schema.org",
    "@type": "Movie",
    name: movie.title,
    description: description,
    url: toAbsoluteUrl("pelicula-" + movie.slug + ".html"),
    inLanguage: "es",
    image: DEFAULT_IMAGE,
    isPartOf: {
      "@type": "CreativeWorkSeries",
      name: "Star Trek"
    }
  };
}

function createSeasonSchema(config) {
  return {
    "@context": "https://schema.org",
    "@type": "TVSeason",
    name: config.name,
    description: config.description,
    url: toAbsoluteUrl(config.pathname),
    seasonNumber: config.seasonNumber,
    numberOfEpisodes: config.numberOfEpisodes,
    inLanguage: "es",
    partOfSeries: {
      "@type": "TVSeries",
      name: config.seriesTitle
    }
  };
}

function buildHead(meta) {
  var schemaMarkup = meta.schema
    ? '\n  <script type="application/ld+json">' + JSON.stringify(meta.schema) + "</script>"
    : "";

  return [
    "<head>",
    '  <meta charset="UTF-8">',
    '  <meta name="viewport" content="width=device-width, initial-scale=1.0">',
    "  <title>" + escapeHtml(meta.title) + "</title>",
    '  <meta name="description" content="' + escapeHtml(meta.description) + '">',
    '  <meta name="author" content="Genara Perez Toledo">',
    '  <meta name="robots" content="index,follow,max-image-preview:large">',
    '  <meta name="theme-color" content="#07111f">',
    '  <link rel="canonical" href="' + escapeHtml(meta.canonical) + '">',
    '  <meta property="og:site_name" content="' + escapeHtml(SITE_NAME) + '">',
    '  <meta property="og:locale" content="es_ES">',
    '  <meta property="og:type" content="' + escapeHtml(meta.ogType || "website") + '">',
    '  <meta property="og:title" content="' + escapeHtml(meta.title) + '">',
    '  <meta property="og:description" content="' + escapeHtml(meta.description) + '">',
    '  <meta property="og:url" content="' + escapeHtml(meta.canonical) + '">',
    '  <meta property="og:image" content="' + escapeHtml(DEFAULT_IMAGE) + '">',
    '  <meta property="og:image:alt" content="' + escapeHtml(DEFAULT_IMAGE_ALT) + '">',
    '  <meta name="twitter:card" content="summary_large_image">',
    '  <meta name="twitter:title" content="' + escapeHtml(meta.title) + '">',
    '  <meta name="twitter:description" content="' + escapeHtml(meta.description) + '">',
    '  <meta name="twitter:image" content="' + escapeHtml(DEFAULT_IMAGE) + '">',
    schemaMarkup,
    '  <link rel="stylesheet" href="styles.css">',
    "</head>"
  ].join("\n");
}

function updateHead(pathname, meta) {
  var filePath = resolve(ROOT, pathname);
  var html = readFileSync(filePath, "utf8");
  var headMarkup = buildHead({
    title: meta.title,
    description: meta.description,
    canonical: toAbsoluteUrl(pathname),
    ogType: meta.ogType,
    schema: meta.schema
  });

  html = html.replace(/<head>[\s\S]*?<\/head>/, headMarkup);
  writeFileSync(filePath, html, "utf8");
}

function writePublicFile(filename, contents) {
  mkdirSync(PUBLIC_DIR, { recursive: true });
  writeFileSync(resolve(PUBLIC_DIR, filename), contents, "utf8");
}

var homeDescription = limitText(
  "Guía en español del universo Star Trek con series, temporadas, episodios, cronología Trek, reparto, personajes y fichas completas de películas.",
  160
);

updateHead("index.html", {
  title: "Universo Star Trek | Series, temporadas, películas y cronología en español",
  description: homeDescription,
  ogType: "website",
  schema: createCollectionSchema("Universo Star Trek", homeDescription, "index.html")
});

Object.keys(SEASONS).forEach(function (key) {
  var season = SEASONS[key];
  var pathname = "temporada-" + season.number + ".html";
  var description = limitText(
    season.heroText + " Incluye " + season.episodesCount + " episodios, resumen, personajes y guía completa en español.",
    160
  );

  updateHead(pathname, {
    title: "Star Trek T.O.S. Temporada " + season.number + " | Episodios y guía en español",
    description: description,
    ogType: "article",
    schema: createSeasonSchema({
      name: "Star Trek: The Original Series - Temporada " + season.number,
      description: description,
      pathname: pathname,
      seasonNumber: season.number,
      numberOfEpisodes: season.episodesCount,
      seriesTitle: "Star Trek: The Original Series"
    })
  });
});

SERIES_DETAILS.forEach(function (series) {
  var seasonEntry = SERIES_SEASON_DETAILS.find(function (item) {
    return item.slug === series.slug;
  });
  var description = limitText(
    series.summary + (seasonEntry ? " Reúne " + seasonEntry.seasons.length + " temporadas con sus fichas y episodios." : ""),
    160
  );

  updateHead("serie-" + series.slug + ".html", {
    title: series.title + " | Guía, temporadas y cronología Star Trek",
    description: description,
    ogType: "article",
    schema: createSeriesSchema(series, description, seasonEntry)
  });
});

MOVIE_DETAILS.forEach(function (movie) {
  var description = limitText(
    movie.summary + " Ficha con sinopsis detallada, artistas y ubicación dentro de la cronología de Star Trek.",
    160
  );

  updateHead("pelicula-" + movie.slug + ".html", {
    title: movie.title + " | Ficha, sinopsis y cronología Star Trek",
    description: description,
    ogType: "article",
    schema: createMovieSchema(movie, description)
  });
});

SERIES_SEASON_DETAILS.forEach(function (seriesEntry) {
  seriesEntry.seasons.forEach(function (season) {
    var pathname;
    var description;

    if (seriesEntry.slug === "star-trek-the-original-series") {
      return;
    }

    pathname = "temporada-" + seriesEntry.slug + "-" + season.number + ".html";
    description = limitText(
      season.summary + " Incluye contexto, episodios, cronología y guía completa de " + seriesEntry.title + ".",
      160
    );

    updateHead(pathname, {
      title: season.fullTitle + " | Resumen, episodios y cronología",
      description: description,
      ogType: "article",
      schema: createSeasonSchema({
        name: season.fullTitle,
        description: description,
        pathname: pathname,
        seasonNumber: season.number,
        numberOfEpisodes: season.episodesCount,
        seriesTitle: seriesEntry.title
      })
    });
  });
});

var htmlFiles = readdirSync(ROOT).filter(function (file) {
  return file.endsWith(".html");
});

var sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
].concat(
  htmlFiles.map(function (file) {
    return [
      "  <url>",
      "    <loc>" + escapeHtml(toAbsoluteUrl(file)) + "</loc>",
      "    <lastmod>" + TODAY + "</lastmod>",
      "  </url>"
    ].join("\n");
  })
).concat(["</urlset>"]).join("\n");

writePublicFile("sitemap.xml", sitemap);
writePublicFile(
  "robots.txt",
  ["User-agent: *", "Allow: /", "", "Sitemap: " + SITE_URL + "/sitemap.xml"].join("\n")
);

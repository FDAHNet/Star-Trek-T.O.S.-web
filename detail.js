import { MOVIE_DETAILS, SERIES_DETAILS } from "./franchise-data.js";
import { findSeriesSeasonEntry } from "./series-season-data.js";

(function () {
  "use strict";

  var body = document.body;
  var detailType = body.getAttribute("data-detail-type");
  var detailSlug = body.getAttribute("data-detail-slug");
  var dataset = detailType === "movie" ? MOVIE_DETAILS : SERIES_DETAILS;
  var item = dataset.find(function (entry) {
    return entry.slug === detailSlug;
  });

  if (!item) {
    return;
  }

  document.title = item.title;

  var mapping = {
    "detail-badge": item.badge,
    "detail-title": item.title,
    "detail-title-copy": item.title,
    "detail-summary": item.detailedSynopsis || item.summary,
    "detail-release": item.releaseLabel,
    "detail-timeline": item.timelineLabel,
    "detail-continuity": item.continuity,
    "detail-meta-title": detailType === "movie" ? "Ficha de la pelicula" : "Ficha de la serie",
    "detail-section-title": detailType === "movie" ? "Resumen de la pelicula" : "Resumen de la serie",
    "detail-footer-title": detailType === "movie" ? "Volver al listado de peliculas" : "Volver al universo de series"
  };

  Object.keys(mapping).forEach(function (id) {
    var element = document.getElementById(id);
    if (element) {
      element.textContent = mapping[id];
    }
  });

  var cardsGrid = document.getElementById("detail-cards-grid");
  var fallbackCards = item.cards || [
    {
      title: detailType === "movie" ? "De que va" : "Panorama general",
      text: item.detailedSynopsis || item.summary
    },
    {
      title: detailType === "movie" ? "Ubicacion en Trek" : "Ubicacion en el canon",
      text: (detailType === "movie" ? "Esta pelicula" : "Esta serie") + " se ubica en " + item.timelineLabel + " dentro de " + item.continuity.toLowerCase() + "."
    },
    {
      title: detailType === "movie" ? "Por que verla" : "Por que importa",
      text: item.facts ? item.facts.join(" | ") + "." : "Forma parte del mapa general del universo Star Trek."
    }
  ];

  if (cardsGrid) {
    cardsGrid.innerHTML = fallbackCards.map(function (card) {
      return [
        '<article class="intro-card">',
        "  <h3>" + card.title + "</h3>",
        "  <p>" + card.text + "</p>",
        "</article>"
      ].join("");
    }).join("");
  }

  var factsList = document.getElementById("detail-facts-list");
  if (factsList) {
    factsList.innerHTML = (item.facts || []).map(function (fact) {
      return "<li>" + fact + "</li>";
    }).join("");
  }

  var statList = document.getElementById("detail-stat-list");
  var fallbackStats = item.stats || [
    { label: detailType === "movie" ? "Estreno" : "Emision", value: item.releaseLabel },
    { label: "Cronologia", value: item.timelineLabel },
    { label: "Continuidad", value: item.continuity }
  ];

  if (statList) {
    statList.innerHTML = fallbackStats.map(function (stat) {
      return "<li><span>" + stat.label + "</span><strong>" + stat.value + "</strong></li>";
    }).join("");
  }

  if (detailType === "movie") {
    var movieMain = document.querySelector("main");

    if (movieMain && item.detailedSynopsis) {
      var synopsisSection = document.createElement("section");
      synopsisSection.className = "section";
      synopsisSection.innerHTML = [
        '<div class="section-heading">',
        '  <p class="eyebrow">Sinopsis detallada</p>',
        '  <h2>La pelicula en profundidad</h2>',
        '  <p class="section-text">' + item.detailedSynopsis + '</p>',
        '</div>',
        '<div class="intro-grid intro-grid--home card-grid--triple">',
        '  <article class="intro-card">',
        '    <h3>Contexto</h3>',
        '    <p>' + item.summary + '</p>',
        '  </article>',
        '  <article class="intro-card">',
        '    <h3>Ubicacion en Trek</h3>',
        '    <p>Esta pelicula se sitúa en ' + item.timelineLabel + ' dentro de ' + item.continuity.toLowerCase() + '.</p>',
        '  </article>',
        '  <article class="intro-card">',
        '    <h3>Claves</h3>',
        '    <p>' + (item.facts || []).join(" | ") + '</p>',
        '  </article>',
        '</div>'
      ].join("");

      movieMain.insertBefore(synopsisSection, movieMain.lastElementChild);
    }
  }

  if (detailType === "series") {
    var seasonEntry = findSeriesSeasonEntry(detailSlug);
    var main = document.querySelector("main");

    if (seasonEntry && main) {
      var seasonSection = document.createElement("section");
      seasonSection.className = "section";
      seasonSection.innerHTML = [
        '<div class="section-heading">',
        '  <p class="eyebrow">Temporadas</p>',
        '  <h2>Explorar temporadas de ' + item.title + '</h2>',
        '  <p class="section-text">Cada temporada tiene ahora su propia subpagina con explicacion, enfoque y acceso rapido dentro de la serie.</p>',
        '</div>',
        '<div class="season-selector season-selector--detail">' +
          seasonEntry.seasons.map(function (season) {
            var suffix = season.episodesCount ? " | " + season.episodesCount + " episodios" : "";

            return '<a class="season-selector__link" href="' + season.url + '">Temporada ' + season.number + suffix + '</a>';
          }).join("") +
        '</div>'
      ].join("");

      main.insertBefore(seasonSection, main.lastElementChild);

      var seasonGridSection = document.createElement("section");
      seasonGridSection.className = "section";
      seasonGridSection.innerHTML = [
        '<div class="section-heading">',
        '  <p class="eyebrow">Mapa de temporadas</p>',
        '  <h2>Todas las temporadas explicadas</h2>',
        '  <p class="section-text">Cada bloque resume de que va esa etapa, que cambia dentro de la serie y por que es importante dentro del universo Star Trek.</p>',
        '</div>',
        '<div class="season-overview-grid">' +
          seasonEntry.seasons.map(function (season) {
            return [
              '<article class="season-overview-card">',
              '  <p class="season-overview-card__eyebrow">Temporada ' + season.number + '</p>',
              '  <h3>' + season.fullTitle + '</h3>',
              '  <p>' + season.summary + '</p>',
              '  <div class="season-overview-card__meta">',
              '    <span class="timeline__tag">' + (season.episodesCount ? season.episodesCount + ' episodios' : 'episodios pendientes') + '</span>',
              '    <span class="timeline__tag">' + (season.timelineWindow || seasonEntry.timelineLabel) + '</span>',
              '  </div>',
              '  <p class="season-overview-card__focus"><strong>Clave:</strong> ' + season.impact + '</p>',
              '  <a class="button button--primary" href="' + season.url + '">Abrir temporada ' + season.number + '</a>',
              '</article>'
            ].join("");
          }).join("") +
        '</div>'
      ].join("");

      main.insertBefore(seasonGridSection, main.lastElementChild);
    }
  }
}());

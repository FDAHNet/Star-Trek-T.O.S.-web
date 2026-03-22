import { MOVIE_DETAILS, SERIES_DETAILS } from "./franchise-data.js";

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
    "detail-summary": item.summary,
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
  if (cardsGrid) {
    cardsGrid.innerHTML = item.cards.map(function (card) {
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
    factsList.innerHTML = item.facts.map(function (fact) {
      return "<li>" + fact + "</li>";
    }).join("");
  }

  var statList = document.getElementById("detail-stat-list");
  if (statList) {
    statList.innerHTML = item.stats.map(function (stat) {
      return "<li><span>" + stat.label + "</span><strong>" + stat.value + "</strong></li>";
    }).join("");
  }
}());

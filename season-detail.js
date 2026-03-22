import { findSeriesSeasonEntry } from "./series-season-data.js";

(function () {
  "use strict";

  var body = document.body;
  var pageType = body.getAttribute("data-page");
  var seriesSlug = body.getAttribute("data-series-slug");
  var seasonNumber = Number(body.getAttribute("data-series-season"));

  if (pageType !== "series-season") {
    return;
  }

  var seriesEntry = findSeriesSeasonEntry(seriesSlug);
  var seasonEntry = seriesEntry && seriesEntry.seasons.find(function (item) {
    return item.number === seasonNumber;
  });

  if (!seriesEntry || !seasonEntry) {
    return;
  }

  document.title = seasonEntry.fullTitle;

  var mapping = {
    "season-detail-badge": seriesEntry.title,
    "season-detail-title": seasonEntry.fullTitle,
    "season-detail-summary": seasonEntry.summary,
    "season-detail-series-title": seriesEntry.title,
    "season-detail-meta-title": "Ficha de temporada",
    "season-detail-release": seasonEntry.releaseWindow || seriesEntry.releaseLabel,
    "season-detail-timeline": seasonEntry.timelineWindow || seriesEntry.timelineLabel,
    "season-detail-episodes": seasonEntry.episodesCount ? String(seasonEntry.episodesCount) : "Pendiente",
    "season-detail-overview-title": "Una mirada general a la temporada",
    "season-detail-footer-title": "Seguir explorando " + seriesEntry.title
  };

  Object.keys(mapping).forEach(function (id) {
    var element = document.getElementById(id);
    if (element) {
      element.textContent = mapping[id];
    }
  });

  var nav = document.getElementById("season-detail-nav");
  if (nav) {
    nav.innerHTML = seriesEntry.seasons.map(function (item) {
      var isActive = item.number === seasonEntry.number;
      var suffix = item.episodesCount ? " | " + item.episodesCount + " episodios" : "";

      return '<a class="season-selector__link' + (isActive ? ' is-active' : '') + '" href="' + item.url + '"' + (isActive ? ' aria-current="page"' : "") + '>Temporada ' + item.number + suffix + "</a>";
    }).join("");
  }

  var cardsGrid = document.getElementById("season-detail-cards-grid");
  if (cardsGrid) {
    cardsGrid.innerHTML = [
      {
        title: "De que va",
        text: seasonEntry.summary
      },
      {
        title: "Que cambia",
        text: seasonEntry.focus
      },
      {
        title: "Por que importa",
        text: seasonEntry.impact
      }
    ].map(function (card) {
      return [
        '<article class="intro-card">',
        "  <h3>" + card.title + "</h3>",
        "  <p>" + card.text + "</p>",
        "</article>"
      ].join("");
    }).join("");
  }

  var factsList = document.getElementById("season-detail-facts-list");
  if (factsList) {
    factsList.innerHTML = [
      "Serie: " + seriesEntry.title,
      "Temporada " + seasonEntry.number + (seasonEntry.releaseWindow ? " | emision: " + seasonEntry.releaseWindow : ""),
      "Cronologia Trek: " + (seasonEntry.timelineWindow || seriesEntry.timelineLabel),
      seasonEntry.episodesCount ? "Numero de episodios: " + seasonEntry.episodesCount : "Numero de episodios: pendiente"
    ].map(function (fact) {
      return "<li>" + fact + "</li>";
    }).join("");
  }
}());

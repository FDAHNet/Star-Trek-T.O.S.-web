import { findSeriesSeasonEntry } from "./series-season-data.js";
import { SERIES_EPISODE_DETAILS } from "./series-episode-data.js";

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
  var episodes = SERIES_EPISODE_DETAILS[seriesSlug] && SERIES_EPISODE_DETAILS[seriesSlug][seasonNumber - 1]
    ? SERIES_EPISODE_DETAILS[seriesSlug][seasonNumber - 1]
    : [];

  if (!seriesEntry || !seasonEntry) {
    return;
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function renderEpisodeCard(episode) {
    var metaParts = [];

    if (episode.date) {
      metaParts.push("Emision: " + escapeHtml(episode.date));
    }
    if (episode.productionCode) {
      metaParts.push("Codigo: " + escapeHtml(episode.productionCode));
    }
    if (episode.stardate) {
      metaParts.push("Fecha estelar: " + escapeHtml(episode.stardate));
    }

    return [
      '<article class="episode-card">',
      '  <div class="episode-card__content">',
      '    <div class="episode-card__top">',
      '      <div>',
      '        <span class="episode-card__number">Episodio ' + escapeHtml(episode.displayNumber) + "</span>",
      '        <h3 class="episode-card__title">' + escapeHtml(episode.title) + "</h3>",
      (episode.overallNumber && episode.overallNumber !== episode.displayNumber ? '        <p class="episode-card__meta">Numero global: ' + escapeHtml(episode.overallNumber) + "</p>" : ""),
      "      </div>",
      "    </div>",
      (metaParts.length ? "    <p>" + metaParts.join(" | ") + "</p>" : "    <p>Ficha de emision pendiente de completar.</p>"),
      "  </div>",
      "</article>"
    ].join("");
  }

  document.title = seasonEntry.fullTitle;

  var episodesCountLabel = episodes.length ? String(episodes.length) : (seasonEntry.episodesCount ? String(seasonEntry.episodesCount) : "Pendiente");
  var mapping = {
    "season-detail-badge": seriesEntry.title,
    "season-detail-title": seasonEntry.fullTitle,
    "season-detail-summary": seasonEntry.summary,
    "season-detail-series-title": seriesEntry.title,
    "season-detail-meta-title": "Ficha de temporada",
    "season-detail-release": seasonEntry.releaseWindow || seriesEntry.releaseLabel,
    "season-detail-timeline": seasonEntry.timelineWindow || seriesEntry.timelineLabel,
    "season-detail-episodes": episodesCountLabel,
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

      return '<a class="season-selector__link' + (isActive ? " is-active" : "") + '" href="' + item.url + '"' + (isActive ? ' aria-current="page"' : "") + ">Temporada " + item.number + suffix + "</a>";
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
      "Numero de episodios: " + episodesCountLabel
    ].map(function (fact) {
      return "<li>" + fact + "</li>";
    }).join("");
  }

  var main = document.querySelector("main");
  var previousSeason = seriesEntry.seasons.find(function (item) {
    return item.number === seasonEntry.number - 1;
  });
  var nextSeason = seriesEntry.seasons.find(function (item) {
    return item.number === seasonEntry.number + 1;
  });

  if (main) {
    if (episodes.length) {
      var episodesSection = document.createElement("section");
      episodesSection.className = "section";
      episodesSection.innerHTML = [
        '<div class="section-heading">',
        '  <p class="eyebrow">Capitulos</p>',
        '  <h2>Lista completa de episodios</h2>',
        '  <p class="section-text">Esta temporada incluye ' + episodes.length + ' capitulos dentro de esta guia del universo Star Trek.</p>',
        "</div>",
        '<div class="episode-grid">',
        episodes.map(renderEpisodeCard).join(""),
        "</div>"
      ].join("");

      main.insertBefore(episodesSection, main.lastElementChild);
    }

    var arcSection = document.createElement("section");
    arcSection.className = "section";
    arcSection.innerHTML = [
      '<div class="section-heading">',
      '  <p class="eyebrow">Dentro de la serie</p>',
      "  <h2>Como encaja esta temporada en " + seriesEntry.title + "</h2>",
      '  <p class="section-text">' + seasonEntry.focus + "</p>",
      "</div>",
      '<div class="intro-grid intro-grid--home card-grid--triple">',
      '  <article class="intro-card">',
      "    <h3>Estado de la serie</h3>",
      "    <p>" + seasonEntry.impact + "</p>",
      "  </article>",
      '  <article class="intro-card">',
      "    <h3>Temporada anterior</h3>",
      "    <p>" + (previousSeason ? previousSeason.fullTitle + " prepara el terreno para esta etapa dentro del recorrido de la serie." : "Aqui arranca el recorrido de la serie, asi que no hay una temporada previa dentro de esta web.") + "</p>",
      (previousSeason ? '    <a class="button button--ghost season-detail__inline-action" href="' + previousSeason.url + '">Abrir temporada ' + previousSeason.number + "</a>" : ""),
      "  </article>",
      '  <article class="intro-card">',
      "    <h3>Temporada siguiente</h3>",
      "    <p>" + (nextSeason ? "Despues de esta etapa, la serie continua en " + nextSeason.fullTitle + "." : "Esta es la ultima temporada actualmente listada dentro de esta serie en la web.") + "</p>",
      (nextSeason ? '    <a class="button button--ghost season-detail__inline-action" href="' + nextSeason.url + '">Abrir temporada ' + nextSeason.number + "</a>" : ""),
      "  </article>",
      "</div>"
    ].join("");

    main.insertBefore(arcSection, main.lastElementChild);
  }
}());

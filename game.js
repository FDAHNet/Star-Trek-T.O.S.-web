import { MOVIE_DETAILS, SERIES_DETAILS } from "./franchise-data.js";
import { getLanguage, t } from "./i18n/index.js";
import { setupLanguageSwitcher } from "./language-switcher.js";
import { findSeriesSeasonEntry } from "./series-season-data.js";
import { MOVIES, OTHER_SERIES, SEASONS } from "./season-data.js";

(function () {
  "use strict";

  var body = document.body;
  var pageType = body.getAttribute("data-page") || "season";
  var seasonId = Number(body.getAttribute("data-season") || 1);
  var season = SEASONS[seasonId] || SEASONS[1];

  var episodeGrid = document.getElementById("episode-grid");
  var episodeCount = document.getElementById("episode-count");
  var episodeSearch = document.getElementById("episode-search");
  var emptyState = document.getElementById("empty-state");
  var characterCards = Array.prototype.slice.call(document.querySelectorAll(".character-card"));
  var seasonLinks = Array.prototype.slice.call(document.querySelectorAll("[data-season-link]"));
  var castAgeList = document.getElementById("cast-age-list");
  var timelineGrid = document.getElementById("timeline-grid");

  var homeSeasonGrid = document.getElementById("season-overview-grid");
  var franchiseSeriesGrid = document.getElementById("franchise-series-grid");
  var seriesSortButtons = Array.prototype.slice.call(document.querySelectorAll("[data-series-sort]"));
  var homeStatSeriesCount = document.getElementById("home-stat-series-count");
  var homeStatMovieCount = document.getElementById("home-stat-movie-count");
  var homeStatTimeline = document.getElementById("home-stat-timeline");
  var homeSeriesSelect = document.getElementById("home-series-select");
  var homeSeriesDetail = document.getElementById("home-series-detail");
  var homeSeriesSummary = document.getElementById("home-series-summary");
  var homeSeriesLink = document.getElementById("home-series-link");
  var homeSeasonShortcuts = document.getElementById("home-season-shortcuts");
  var homeSeriesExtraLabel = document.getElementById("home-series-extra-label");
  var homeSeriesExtraText = document.getElementById("home-series-extra-text");
  var homeMoviesShortcut = document.getElementById("home-movies-shortcut");
  var openMoviesModalButton = document.getElementById("open-movies-modal");
  var closeMoviesModalButton = document.getElementById("close-movies-modal");
  var moviesModal = document.getElementById("movies-modal");
  var moviesGrid = document.getElementById("movies-grid");
  var movieSortButtons = Array.prototype.slice.call(document.querySelectorAll("[data-movie-sort]"));
  var starField = document.querySelector(".stars");

  setupLanguageSwitcher();
  document.documentElement.lang = getLanguage();

  function localizeTopbar() {
    var brand = document.querySelector(".brand");
    var topbarLinks = Array.prototype.slice.call(document.querySelectorAll(".topbar__link"));

    if (brand) {
      brand.textContent = t("topbar.universe");
    }

    if (pageType === "home") {
      if (topbarLinks[0]) {
        topbarLinks[0].textContent = t("topbar.website");
      }
      if (topbarLinks[1]) {
        topbarLinks[1].textContent = t("topbar.seasons");
      }
      if (topbarLinks[2]) {
        topbarLinks[2].textContent = t("topbar.otherSeries");
      }
      return;
    }

    if (pageType === "season") {
      if (topbarLinks[0]) {
        topbarLinks[0].textContent = t("topbar.home");
      }
      if (topbarLinks[1]) {
        topbarLinks[1].textContent = t("topbar.actors");
      }
      if (topbarLinks[2]) {
        topbarLinks[2].textContent = t("topbar.characters");
      }
      if (topbarLinks[3]) {
        topbarLinks[3].textContent = t("topbar.episodes");
      }
      return;
    }

    if (topbarLinks[0]) {
      topbarLinks[0].textContent = t("topbar.home");
    }
    if (topbarLinks[1]) {
      topbarLinks[1].textContent = t("topbar.series");
    }
    if (topbarLinks[2]) {
      topbarLinks[2].textContent = t("topbar.movies");
    }
  }

  localizeTopbar();

  function localizeHomeStatic() {
    var eyebrow = document.querySelector(".hero__copy .eyebrow");
    var heroTitle = document.querySelector(".hero__copy h1");
    var heroText = document.querySelector(".hero__text");
    var heroActions = Array.prototype.slice.call(document.querySelectorAll(".hero__actions .button"));

    if (eyebrow) {
      eyebrow.textContent = t("home.eyebrow");
    }
    if (heroTitle) {
      heroTitle.textContent = t("home.heroTitle");
    }
    if (heroText) {
      heroText.textContent = t("home.heroText");
    }
    if (heroActions[0]) {
      heroActions[0].textContent = t("home.exploreSeries");
    }
    if (heroActions[1]) {
      heroActions[1].textContent = t("home.exploreMovies");
    }
  }

  function localizeSeasonStatic() {
    var heroActions = Array.prototype.slice.call(document.querySelectorAll(".hero__actions .button"));
    var cardLabel = document.querySelector(".hero__card-label");
    var statLabels = Array.prototype.slice.call(document.querySelectorAll(".hero__card .stat-list li span"));
    var summaryEyebrow = document.querySelector("#resumen .eyebrow");
    var castTitle = document.querySelector("#actores h3");
    var crewEyebrow = document.querySelector("#personajes .section-heading .eyebrow");
    var crewTitle = document.querySelector("#personajes .section-heading h2");
    var crewText = document.querySelector("#personajes .section-heading .section-text");
    var episodeLinks = Array.prototype.slice.call(document.querySelectorAll("[data-season-link]"));
    var episodeEyebrow = document.querySelector("#episodios .section-heading .eyebrow");
    var searchLabel = document.querySelector(".search-field__label");
    var routeEyebrow = document.querySelector(".section--timeline .eyebrow");
    var triviaEyebrow = document.querySelector(".section--footer-note .eyebrow");

    if (heroActions[0]) {
      heroActions[0].textContent = t("seasonPage.seeSummary");
    }
    if (heroActions[1]) {
      heroActions[1].textContent = t("seasonPage.seeEpisodes");
    }
    if (cardLabel) {
      cardLabel.textContent = t("seasonPage.quickFacts");
    }
    if (statLabels[0]) {
      statLabels[0].textContent = t("seasonPage.statSeason");
    }
    if (statLabels[1]) {
      statLabels[1].textContent = t("seasonPage.statEpisodes");
    }
    if (statLabels[2]) {
      statLabels[2].textContent = t("seasonPage.statNetwork");
    }
    if (statLabels[3]) {
      statLabels[3].textContent = t("seasonPage.statYears");
    }
    if (summaryEyebrow) {
      summaryEyebrow.textContent = t("seasonPage.summary");
    }
    if (castTitle) {
      castTitle.textContent = t("seasonPage.castAges");
    }
    if (crewEyebrow) {
      crewEyebrow.textContent = t("seasonPage.crewEyebrow");
    }
    if (crewTitle) {
      crewTitle.textContent = t("seasonPage.crewTitle");
    }
    if (crewText) {
      crewText.textContent = t("seasonPage.crewText");
    }
    if (episodeLinks[0]) {
      episodeLinks[0].textContent = t("seasonPage.season1");
    }
    if (episodeLinks[1]) {
      episodeLinks[1].textContent = t("seasonPage.season2");
    }
    if (episodeLinks[2]) {
      episodeLinks[2].textContent = t("seasonPage.season3");
    }
    if (episodeEyebrow) {
      episodeEyebrow.textContent = t("seasonPage.episodeGuide");
    }
    if (searchLabel) {
      searchLabel.textContent = t("seasonPage.searchEpisode");
    }
    if (routeEyebrow) {
      routeEyebrow.textContent = t("seasonPage.route");
    }
    if (triviaEyebrow) {
      triviaEyebrow.textContent = t("seasonPage.trivia");
    }
    if (emptyState) {
      emptyState.textContent = t("seasonPage.noResults");
    }
  }

  var castMembers = [
    { actor: "William Shatner", birth: "1931-03-22", death: null, seasons: [1, 2, 3] },
    { actor: "Leonard Nimoy", birth: "1931-03-26", death: "2015-02-27", seasons: [1, 2, 3] },
    { actor: "DeForest Kelley", birth: "1920-01-20", death: "1999-06-11", seasons: [1, 2, 3] },
    { actor: "Nichelle Nichols", birth: "1932-12-28", death: "2022-07-30", seasons: [1, 2, 3] },
    { actor: "George Takei", birth: "1937-04-20", death: null, seasons: [1, 2, 3] },
    { actor: "James Doohan", birth: "1920-03-03", death: "2005-07-20", seasons: [1, 2, 3] },
    { actor: "Walter Koenig", birth: "1936-09-14", death: null, seasons: [2, 3] },
    { actor: "Grace Lee Whitney", birth: "1930-04-01", death: "2015-05-01", seasons: [1] },
    { actor: "Majel Barrett", birth: "1932-02-23", death: "2008-12-18", seasons: [1, 2, 3] }
  ];

  function normalize(value) {
    return String(value || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  function getSeriesDetailUrl(title) {
    var series = SERIES_DETAILS.find(function (entry) {
      return entry.title === title;
    });

    return series ? "./serie-" + series.slug + ".html" : "#";
  }

  function getUniverseSeries() {
    return SERIES_DETAILS.map(function (item) {
      var seasonEntry = findSeriesSeasonEntry(item.slug);

      return {
        slug: item.slug,
        title: item.title,
        seasonsCount: seasonEntry ? seasonEntry.seasons.length : 0,
        seasonBreakdown: seasonEntry ? seasonEntry.seasons.map(function (season) {
          return season.episodesCount;
        }).filter(Boolean).join(", ") + " episodios" : "",
        timelineLabel: item.timelineLabel,
        releaseLabel: item.releaseLabel
      };
    });
  }

  function getMovieDetailUrl(title) {
    var movie = MOVIE_DETAILS.find(function (entry) {
      return entry.title === title;
    });

    return movie ? "./pelicula-" + movie.slug + ".html" : "#";
  }

  function getSeriesOrderValues(title) {
    if (title === "Star Trek: The Original Series") {
      return { release: 1966, timeline: 2265 };
    }

    var source = OTHER_SERIES.find(function (entry) {
      return entry.title === title;
    });

    return source ? { release: source.releaseStart, timeline: source.timelineStart } : { release: 9999, timeline: 9999 };
  }

  function randomBetween(min, max) {
    return min + Math.random() * (max - min);
  }

  function setupStarfield() {
    if (!starField) {
      return;
    }

    var layers = [
      { count: 110, className: "stars__layer--far", minSize: 1, maxSize: 2.2 },
      { count: 80, className: "stars__layer--mid", minSize: 1.2, maxSize: 2.8 },
      { count: 45, className: "stars__layer--near", minSize: 1.6, maxSize: 3.6 }
    ];

    starField.innerHTML = "";

    layers.forEach(function (layerConfig, layerIndex) {
      var layer = document.createElement("div");
      layer.className = "stars__layer " + layerConfig.className;

      for (var i = 0; i < layerConfig.count; i += 1) {
        var star = document.createElement("span");
        var size = randomBetween(layerConfig.minSize, layerConfig.maxSize);
        var hue = i % 9 === 0 ? "var(--accent)" : i % 7 === 0 ? "rgba(255, 220, 170, 0.92)" : "rgba(255, 255, 255, 0.95)";

        star.className = "star";
        star.style.left = randomBetween(-5, 105).toFixed(2) + "%";
        star.style.top = randomBetween(-8, 108).toFixed(2) + "%";
        star.style.width = size.toFixed(2) + "px";
        star.style.height = size.toFixed(2) + "px";
        star.style.background = hue;
        star.style.opacity = randomBetween(0.35, 1).toFixed(2);
        star.style.setProperty("--twinkle-duration", randomBetween(2.8, 7.5).toFixed(2) + "s");
        star.style.setProperty("--twinkle-delay", randomBetween(0, 4.5).toFixed(2) + "s");

        if (layerIndex === 2 && i % 5 === 0) {
          star.style.boxShadow = "0 0 10px rgba(255,255,255,0.35)";
        }

        layer.appendChild(star);
      }

      starField.appendChild(layer);
    });
  }

  function formatCount(total, visible) {
    if (visible === total) {
      return total + " episodios listados";
    }

    return visible + " de " + total + " episodios visibles";
  }

  function escapeXml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function getPalette(episode) {
    var palettes = [
      ["#61dafb", "#19324f", "#ffd36e"],
      ["#ff8a65", "#2b1d42", "#7fe7ff"],
      ["#9fa8da", "#101c3a", "#ffd36e"],
      ["#80cbc4", "#12263f", "#ffb74d"],
      ["#ef9a9a", "#2e153f", "#90caf9"],
      ["#ce93d8", "#1d1d46", "#ffd180"]
    ];

    return palettes[episode.number % palettes.length];
  }

  function buildEpisodeArt(episode) {
    var palette = getPalette(episode);
    var left = palette[0];
    var base = palette[1];
    var accent = palette[2];
    var title = escapeXml(episode.title);
    var label = escapeXml("Episodio " + episode.number);
    var summary = escapeXml(episode.summary.slice(0, 42).toUpperCase());
    var xOffset = 70 + ((episode.number * 17) % 180);
    var planetRadius = 64 + (episode.number % 4) * 10;
    var svg = [
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" role="img" aria-label="' + title + '">',
      "<defs>",
      '<linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">',
      '<stop offset="0%" stop-color="' + left + '"/>',
      '<stop offset="100%" stop-color="' + base + '"/>',
      "</linearGradient>",
      "</defs>",
      '<rect width="800" height="450" fill="url(#bg)"/>',
      '<circle cx="' + xOffset + '" cy="108" r="3" fill="#ffffff" fill-opacity="0.75"/>',
      '<circle cx="640" cy="90" r="2" fill="#ffffff" fill-opacity="0.7"/>',
      '<circle cx="712" cy="162" r="4" fill="#ffffff" fill-opacity="0.65"/>',
      '<circle cx="180" cy="318" r="' + planetRadius + '" fill="' + accent + '" fill-opacity="0.86"/>',
      '<ellipse cx="180" cy="318" rx="' + (planetRadius + 20) + '" ry="' + Math.round(planetRadius * 0.34) + '" fill="none" stroke="#f4f7fb" stroke-opacity="0.35" stroke-width="6"/>',
      '<path d="M332 250C430 196 566 188 700 230L638 278C544 252 452 256 366 302L332 250Z" fill="#f4f7fb" fill-opacity="0.92"/>',
      '<path d="M310 266L676 220L706 238L348 284L310 266Z" fill="' + accent + '" fill-opacity="0.88"/>',
      '<path d="M530 225L580 146L602 152L566 230L530 225Z" fill="#dfe8f4" fill-opacity="0.8"/>',
      '<rect x="360" y="42" width="384" height="44" rx="22" fill="#08111f" fill-opacity="0.35"/>',
      '<text x="388" y="71" fill="#f4f7fb" font-size="22" font-family="Trebuchet MS, sans-serif" letter-spacing="2">' + label + "</text>",
      '<text x="360" y="374" fill="#f4f7fb" font-size="40" font-family="Impact, sans-serif">' + title + "</text>",
      '<text x="360" y="410" fill="#d7e4f3" font-size="18" font-family="Trebuchet MS, sans-serif">' + summary + "</text>",
      "</svg>"
    ].join("");

    return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg);
  }

  function buildEpisodeCard(episode) {
    return [
      '<article class="episode-card">',
      '  <img class="episode-card__image" src="' + buildEpisodeArt(episode) + '" alt="Ilustracion del episodio ' + episode.number + ": " + episode.title + '">',
      '  <div class="episode-card__content">',
      '    <div class="episode-card__top">',
      "      <div>",
      '        <span class="episode-card__number">Episodio ' + episode.number + "</span>",
      '        <h3 class="episode-card__title">' + episode.title + "</h3>",
      '        <p class="episode-card__meta">Emision original: ' + episode.date + "</p>",
      "      </div>",
      "    </div>",
      "    <p>" + episode.summary + "</p>",
      "  </div>",
      "</article>"
    ].join("");
  }

  function filterEpisodes(query) {
    var normalizedQuery = normalize(query);

    if (!normalizedQuery) {
      return season.episodes.slice();
    }

    return season.episodes.filter(function (episode) {
      var haystack = normalize(
        episode.number + " " +
        episode.title + " " +
        episode.summary + " " +
        episode.date
      );

      return haystack.indexOf(normalizedQuery) !== -1;
    });
  }

  function renderEpisodes(query) {
    if (!episodeGrid || !episodeCount || !emptyState) {
      return;
    }

    var filteredEpisodes = filterEpisodes(query);

    episodeCount.textContent = formatCount(season.episodes.length, filteredEpisodes.length);
    episodeGrid.innerHTML = filteredEpisodes.map(buildEpisodeCard).join("");
    emptyState.hidden = filteredEpisodes.length > 0;
  }

  function ageAtDate(birthDate, targetDate) {
    var birth = new Date(birthDate + "T00:00:00");
    var target = new Date(targetDate + "T00:00:00");
    var age = target.getFullYear() - birth.getFullYear();
    var monthDelta = target.getMonth() - birth.getMonth();
    var dayDelta = target.getDate() - birth.getDate();

    if (monthDelta < 0 || (monthDelta === 0 && dayDelta < 0)) {
      age -= 1;
    }

    return age;
  }

  function renderCastAges() {
    var intro = document.getElementById("cast-age-intro");
    var visibleCast = castMembers.filter(function (member) {
      return member.seasons.indexOf(season.number) !== -1;
    });

    if (intro) {
      intro.innerHTML =
        'Edades calculadas durante el estreno de la temporada el <strong>' +
        season.episodes[0].date +
        '</strong>, y situacion verificada a <strong>22 de marzo de 2026</strong>.';
    }

    if (!castAgeList) {
      return;
    }

    castAgeList.innerHTML = visibleCast.map(function (member) {
      var ageThen = ageAtDate(member.birth, season.premiereDate);
      var ageNowOrDeath = member.death
        ? "fallecio en " + member.death.slice(0, 4) + " con " + ageAtDate(member.birth, member.death)
        : ageAtDate(member.birth, "2026-03-22") + " hoy";

      return "<li><strong>" + member.actor + "</strong>: " + ageThen + " entonces | " + ageNowOrDeath + "</li>";
    }).join("");
  }

  function renderSeasonShell() {
    document.title = "Star Trek | Temporada " + season.number;

    var mapping = {
      "season-badge": season.badge,
      "season-hero-title": season.heroTitle,
      "season-hero-text": season.heroText,
      "stat-season": String(season.number),
      "stat-episodes": String(season.episodesCount),
      "stat-years": season.years,
      "summary-title": season.summaryTitle,
      "summary-card-1-title": season.summaryCards[0].title,
      "summary-card-1-text": season.summaryCards[0].text,
      "summary-card-2-title": season.summaryCards[1].title,
      "summary-card-2-text": season.summaryCards[1].text,
      "summary-card-3-title": season.summaryCards[2].title,
      "summary-card-3-text": season.summaryCards[2].text,
      "episodes-title": season.episodesTitle,
      "episodes-subtitle": season.episodesSubtitle,
      "timeline-title": season.timelineTitle,
      "footer-note-title": season.footerTitle,
      "footer-note-text": season.footerText
    };

    Object.keys(mapping).forEach(function (id) {
      var element = document.getElementById(id);
      if (element) {
        element.textContent = mapping[id];
      }
    });

    if (episodeSearch) {
      episodeSearch.setAttribute("placeholder", season.searchPlaceholder);
    }

    seasonLinks.forEach(function (link) {
      if (Number(link.getAttribute("data-season-link")) === season.number) {
        link.classList.add("is-active");
        link.setAttribute("aria-current", "page");
      } else {
        link.classList.remove("is-active");
        link.removeAttribute("aria-current");
      }
    });

    if (timelineGrid) {
      timelineGrid.innerHTML = season.timeline.map(function (item) {
        return [
          '<article class="timeline__item">',
          '  <span class="timeline__tag">' + item.tag + "</span>",
          "  <h3>" + item.title + "</h3>",
          "  <p>" + item.text + "</p>",
          "</article>"
        ].join("");
      }).join("");
    }
  }

  function setupCharacterReveal() {
    if (!characterCards.length) {
      return;
    }

    characterCards.forEach(function (card, index) {
      card.style.setProperty("--reveal-delay", String(index * 80) + "ms");
    });

    if (typeof window.IntersectionObserver !== "function") {
      characterCards.forEach(function (card) {
        card.classList.add("is-visible");
      });
      return;
    }

    var observer = new window.IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, {
      threshold: 0.2,
      rootMargin: "0px 0px -5% 0px"
    });

    characterCards.forEach(function (card) {
      observer.observe(card);
    });
  }

  function getSeasonUrl(number) {
    return "./temporada-" + number + ".html";
  }

  function renderSeriesSeasonShortcuts(seriesSlug) {
    if (!homeSeasonShortcuts || !homeSeriesExtraLabel || !homeSeriesExtraText) {
      return;
    }

    var seasonEntry = findSeriesSeasonEntry(seriesSlug);

    if (!seasonEntry || !seasonEntry.seasons.length) {
      homeSeriesExtraLabel.textContent = "Temporadas";
      homeSeasonShortcuts.hidden = true;
      homeSeriesExtraText.hidden = false;
      homeSeriesExtraText.textContent = "Esta serie todavia no tiene temporadas detalladas en la web.";
      return;
    }

    homeSeriesExtraLabel.textContent = "Temporadas";
    homeSeasonShortcuts.hidden = false;
    homeSeriesExtraText.hidden = true;
    homeSeriesExtraText.textContent = "";
    homeSeasonShortcuts.setAttribute("aria-label", "Temporadas de " + seasonEntry.title);
    homeSeasonShortcuts.innerHTML = seasonEntry.seasons.map(function (seasonItem) {
      var suffix = seasonItem.episodesCount ? " | " + seasonItem.episodesCount + " episodios" : "";

      return '<a class="season-selector__link quick-map__chip" href="' + seasonItem.url + '">Temporada ' + seasonItem.number + suffix + "</a>";
    }).join("");
  }

  function renderHomeSeasonCards() {
    if (!homeSeasonGrid) {
      return;
    }

    homeSeasonGrid.innerHTML = Object.keys(SEASONS).map(function (key) {
      var seasonData = SEASONS[key];

      return [
        '<article class="season-overview-card">',
        '  <p class="season-overview-card__eyebrow">' + seasonData.badge + "</p>",
        "  <h3>" + seasonData.heroTitle + "</h3>",
        "  <p>" + seasonData.heroText + "</p>",
        '  <div class="season-overview-card__meta">',
        '    <span class="timeline__tag">' + seasonData.episodesCount + " episodios</span>",
        '    <span class="timeline__tag">' + seasonData.years + "</span>",
        "  </div>",
        '  <p class="season-overview-card__focus"><strong>Clave:</strong> ' + seasonData.summaryCards[2].text + "</p>",
        '  <a class="button button--primary" href="' + getSeasonUrl(seasonData.number) + '">Abrir temporada ' + seasonData.number + "</a>",
        "</article>"
      ].join("");
    }).join("");
  }

  function buildSeriesCard(item) {
    return [
      '<a class="series-card series-card--link" href="' + getSeriesDetailUrl(item.title) + '">',
      '  <div class="series-card__top">',
      "    <div>",
      "      <h3>" + item.title + "</h3>",
      '      <p class="series-card__summary">' + item.summary + "</p>",
      "    </div>",
      '    <span class="series-card__release">' + item.releaseLabel + "</span>",
      "  </div>",
      '  <div class="series-card__meta">',
      '    <p><strong>Orden de emision:</strong> ' + item.releaseLabel + "</p>",
      '    <p><strong>Orden dentro del universo:</strong> ' + item.timelineLabel + "</p>",
      '    <p><strong>Fecha estelar o marco temporal:</strong> ' + item.stardateLabel + "</p>",
      "  </div>",
      "</a>"
    ].join("");
  }

  function buildMovieCard(item) {
    return [
      '<a class="movie-card movie-card--link" href="' + getMovieDetailUrl(item.title) + '">',
      '  <div class="movie-card__top">',
      "    <div>",
      "      <h3>" + item.title + "</h3>",
      '      <p class="series-card__summary">' + item.summary + "</p>",
      "    </div>",
      '    <span class="series-card__release">' + item.releaseLabel + "</span>",
      "  </div>",
      '  <div class="series-card__meta">',
      '    <p><strong>Estreno:</strong> ' + item.releaseLabel + "</p>",
      '    <p><strong>Linea temporal:</strong> ' + item.timelineLabel + "</p>",
      '    <p><strong>Continuidad:</strong> ' + item.continuity + "</p>",
      "  </div>",
      "</a>"
    ].join("");
  }

  function renderFranchiseSeries(sortMode) {
    if (!franchiseSeriesGrid) {
      return;
    }

    var sortedSeries = SERIES_DETAILS.slice().sort(function (left, right) {
      var leftValues = getSeriesOrderValues(left.title);
      var rightValues = getSeriesOrderValues(right.title);

      if (sortMode === "timeline") {
        return leftValues.timeline - rightValues.timeline || leftValues.release - rightValues.release;
      }

      return leftValues.release - rightValues.release || leftValues.timeline - rightValues.timeline;
    });

    franchiseSeriesGrid.innerHTML = sortedSeries.map(buildSeriesCard).join("");

    seriesSortButtons.forEach(function (button) {
      var isActive = button.getAttribute("data-series-sort") === sortMode;
      button.classList.toggle("is-active", isActive);
      if (isActive) {
        button.setAttribute("aria-pressed", "true");
      } else {
        button.setAttribute("aria-pressed", "false");
      }
    });
  }

  function setupSeriesSort() {
    if (!seriesSortButtons.length) {
      return;
    }

    seriesSortButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        renderFranchiseSeries(button.getAttribute("data-series-sort") || "release");
      });
    });
  }

  function renderMovies(sortMode) {
    if (!moviesGrid) {
      return;
    }

    var sortedMovies = MOVIES.slice().sort(function (left, right) {
      if (sortMode === "timeline") {
        return left.timelineStart - right.timelineStart || left.releaseStart - right.releaseStart;
      }

      return left.releaseStart - right.releaseStart || left.timelineStart - right.timelineStart;
    });

    moviesGrid.innerHTML = sortedMovies.map(buildMovieCard).join("");

    movieSortButtons.forEach(function (button) {
      var isActive = button.getAttribute("data-movie-sort") === sortMode;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", isActive ? "true" : "false");
    });
  }

  function setupMoviesModal() {
    if (!moviesModal || !openMoviesModalButton) {
      return;
    }

    function openModal() {
      renderMovies("release");
      if (typeof moviesModal.showModal === "function") {
        moviesModal.showModal();
      } else {
        moviesModal.setAttribute("open", "open");
      }
    }

    function closeModal() {
      if (typeof moviesModal.close === "function") {
        moviesModal.close();
      } else {
        moviesModal.removeAttribute("open");
      }
    }

    openMoviesModalButton.addEventListener("click", openModal);

    if (homeMoviesShortcut) {
      homeMoviesShortcut.addEventListener("click", openModal);
    }

    if (closeMoviesModalButton) {
      closeMoviesModalButton.addEventListener("click", closeModal);
    }

    movieSortButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        renderMovies(button.getAttribute("data-movie-sort") || "release");
      });
    });

    moviesModal.addEventListener("click", function (event) {
      if (event.target === moviesModal) {
        closeModal();
      }
    });
  }

  function renderHomeStats() {
    var universeSeries = getUniverseSeries();

    if (homeStatSeriesCount) {
      homeStatSeriesCount.textContent = String(SERIES_DETAILS.length);
    }

    if (homeStatMovieCount) {
      homeStatMovieCount.textContent = String(MOVIES.length);
    }

    if (homeStatTimeline) {
      homeStatTimeline.textContent = "2151-siglo XXXII";
    }

    if (homeSeriesSelect) {
      homeSeriesSelect.innerHTML = universeSeries.map(function (item) {
        return '<option value="' + item.title + '">' + item.title + "</option>";
      }).join("");
    }

    function renderSelectedSeriesDetail(seriesTitle) {
      if (!homeSeriesDetail && !homeSeriesSummary) {
        return;
      }

      var selectedSeries = universeSeries.find(function (item) {
        return item.title === seriesTitle;
      }) || universeSeries[0];

      if (homeSeriesDetail) {
        var breakdownText = selectedSeries.seasonBreakdown
          ? "capitulos por temporada: " + selectedSeries.seasonBreakdown + " | "
          : "";

        homeSeriesDetail.textContent =
          selectedSeries.seasonsCount +
          " temporadas | " +
          breakdownText +
          "cronologia: " +
          selectedSeries.timelineLabel +
          " | emision: " +
          selectedSeries.releaseLabel +
          ".";
      }

      if (homeSeriesLink) {
        homeSeriesLink.setAttribute("href", getSeriesDetailUrl(selectedSeries.title));
      }

      renderSeriesSeasonShortcuts(selectedSeries.slug);
    }

    if (homeSeriesSelect) {
      renderSelectedSeriesDetail(homeSeriesSelect.value || universeSeries[0].title);

      homeSeriesSelect.addEventListener("change", function (event) {
        renderSelectedSeriesDetail(event.target.value);
      });
    }

    renderSeriesSeasonShortcuts(universeSeries[0].slug);
  }

  if (pageType === "home") {
    setupStarfield();
    document.title = "Star Trek - Universo";
    localizeHomeStatic();
    renderHomeStats();
    renderHomeSeasonCards();
    renderFranchiseSeries("release");
    setupSeriesSort();
    setupMoviesModal();
    return;
  }

  if (pageType === "detail") {
    setupStarfield();
    return;
  }

  if (pageType === "series-season") {
    setupStarfield();
    return;
  }

  setupStarfield();
  localizeSeasonStatic();
  renderSeasonShell();
  renderCastAges();
  setupCharacterReveal();

  if (episodeSearch) {
    episodeSearch.addEventListener("input", function (event) {
      renderEpisodes(event.target.value);
    });
  }

  renderEpisodes("");
}());

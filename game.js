import { OTHER_SERIES, SEASONS } from "./season-data.js";

(function () {
  "use strict";

  var body = document.body;
  var pageType = body.getAttribute("data-page") === "home" ? "home" : "season";
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
  var homeStatSeasonCount = document.getElementById("home-stat-season-count");
  var homeStatEpisodeCount = document.getElementById("home-stat-episode-count");
  var homeStatSeriesCount = document.getElementById("home-stat-series-count");
  var homeStatYears = document.getElementById("home-stat-years");

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
      '<article class="series-card">',
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
      "</article>"
    ].join("");
  }

  function renderFranchiseSeries(sortMode) {
    if (!franchiseSeriesGrid) {
      return;
    }

    var sortedSeries = OTHER_SERIES.slice().sort(function (left, right) {
      if (sortMode === "timeline") {
        return left.timelineStart - right.timelineStart || left.releaseStart - right.releaseStart;
      }

      return left.releaseStart - right.releaseStart || left.timelineStart - right.timelineStart;
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

  function renderHomeStats() {
    var totalEpisodes = Object.keys(SEASONS).reduce(function (sum, key) {
      return sum + SEASONS[key].episodesCount;
    }, 0);

    if (homeStatSeasonCount) {
      homeStatSeasonCount.textContent = String(Object.keys(SEASONS).length);
    }

    if (homeStatEpisodeCount) {
      homeStatEpisodeCount.textContent = String(totalEpisodes);
    }

    if (homeStatSeriesCount) {
      homeStatSeriesCount.textContent = String(OTHER_SERIES.length);
    }

    if (homeStatYears) {
      homeStatYears.textContent = "1966-1969";
    }
  }

  if (pageType === "home") {
    document.title = "Star Trek - La Serie Original";
    renderHomeStats();
    renderHomeSeasonCards();
    renderFranchiseSeries("release");
    setupSeriesSort();
    return;
  }

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

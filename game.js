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
  var openQuickVideoModalButton = document.getElementById("open-quick-video-modal");
  var closeQuickVideoModalButton = document.getElementById("close-quick-video-modal");
  var quickVideoModal = document.getElementById("quick-video-modal");
  var starField = document.querySelector(".stars");
  var anniversaryBanner = document.getElementById("anniversary-banner");

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

  function setupAnniversaryIntro() {
    var storageKey = "st-universe-60-intro-seen";

    if (!anniversaryBanner || pageType !== "home") {
      return;
    }

    anniversaryBanner.classList.add("anniversary-banner--ready");

    try {
      if (window.localStorage && window.localStorage.getItem(storageKey)) {
        return;
      }
    } catch (error) {
      return;
    }

    anniversaryBanner.classList.add("anniversary-banner--intro");

    anniversaryBanner.addEventListener("animationend", function handleIntroEnd() {
      anniversaryBanner.classList.remove("anniversary-banner--intro");
      anniversaryBanner.removeEventListener("animationend", handleIntroEnd);
    });

    try {
      if (window.localStorage) {
        window.localStorage.setItem(storageKey, "true");
      }
    } catch (error) {
      // Si el navegador bloquea storage, la animacion simplemente volvera a mostrarse.
    }
  }

  function localizeHomeStatic() {
    var eyebrow = document.querySelector(".hero__copy .eyebrow");
    var heroTitle = document.querySelector(".hero__copy h1");
    var heroText = document.querySelector(".hero__text");
    var heroActions = Array.prototype.slice.call(document.querySelectorAll(".hero__actions .button"));
    var cardLabel = document.querySelector(".hero__card-label");
    var quickMapTitle = document.querySelector(".quick-map__title");
    var quickMapText = document.querySelector(".quick-map__text");
    var quickMapLabels = Array.prototype.slice.call(document.querySelectorAll(".quick-map__label"));
    var seriesSummary = document.getElementById("home-series-summary");
    var dropdownLabel = document.querySelector(".stat-dropdown__label");
    var dropdownField = document.querySelector(".stat-dropdown__field");
    var homeSections = {
      websiteEyebrow: document.querySelector("#vision .eyebrow"),
      websiteTitle: document.querySelector("#vision h2"),
      websiteText: document.querySelector("#vision .section-text"),
      introTitles: Array.prototype.slice.call(document.querySelectorAll("#vision .intro-card h3")),
      introTexts: Array.prototype.slice.call(document.querySelectorAll("#vision .intro-card p")),
      seasonsEyebrow: document.querySelector("#temporadas .eyebrow"),
      seasonsTitle: document.querySelector("#temporadas h2"),
      seasonsText: document.querySelector("#temporadas .section-text"),
      moreEyebrow: document.querySelector("#otras-series .eyebrow"),
      moreTitle: document.querySelector("#otras-series h2"),
      moreText: document.querySelector("#otras-series .section-text"),
      sortButtons: Array.prototype.slice.call(document.querySelectorAll("[data-series-sort]")),
      footerEyebrow: document.querySelector(".section--footer-note .eyebrow"),
      footerTitle: document.querySelector(".section--footer-note h2"),
      footerText: document.querySelector(".section--footer-note p:last-child"),
      movieEyebrow: document.querySelector("#movies-modal .eyebrow"),
      movieTitle: document.getElementById("movies-modal-title"),
      movieText: document.querySelector("#movies-modal .section-text"),
      movieClose: document.getElementById("close-movies-modal"),
      movieSortButtons: Array.prototype.slice.call(document.querySelectorAll("[data-movie-sort]"))
    };
    var quickMapStats = Array.prototype.slice.call(document.querySelectorAll(".stat-list--quick-map li span"));

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
    if (cardLabel) {
      cardLabel.textContent = t("home.quickMapLabel");
    }
    if (quickMapTitle) {
      quickMapTitle.textContent = t("home.quickMapTitle");
    }
    if (quickMapText) {
      quickMapText.textContent = t("home.quickMapText");
    }
    if (quickMapLabels[0]) {
      quickMapLabels[0].textContent = t("home.seriesLabel");
    }
    if (quickMapLabels[1]) {
      quickMapLabels[1].textContent = t("home.directAccess");
    }
    if (quickMapLabels[2]) {
      quickMapLabels[2].textContent = t("home.moviesLabel");
    }
    if (seriesSummary) {
      seriesSummary.textContent = t("home.chooseSeries");
    }
    if (dropdownLabel) {
      dropdownLabel.textContent = t("home.seriesUniverse");
    }
    if (dropdownField) {
      dropdownField.textContent = t("home.selectSeries");
    }
    if (homeSeriesLink) {
      homeSeriesLink.textContent = t("home.openSeriesFile");
    }
    if (homeMoviesShortcut) {
      homeMoviesShortcut.textContent = t("home.openMovieArchive");
    }
    if (quickMapStats[0]) {
      quickMapStats[0].textContent = t("home.activeSeries");
    }
    if (quickMapStats[1]) {
      quickMapStats[1].textContent = t("home.archivedMovies");
    }
    if (quickMapStats[2]) {
      quickMapStats[2].textContent = t("home.timelineCovered");
    }
    if (homeSections.websiteEyebrow) {
      homeSections.websiteEyebrow.textContent = t("home.websiteEyebrow");
    }
    if (homeSections.websiteTitle) {
      homeSections.websiteTitle.textContent = t("home.websiteTitle");
    }
    if (homeSections.websiteText) {
      homeSections.websiteText.textContent = t("home.websiteText");
    }
    if (homeSections.introTitles[0]) {
      homeSections.introTitles[0].textContent = t("home.intro1Title");
    }
    if (homeSections.introTexts[0]) {
      homeSections.introTexts[0].textContent = t("home.intro1Text");
    }
    if (homeSections.introTitles[1]) {
      homeSections.introTitles[1].textContent = t("home.intro2Title");
    }
    if (homeSections.introTexts[1]) {
      homeSections.introTexts[1].textContent = t("home.intro2Text");
    }
    if (homeSections.introTitles[2]) {
      homeSections.introTitles[2].textContent = t("home.intro3Title");
    }
    if (homeSections.introTexts[2]) {
      homeSections.introTexts[2].textContent = t("home.intro3Text");
    }
    if (homeSections.seasonsEyebrow) {
      homeSections.seasonsEyebrow.textContent = t("home.seasonsEyebrow");
    }
    if (homeSections.seasonsTitle) {
      homeSections.seasonsTitle.textContent = t("home.seasonsTitle");
    }
    if (homeSections.seasonsText) {
      homeSections.seasonsText.textContent = t("home.seasonsText");
    }
    if (homeSections.moreEyebrow) {
      homeSections.moreEyebrow.textContent = t("home.moreTrekEyebrow");
    }
    if (homeSections.moreTitle) {
      homeSections.moreTitle.textContent = t("home.moreTrekTitle");
    }
    if (homeSections.moreText) {
      homeSections.moreText.textContent = t("home.moreTrekText");
    }
    if (homeSections.sortButtons[0]) {
      homeSections.sortButtons[0].textContent = t("home.sortRelease");
    }
    if (homeSections.sortButtons[1]) {
      homeSections.sortButtons[1].textContent = t("home.sortTimeline");
    }
    if (homeSections.footerEyebrow) {
      homeSections.footerEyebrow.textContent = t("home.commandEyebrow");
    }
    if (homeSections.footerTitle) {
      homeSections.footerTitle.textContent = t("home.commandTitle");
    }
    if (homeSections.footerText) {
      homeSections.footerText.textContent = t("home.commandText");
    }
    if (homeSections.movieEyebrow) {
      homeSections.movieEyebrow.textContent = t("home.moviesEyebrow");
    }
    if (homeSections.movieTitle) {
      homeSections.movieTitle.textContent = t("home.moviesTitle");
    }
    if (homeSections.movieText) {
      homeSections.movieText.textContent = t("home.moviesText");
    }
    if (homeSections.movieClose) {
      homeSections.movieClose.textContent = t("home.closeMovies");
      homeSections.movieClose.setAttribute("aria-label", t("home.closeMovies"));
    }
    if (homeSections.movieSortButtons[0]) {
      homeSections.movieSortButtons[0].textContent = t("home.sortRelease");
    }
    if (homeSections.movieSortButtons[1]) {
      homeSections.movieSortButtons[1].textContent = t("home.sortTimeline");
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

  function getLocalizedSeasonOverview(seasonData) {
    var language = getLanguage();
    var seasonTranslations = {
      es: {
        1: {
          badge: "Temporada 1 | 1966-1967",
          title: "La primera temporada de Star Trek en una sola mirada",
          text: "La temporada inaugural de Star Trek: The Original Series presentó a la tripulación de la USS Enterprise en una mezcla única de aventura espacial, ciencia ficción y comentario social.",
          focus: "La primera temporada asentó el universo Trek con episodios sobre guerra, racismo, inteligencia artificial, religión, identidad y el precio del poder."
        },
        2: {
          badge: "Temporada 2 | 1967-1968",
          title: "La segunda temporada expande el universo clásico",
          text: "La segunda temporada convierte Star Trek en una mitología en expansión: Vulcano, el universo espejo, los tribbles y nuevos personajes como Chekov amplían el canon con seguridad y ambición.",
          focus: "Esta temporada incluye algunos de los capítulos más icónicos de la saga, como \"Amok Time\", \"Mirror, Mirror\" y \"The Trouble with Tribbles\"."
        },
        3: {
          badge: "Temporada 3 | 1968-1969",
          title: "La tercera temporada cierra la misión original",
          text: "La temporada final de la serie original es más irregular, pero también más extraña, audaz y llena de ideas memorables que siguieron resonando en la franquicia durante décadas.",
          focus: "Incluso como última temporada, dejó ideas clave como la intriga romulana de \"The Enterprise Incident\" y la melancolía temporal de \"All Our Yesterdays\"."
        },
        episodesWord: "episodios",
        openPrefix: "Abrir temporada",
        keyLabel: "Clave:"
      },
      en: {
        1: {
          badge: "Season 1 | 1966-1967",
          title: "The first season of Star Trek at a glance",
          text: "The inaugural season of Star Trek: The Original Series introduced the crew of the USS Enterprise in a unique mix of space adventure, science fiction, and social commentary.",
          focus: "The first season established the Trek universe with stories about war, racism, artificial intelligence, religion, identity, and the cost of power."
        },
        2: {
          badge: "Season 2 | 1967-1968",
          title: "The second season expands the classic universe",
          text: "The second season turns Star Trek into a growing mythology: Vulcan, the mirror universe, tribbles, and new characters such as Chekov expand the canon with confidence and ambition.",
          focus: "This season includes some of the most iconic chapters in the saga, such as \"Amok Time,\" \"Mirror, Mirror,\" and \"The Trouble with Tribbles.\""
        },
        3: {
          badge: "Season 3 | 1968-1969",
          title: "The third season closes the original mission",
          text: "The final season of the original series is more uneven, but also stranger, bolder, and full of memorable ideas that kept echoing through the franchise for decades.",
          focus: "Even as the last season, it left behind key ideas such as the Romulan intrigue of \"The Enterprise Incident\" and the temporal melancholy of \"All Our Yesterdays.\""
        },
        episodesWord: "episodes",
        openPrefix: "Open season",
        keyLabel: "Key:"
      },
      fr: {
        1: {
          badge: "Saison 1 | 1966-1967",
          title: "La première saison de Star Trek en un seul regard",
          text: "La saison inaugurale de Star Trek: The Original Series a présenté l'équipage de l'USS Enterprise dans un mélange unique d'aventure spatiale, de science-fiction et de commentaire social.",
          focus: "La première saison a établi l'univers Trek avec des épisodes sur la guerre, le racisme, l'intelligence artificielle, la religion, l'identité et le prix du pouvoir."
        },
        2: {
          badge: "Saison 2 | 1967-1968",
          title: "La deuxième saison élargit l'univers classique",
          text: "La deuxième saison transforme Star Trek en une mythologie en expansion: Vulcain, l'univers miroir, les tribbles et de nouveaux personnages comme Chekov étendent le canon avec assurance et ambition.",
          focus: "Cette saison comprend certains des chapitres les plus emblématiques de la saga, comme \"Amok Time\", \"Mirror, Mirror\" et \"The Trouble with Tribbles\"."
        },
        3: {
          badge: "Saison 3 | 1968-1969",
          title: "La troisième saison clôt la mission originale",
          text: "La saison finale de la série originale est plus inégale, mais aussi plus étrange, plus audacieuse et pleine d'idées mémorables qui ont résonné dans la franchise pendant des décennies.",
          focus: "Même en tant que dernière saison, elle a laissé des idées majeures comme l'intrigue romulienne de \"The Enterprise Incident\" et la mélancolie temporelle de \"All Our Yesterdays\"."
        },
        episodesWord: "épisodes",
        openPrefix: "Ouvrir la saison",
        keyLabel: "Clé:"
      },
      ru: {
        1: {
          badge: "Сезон 1 | 1966-1967",
          title: "Первый сезон Star Trek с первого взгляда",
          text: "Дебютный сезон Star Trek: The Original Series представил экипаж USS Enterprise в уникальном сочетании космического приключения, научной фантастики и социального комментария.",
          focus: "Первый сезон заложил основы вселенной Trek историями о войне, расизме, искусственном интеллекте, религии, идентичности и цене власти."
        },
        2: {
          badge: "Сезон 2 | 1967-1968",
          title: "Второй сезон расширяет классическую вселенную",
          text: "Во втором сезоне Star Trek превращается в растущую мифологию: Вулкан, зеркальная вселенная, трибблы и новые персонажи вроде Чехова уверенно и амбициозно расширяют канон.",
          focus: "Этот сезон включает некоторые из самых знаковых глав саги, такие как \"Amok Time\", \"Mirror, Mirror\" и \"The Trouble with Tribbles\"."
        },
        3: {
          badge: "Сезон 3 | 1968-1969",
          title: "Третий сезон завершает оригинальную миссию",
          text: "Финальный сезон оригинального сериала более неровный, но также более странный, смелый и наполненный идеями, которые еще десятилетиями отзывались во франшизе.",
          focus: "Даже будучи последним, он оставил важные идеи, такие как ромуланская интрига в \"The Enterprise Incident\" и временная меланхолия \"All Our Yesterdays\"."
        },
        episodesWord: "эпизодов",
        openPrefix: "Открыть сезон",
        keyLabel: "Ключ:"
      },
      uk: {
        1: {
          badge: "Сезон 1 | 1966-1967",
          title: "Перший сезон Star Trek одним поглядом",
          text: "Перший сезон Star Trek: The Original Series представив екіпаж USS Enterprise у неповторному поєднанні космічної пригоди, наукової фантастики та соціального коментаря.",
          focus: "Перший сезон заклав основу всесвіту Trek епізодами про війну, расизм, штучний інтелект, релігію, ідентичність і ціну влади."
        },
        2: {
          badge: "Сезон 2 | 1967-1968",
          title: "Другий сезон розширює класичний всесвіт",
          text: "Другий сезон перетворює Star Trek на міфологію, що розростається: Вулкан, дзеркальний всесвіт, трибли та нові персонажі на кшталт Чехова впевнено й амбітно розширюють канон.",
          focus: "Цей сезон містить кілька найвідоміших розділів саги, зокрема \"Amok Time\", \"Mirror, Mirror\" і \"The Trouble with Tribbles\"."
        },
        3: {
          badge: "Сезон 3 | 1968-1969",
          title: "Третій сезон завершує оригінальну місію",
          text: "Фінальний сезон оригінального серіалу більш нерівний, але водночас дивніший, сміливіший і сповнений пам'ятних ідей, що ще довго відлунювали у франшизі.",
          focus: "Навіть як останній сезон, він залишив важливі ідеї, як-от ромуланська інтрига в \"The Enterprise Incident\" і часова меланхолія \"All Our Yesterdays\"."
        },
        episodesWord: "епізодів",
        openPrefix: "Відкрити сезон",
        keyLabel: "Ключ:"
      },
      ca: {
        1: {
          badge: "Temporada 1 | 1966-1967",
          title: "La primera temporada de Star Trek d'un sol cop d'ull",
          text: "La temporada inaugural de Star Trek: The Original Series va presentar la tripulació de la USS Enterprise en una barreja única d'aventura espacial, ciència-ficció i comentari social.",
          focus: "La primera temporada va assentar l'univers Trek amb episodis sobre guerra, racisme, intel·ligència artificial, religió, identitat i el preu del poder."
        },
        2: {
          badge: "Temporada 2 | 1967-1968",
          title: "La segona temporada expandeix l'univers clàssic",
          text: "La segona temporada converteix Star Trek en una mitologia en expansió: Vulcà, l'univers mirall, els tribbles i nous personatges com Chekov amplien el cànon amb seguretat i ambició.",
          focus: "Aquesta temporada inclou alguns dels capítols més icònics de la saga, com \"Amok Time\", \"Mirror, Mirror\" i \"The Trouble with Tribbles\"."
        },
        3: {
          badge: "Temporada 3 | 1968-1969",
          title: "La tercera temporada tanca la missió original",
          text: "La temporada final de la sèrie original és més irregular, però també més estranya, més atrevida i plena d'idees memorables que van continuar ressonant dins la franquícia durant dècades.",
          focus: "Fins i tot com a darrera temporada, va deixar idees clau com la intriga romulana de \"The Enterprise Incident\" i la malenconia temporal de \"All Our Yesterdays\"."
        },
        episodesWord: "episodis",
        openPrefix: "Obrir temporada",
        keyLabel: "Clau:"
      }
    };
    var translatedGroup = seasonTranslations[language] || seasonTranslations.es;
    var translated = translatedGroup[seasonData.number] || seasonTranslations.es[seasonData.number];

    return {
      badge: translated.badge,
      title: translated.title,
      text: translated.text,
      focus: translated.focus,
      episodesLabel: seasonData.episodesCount + " " + translatedGroup.episodesWord,
      openLabel: translatedGroup.openPrefix + " " + seasonData.number,
      keyLabel: translatedGroup.keyLabel
    };
  }

  function getLocalizedSeriesCardContent(item) {
    var language = getLanguage();
    var labelTranslations = {
      es: {
        releaseLabelText: "Orden de emisión:",
        timelineLabelText: "Orden dentro del universo:",
        stardateLabelText: "Fecha estelar o marco temporal:"
      },
      en: {
        releaseLabelText: "Release order:",
        timelineLabelText: "In-universe order:",
        stardateLabelText: "Stardate or time frame:"
      },
      fr: {
        releaseLabelText: "Ordre de diffusion:",
        timelineLabelText: "Ordre dans l'univers:",
        stardateLabelText: "Date stellaire ou période:"
      },
      ru: {
        releaseLabelText: "Порядок выхода:",
        timelineLabelText: "Порядок во вселенной:",
        stardateLabelText: "Звездная дата или период:"
      },
      uk: {
        releaseLabelText: "Порядок виходу:",
        timelineLabelText: "Порядок у всесвіті:",
        stardateLabelText: "Зоряна дата або період:"
      },
      ca: {
        releaseLabelText: "Ordre d'emissió:",
        timelineLabelText: "Ordre dins l'univers:",
        stardateLabelText: "Data estel·lar o marc temporal:"
      }
    };
    var seriesTranslationsByLanguage = {
      es: {},
      en: {
        "Star Trek: The Original Series": ["Kirk, Spock, and McCoy's mission defines the DNA of Star Trek.", "Stardate framework approx. 1312-5928"],
        "Star Trek: Enterprise": ["A prequel about humanity's first deep-space voyages and the birth of the future Federation.", "Before the regular televised stardate system"],
        "Star Trek: Short Treks": ["A collection of short stories set across different eras, from Pike's Enterprise to the far future.", "Anthology spread across several Trek eras"],
        "Star Trek: Discovery": ["It begins as a T.O.S. prequel and later leaps into the far future, expanding two very different Trek eras.", "Jumps from the 23rd century to the 32nd after an extreme time jump"],
        "Star Trek: Strange New Worlds": ["Pike's Enterprise restores the classic spirit of exploration and adventure.", "Set immediately before Kirk's original mission"],
        "Star Trek: The Animated Series": ["A direct animated continuation of the classic crew with the same principal voice cast.", "Approx. stardates 5371-6334"],
        "Star Trek: The Next Generation": ["Picard relaunches Star Trek for a new generation aboard a new Enterprise.", "Approx. stardates 41153-47988"],
        "Star Trek: Deep Space Nine": ["A political, spiritual, and wartime ensemble drama set on a frontier space station.", "Approx. stardates 46379-52861"],
        "Star Trek: Voyager": ["The USS Voyager is stranded in the Delta Quadrant and must try to make its way home for years.", "Approx. stardates 48315-54973"],
        "Star Trek: Lower Decks": ["An animated comedy about junior officers deeply connected to classic and modern Trek canon.", "Approx. stardates 57436-59499"],
        "Star Trek: Prodigy": ["A young crew learns how to become a real starship crew while exploring the galaxy.", "After Voyager, with Janeway as a key reference"],
        "Star Trek: Picard": ["Jean-Luc Picard returns decades later to close major threads in his life and generation.", "After Nemesis and the end of the TNG era"],
        "Star Trek: Starfleet Academy": ["A new Trek series focused on cadets and Starfleet training in the 32nd century.", "Set after Discovery's far-future era at the Starfleet Academy of the 32nd century"]
      },
      fr: {
        "Star Trek: The Original Series": ["La mission de Kirk, Spock et McCoy définit l'ADN de Star Trek.", "Cadre des dates stellaires env. 1312-5928"],
        "Star Trek: Enterprise": ["Une préquelle sur les premiers voyages humains dans l'espace profond et la naissance de la future Fédération.", "Avant le système régulier de dates stellaires télévisées"],
        "Star Trek: Short Treks": ["Une collection de récits courts répartis sur différentes époques, de l'Enterprise de Pike jusqu'au futur lointain.", "Anthologie répartie sur plusieurs ères de Trek"],
        "Star Trek: Discovery": ["Elle commence comme une préquelle de T.O.S. puis saute dans le futur lointain, élargissant deux ères Trek très différentes.", "Passe du XXIIIe au XXXIIe siècle après un saut temporel extrême"],
        "Star Trek: Strange New Worlds": ["L'Enterprise de Pike retrouve l'esprit classique d'exploration et d'aventure.", "Située juste avant la mission originale de Kirk"],
        "Star Trek: The Animated Series": ["Une continuation animée directe de l'équipage classique avec les mêmes voix principales.", "Dates stellaires approx. 5371-6334"],
        "Star Trek: The Next Generation": ["Picard relance Star Trek pour une nouvelle génération à bord d'un nouvel Enterprise.", "Dates stellaires approx. 41153-47988"],
        "Star Trek: Deep Space Nine": ["Un drame choral politique, spirituel et guerrier situé sur une station spatiale frontalière.", "Dates stellaires approx. 46379-52861"],
        "Star Trek: Voyager": ["L'USS Voyager se retrouve bloqué dans le Quadrant Delta et doit tenter de rentrer chez lui pendant des années.", "Dates stellaires approx. 48315-54973"],
        "Star Trek: Lower Decks": ["Une comédie animée sur de jeunes officiers très liée au canon classique et moderne de Trek.", "Dates stellaires approx. 57436-59499"],
        "Star Trek: Prodigy": ["Un jeune équipage apprend à devenir un véritable équipage stellaire tout en explorant la galaxie.", "Après Voyager, avec Janeway comme repère majeur"],
        "Star Trek: Picard": ["Jean-Luc Picard revient des décennies plus tard pour conclure de grands fils de sa vie et de sa génération.", "Après Nemesis et la fin de l'ère TNG"],
        "Star Trek: Starfleet Academy": ["Une nouvelle série Trek centrée sur les cadets et la formation de Starfleet au XXXIIe siècle.", "Située après l'ère futuriste de Discovery à l'Académie de Starfleet du XXXIIe siècle"]
      },
      ru: {
        "Star Trek: The Original Series": ["Миссия Кирка, Спока и Маккоя определяет саму ДНК Star Trek.", "Система звездных дат примерно 1312-5928"],
        "Star Trek: Enterprise": ["Приквел о первых полетах человечества в дальний космос и рождении будущей Федерации.", "До регулярной телевизионной системы звездных дат"],
        "Star Trek: Short Treks": ["Сборник коротких историй из разных эпох, от Enterprise Пайка до далекого будущего.", "Антология, охватывающая несколько эр Trek"],
        "Star Trek: Discovery": ["Начинается как приквел к T.O.S., а затем уходит в далекое будущее, расширяя две очень разные эры Trek.", "Прыгает из XXIII в XXXII век после экстремального скачка во времени"],
        "Star Trek: Strange New Worlds": ["Enterprise Пайка возвращает классический дух исследования и приключения.", "Происходит непосредственно перед оригинальной миссией Кирка"],
        "Star Trek: The Animated Series": ["Прямое анимационное продолжение классического экипажа с теми же основными голосами.", "Звездные даты примерно 5371-6334"],
        "Star Trek: The Next Generation": ["Пикар перезапускает Star Trek для нового поколения на борту нового Enterprise.", "Звездные даты примерно 41153-47988"],
        "Star Trek: Deep Space Nine": ["Политическая, духовная и военная ансамблевая драма на пограничной космической станции.", "Звездные даты примерно 46379-52861"],
        "Star Trek: Voyager": ["USS Voyager застревает в Дельта-квадранте и годами пытается вернуться домой.", "Звездные даты примерно 48315-54973"],
        "Star Trek: Lower Decks": ["Анимационная комедия о младших офицерах, тесно связанная с классическим и современным каноном Trek.", "Звездные даты примерно 57436-59499"],
        "Star Trek: Prodigy": ["Молодой экипаж учится быть настоящей звездной командой, исследуя галактику.", "После Voyager, с Джейнвей как ключевой точкой отсчета"],
        "Star Trek: Picard": ["Жан-Люк Пикар возвращается спустя десятилетия, чтобы завершить важные линии своей жизни и своего поколения.", "После Nemesis и конца эры TNG"],
        "Star Trek: Starfleet Academy": ["Новый сериал Trek о кадетах и обучении в Академии Звездного флота в XXXII веке.", "После далекого будущего Discovery в Академии Звездного флота XXXII века"]
      },
      uk: {
        "Star Trek: The Original Series": ["Місія Кірка, Спока й Маккоя визначає саму ДНК Star Trek.", "Система зоряних дат приблизно 1312-5928"],
        "Star Trek: Enterprise": ["Приквел про перші польоти людства в далекий космос і народження майбутньої Федерації.", "До регулярної телевізійної системи зоряних дат"],
        "Star Trek: Short Treks": ["Збірка коротких історій із різних епох, від Enterprise Пайка до далекого майбутнього.", "Антологія, розподілена між кількома ерами Trek"],
        "Star Trek: Discovery": ["Починається як приквел до T.O.S., а потім переноситься в далекий майбутній час, розширюючи дві дуже різні ери Trek.", "Стрибає з XXIII до XXXII століття після екстремального часового стрибка"],
        "Star Trek: Strange New Worlds": ["Enterprise Пайка повертає класичний дух дослідження й пригод.", "Відбувається безпосередньо перед оригінальною місією Кірка"],
        "Star Trek: The Animated Series": ["Пряме анімаційне продовження класичного екіпажу з тим самим основним акторським складом озвучення.", "Зоряні дати приблизно 5371-6334"],
        "Star Trek: The Next Generation": ["Пікар перезапускає Star Trek для нового покоління на борту нового Enterprise.", "Зоряні дати приблизно 41153-47988"],
        "Star Trek: Deep Space Nine": ["Політична, духовна та воєнна ансамблева драма на прикордонній космічній станції.", "Зоряні дати приблизно 46379-52861"],
        "Star Trek: Voyager": ["USS Voyager застрягає в Дельта-квадранті й роками намагається повернутися додому.", "Зоряні дати приблизно 48315-54973"],
        "Star Trek: Lower Decks": ["Анімаційна комедія про молодших офіцерів, тісно пов'язана з класичним і сучасним каноном Trek.", "Зоряні дати приблизно 57436-59499"],
        "Star Trek: Prodigy": ["Молодий екіпаж вчиться бути справжньою зоряною командою, досліджуючи галактику.", "Після Voyager, із Джейнвей як ключовим орієнтиром"],
        "Star Trek: Picard": ["Жан-Люк Пікар повертається через десятиліття, щоб завершити важливі сюжетні лінії свого життя й свого покоління.", "Після Nemesis і завершення ери TNG"],
        "Star Trek: Starfleet Academy": ["Новий серіал Trek, зосереджений на кадетах і підготовці Зоряного флоту у XXXII столітті.", "Після далекого майбутнього Discovery в Академії Зоряного флоту XXXII століття"]
      },
      ca: {
        "Star Trek: The Original Series": ["La missió de Kirk, Spock i McCoy defineix l'ADN de Star Trek.", "Marc de dates estel·lars aprox. 1312-5928"],
        "Star Trek: Enterprise": ["Una preqüela sobre els primers viatges humans a l'espai profund i el naixement de la futura Federació.", "Abans del sistema regular de dates estel·lars televisives"],
        "Star Trek: Short Treks": ["Una col·lecció d'històries curtes repartides per diferents eres, des de l'Enterprise de Pike fins al futur llunyà.", "Antologia repartida entre diverses eres de Trek"],
        "Star Trek: Discovery": ["Comença com una preqüela de T.O.S. i més endavant salta al futur llunyà, ampliant dues eres Trek molt diferents.", "Salta del segle XXIII al XXXII després d'un salt temporal extrem"],
        "Star Trek: Strange New Worlds": ["L'Enterprise de Pike recupera l'esperit clàssic d'exploració i aventura.", "Situada just abans de la missió original de Kirk"],
        "Star Trek: The Animated Series": ["Una continuació animada directa de la tripulació clàssica amb les mateixes veus principals.", "Dates estel·lars aprox. 5371-6334"],
        "Star Trek: The Next Generation": ["Picard rellança Star Trek per a una nova generació a bord d'una nova Enterprise.", "Dates estel·lars aprox. 41153-47988"],
        "Star Trek: Deep Space Nine": ["Un drama coral polític, espiritual i bèl·lic situat en una estació espacial fronterera.", "Dates estel·lars aprox. 46379-52861"],
        "Star Trek: Voyager": ["La USS Voyager queda atrapada al Quadrant Delta i ha d'intentar tornar a casa durant anys.", "Dates estel·lars aprox. 48315-54973"],
        "Star Trek: Lower Decks": ["Una comèdia animada sobre oficials júnior molt connectada amb el cànon clàssic i modern de Trek.", "Dates estel·lars aprox. 57436-59499"],
        "Star Trek: Prodigy": ["Una jove tripulació aprèn a convertir-se en una autèntica tripulació estel·lar mentre explora la galàxia.", "Després de Voyager, amb Janeway com a referència clau"],
        "Star Trek: Picard": ["Jean-Luc Picard torna dècades després per tancar grans fils de la seva vida i de la seva generació.", "Després de Nemesis i del final de l'era TNG"],
        "Star Trek: Starfleet Academy": ["Una nova sèrie Trek centrada en els cadets i la formació de l'Acadèmia de la Flota Estel·lar al segle XXXII.", "Situada després de l'era de futur llunyà de Discovery a l'Acadèmia de la Flota Estel·lar del segle XXXII"]
      }
    };
    var labels = labelTranslations[language] || labelTranslations.es;
    var translated = ((seriesTranslationsByLanguage[language] || {})[item.title]) || [];

    return {
      summary: translated[0] || item.summary,
      releaseLabelText: labels.releaseLabelText,
      timelineLabelText: labels.timelineLabelText,
      stardateLabelText: labels.stardateLabelText,
      releaseBadge: item.releaseLabel,
      stardate: translated[1] || item.stardateLabel
    };
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

  function hydrateClassicSeasonData() {
    return Promise.all([
      import("./series-episode-data.js"),
      import("./series-cast-data.js"),
      import("./series-episode-translations.js")
    ]).then(function (modules) {
      var episodeModule = modules[0];
      var castModule = modules[1];
      var translationModule = modules[2];
      var tosEpisodeSeasons = episodeModule.SERIES_EPISODE_DETAILS["star-trek-the-original-series"] || [];
      var tosRegularCast = castModule.SERIES_CAST_DETAILS["star-trek-the-original-series"] || [];
      var tosSynopsisTranslations = translationModule.SERIES_EPISODE_TRANSLATIONS["star-trek-the-original-series"] || [];

      season = Object.assign({}, season, {
        episodes: season.episodes.map(function (episode, index) {
          var enrichedSeason = tosEpisodeSeasons[seasonId - 1] || [];
          var enrichedEpisode = enrichedSeason[index] || {};
          var translatedSeason = tosSynopsisTranslations[seasonId - 1] || [];
          var translatedSynopsis = translatedSeason[index] || {};

          return Object.assign({}, episode, {
            synopsis: enrichedEpisode.synopsis || episode.summary,
            synopsisTranslations: translatedSynopsis,
            guestCast: enrichedEpisode.guestCast || [],
            regularCast: tosRegularCast,
            image: enrichedEpisode.image || "",
            runtime: enrichedEpisode.runtime || "",
            productionCode: enrichedEpisode.productionCode || "",
            stardate: enrichedEpisode.stardate || "",
            overallNumber: enrichedEpisode.overallNumber || String(episode.number),
            displayNumber: enrichedEpisode.displayNumber || String(episode.number),
            date: enrichedEpisode.date || episode.date
          });
        })
      });
    }).catch(function () {
      season = Object.assign({}, season, {
        episodes: season.episodes.map(function (episode) {
          return Object.assign({}, episode, {
            synopsis: episode.summary,
            synopsisTranslations: {},
            guestCast: [],
            regularCast: [],
            image: "",
            runtime: "",
            productionCode: "",
            stardate: "",
            overallNumber: String(episode.number),
            displayNumber: String(episode.number)
          });
        })
      });
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
    var language = getLanguage();
    var regularActorNames = (episode.regularCast || []).map(function (credit) {
      return String(credit).split(" como ")[0];
    });
    var filteredGuestCast = (episode.guestCast || []).filter(function (credit) {
      var actorName = String(credit).split(" como ")[0];
      return regularActorNames.indexOf(actorName) === -1;
    });
    var meta = ["Emision original: " + episode.date];

    if (episode.productionCode) {
      meta.push("Codigo: " + episode.productionCode);
    }
    if (episode.stardate) {
      meta.push("Fecha estelar: " + episode.stardate);
    }
    if (episode.runtime) {
      meta.push("Duracion: " + episode.runtime + " min");
    }

    var localizedSynopsis = (episode.synopsisTranslations && episode.synopsisTranslations[language]) || episode.synopsis || episode.summary;

    return [
      '<article class="episode-card">',
      '  <img class="episode-card__image" src="' + (episode.image || buildEpisodeArt(episode)) + '" alt="Ilustracion del episodio ' + episode.number + ": " + episode.title + '">',
      '  <div class="episode-card__content">',
      '    <div class="episode-card__top">',
      "      <div>",
      '        <span class="episode-card__number">Episodio ' + episode.number + "</span>",
      '        <h3 class="episode-card__title">' + episode.title + "</h3>",
      '        <p class="episode-card__meta">' + meta.join(" | ") + "</p>",
      "      </div>",
      "    </div>",
      "    <p>" + localizedSynopsis + "</p>",
      "    <p><strong>Reparto principal:</strong> " + (episode.regularCast || []).join(" | ") + "</p>",
      (filteredGuestCast.length ? "    <p><strong>Invitados y secundarios:</strong> " + filteredGuestCast.join(" | ") + "</p>" : ""),
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
        var localizedSynopsis = (episode.synopsisTranslations && episode.synopsisTranslations[getLanguage()]) || episode.synopsis || "";
        var haystack = normalize(
          episode.number + " " +
          episode.title + " " +
          episode.summary + " " +
          localizedSynopsis + " " +
          episode.date + " " +
          (episode.regularCast || []).join(" ") + " " +
          (episode.guestCast || []).join(" ")
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

    var seasonShortcutLabels = {
      es: {
        noPages: "Esta serie todavía no tiene temporadas detalladas en la web.",
        season: "Temporada",
        episodes: "episodios"
      },
      en: {
        noPages: "This series does not yet have detailed season pages on the site.",
        season: "Season",
        episodes: "episodes"
      },
      fr: {
        noPages: "Cette série n'a pas encore de pages de saison détaillées sur le site.",
        season: "Saison",
        episodes: "épisodes"
      },
      ru: {
        noPages: "У этого сериала пока нет подробных страниц сезонов на сайте.",
        season: "Сезон",
        episodes: "эпизодов"
      },
      uk: {
        noPages: "Цей серіал поки що не має докладних сторінок сезонів на сайті.",
        season: "Сезон",
        episodes: "епізодів"
      },
      ca: {
        noPages: "Aquesta sèrie encara no té pàgines de temporada detallades al web.",
        season: "Temporada",
        episodes: "episodis"
      }
    };
    var shortcutLabels = seasonShortcutLabels[getLanguage()] || seasonShortcutLabels.es;
    var seasonEntry = findSeriesSeasonEntry(seriesSlug);

    if (!seasonEntry || !seasonEntry.seasons.length) {
      homeSeriesExtraLabel.textContent = t("home.seasonsLabel");
      homeSeasonShortcuts.hidden = true;
      homeSeriesExtraText.hidden = false;
      homeSeriesExtraText.textContent = shortcutLabels.noPages;
      return;
    }

    homeSeriesExtraLabel.textContent = t("home.seasonsLabel");
    homeSeasonShortcuts.hidden = false;
    homeSeriesExtraText.hidden = true;
    homeSeriesExtraText.textContent = "";
    homeSeasonShortcuts.setAttribute("aria-label", "Temporadas de " + seasonEntry.title);
    homeSeasonShortcuts.innerHTML = seasonEntry.seasons.map(function (seasonItem) {
      var suffix = seasonItem.episodesCount
        ? " | " + seasonItem.episodesCount + " " + shortcutLabels.episodes
        : "";

      return '<a class="season-selector__link quick-map__chip" href="' + seasonItem.url + '">' + shortcutLabels.season + " " + seasonItem.number + suffix + "</a>";
    }).join("");
  }

  function renderHomeSeasonCards() {
    if (!homeSeasonGrid) {
      return;
    }

    homeSeasonGrid.innerHTML = [1, 2, 3].map(function (seasonNumber) {
      var seasonData = SEASONS[seasonNumber];
      var localized = getLocalizedSeasonOverview(seasonData);

      return [
        '<article class="season-overview-card" data-season-card="' + seasonNumber + '">',
        '  <p class="season-overview-card__eyebrow">' + localized.badge + "</p>",
        "  <h3>" + localized.title + "</h3>",
        "  <p>" + localized.text + "</p>",
        '  <div class="season-overview-card__meta">',
        '    <span class="timeline__tag">' + localized.episodesLabel + "</span>",
        '    <span class="timeline__tag">' + seasonData.years + "</span>",
        "  </div>",
        '  <p class="season-overview-card__focus"><strong>' + localized.keyLabel + "</strong> " + localized.focus + "</p>",
        '  <a class="button button--primary" href="' + getSeasonUrl(seasonData.number) + '">' + localized.openLabel + "</a>",
        "</article>"
      ].join("");
    }).join("");
  }

  function buildSeriesCard(item) {
    var localized = getLocalizedSeriesCardContent(item);

    return [
      '<a class="series-card series-card--link" href="' + getSeriesDetailUrl(item.title) + '">',
      '  <div class="series-card__top">',
      "    <div>",
      "      <h3>" + item.title + "</h3>",
      '      <p class="series-card__summary">' + localized.summary + "</p>",
      "    </div>",
      '    <span class="series-card__release">' + localized.releaseBadge + "</span>",
      "  </div>",
      '  <div class="series-card__meta">',
      '    <p><strong>' + localized.releaseLabelText + "</strong> " + item.releaseLabel + "</p>",
      '    <p><strong>' + localized.timelineLabelText + "</strong> " + item.timelineLabel + "</p>",
      '    <p><strong>' + localized.stardateLabelText + "</strong> " + (localized.stardate || item.stardateLabel) + "</p>",
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

  function setupQuickVideoModal() {
    if (!quickVideoModal || !openQuickVideoModalButton) {
      return;
    }

    function openModal() {
      if (typeof quickVideoModal.showModal === "function") {
        quickVideoModal.showModal();
      } else {
        quickVideoModal.setAttribute("open", "open");
      }
    }

    function closeModal() {
      if (typeof quickVideoModal.close === "function") {
        quickVideoModal.close();
      } else {
        quickVideoModal.removeAttribute("open");
      }
    }

    openQuickVideoModalButton.addEventListener("click", openModal);

    if (closeQuickVideoModalButton) {
      closeQuickVideoModalButton.addEventListener("click", closeModal);
    }

    quickVideoModal.addEventListener("click", function (event) {
      if (event.target === quickVideoModal) {
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

      var seriesDetailLabels = {
        es: {
          seasons: "temporadas",
          episodesPerSeason: "capítulos por temporada",
          chronology: "cronología",
          release: "emisión"
        },
        en: {
          seasons: "seasons",
          episodesPerSeason: "episodes per season",
          chronology: "chronology",
          release: "release"
        },
        fr: {
          seasons: "saisons",
          episodesPerSeason: "épisodes par saison",
          chronology: "chronologie",
          release: "diffusion"
        },
        ru: {
          seasons: "сезона",
          episodesPerSeason: "эпизодов по сезонам",
          chronology: "хронология",
          release: "показ"
        },
        uk: {
          seasons: "сезони",
          episodesPerSeason: "епізодів по сезонах",
          chronology: "хронологія",
          release: "показ"
        },
        ca: {
          seasons: "temporades",
          episodesPerSeason: "episodis per temporada",
          chronology: "cronologia",
          release: "emissió"
        }
      };
      var detailLabels = seriesDetailLabels[getLanguage()] || seriesDetailLabels.es;
      var selectedSeries = universeSeries.find(function (item) {
        return item.title === seriesTitle;
      }) || universeSeries[0];

      if (homeSeriesDetail) {
        var breakdownText = selectedSeries.seasonBreakdown
          ? detailLabels.episodesPerSeason + ": " + selectedSeries.seasonBreakdown + " | "
          : "";

        homeSeriesDetail.textContent =
          selectedSeries.seasonsCount +
          " " +
          detailLabels.seasons +
          " | " +
          breakdownText +
          detailLabels.chronology +
          ": " +
          selectedSeries.timelineLabel +
          " | " +
          detailLabels.release +
          ": " +
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
    setupAnniversaryIntro();
    document.title = "Star Trek - Universo";
    localizeHomeStatic();
    renderHomeStats();
    renderHomeSeasonCards();
    renderFranchiseSeries("release");
    setupSeriesSort();
    setupMoviesModal();
    setupQuickVideoModal();
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
  hydrateClassicSeasonData().finally(function () {
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
  });
}());
